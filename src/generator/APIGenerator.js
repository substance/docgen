import { acorn, estreeWalker } from '../vendor'
import parseComment from './parseComment'

const STAR = '*'.charCodeAt(0)

/*
  Takes an `estree` AST and creates Documentation nodes
*/
class APIGenerator {

  constructor(apiPage) {
    this.apiPage = apiPage
    this.doc = apiPage.getDocument()
  }

  addJS(fileId, src) {
    fileId = fileId.replace(/\\/g, "/")
    const comments = []
    const ast = acorn.parse(src, {
      ecmaVersion: 6,
      sourceType: "module",
      locations: true,
      onComment: function(block, text, start, end) {
        // only record block comments starting with /**
        if (block && text.charCodeAt(0) === STAR) {
          text = text.slice(1)
          comments.push({ start: start, end: end, text: text })
        }
      }
    })
    const walker = new Walker(this.doc, this.apiPage, fileId, comments)
    walker.walk(ast)
    // depending on the exports we create a ModuleNode
    // so that we can create minimal ids
    // only export default -> we use the fileId for the exported item (function, class, or object)
    // only named exports -> we create a module
    const hasDefaultExport = walker._exportDefault
    if (Object.keys(walker._items).length>0 && !hasDefaultExport) {
      console.error('ATM we support only modules with default export (one-class per file, and module as object): ', fileId)
    }
    if (hasDefaultExport) {
      const _export = walker._items[walker._exportDefault]
      if (_export) this._create(fileId, _export)
    }
  }

  _create(fileId, item) {
    // use the fileId
    const doc = this.doc
    const id = fileId.replace(/\.js$/, "")
    const apiId = this.apiPage.id
    item.id = id
    item.api = apiId
    const members = item.members
    delete item.members
    const node = doc.create(item)
    if (item.type === 'class') {
      node.members = members.map(function(m) {
        m.parent = id
        m.api = apiId
        const sep = m.isStatic ? '.' : '#'
        if (m.type === 'ctor') {
          m.id = id+"()"
        } else if (m.type === 'method') {
          m.id = id+sep+m.name+"()"
        } else if (m.type === 'property') {
          m.id = id+sep+m.name
        } else {
          throw new Error('Internal error.')
        }
        doc.create(m)
        return m.id
      })
    } else if (item.type === 'module') {
      node.members = members.map(function(m) {
        m.parent = id
        m.api = apiId
        const sep = '.'
        if (m.type === 'function') {
          m.id = id+sep+m.name+"()"
        } else if (m.type === 'property') {
          m.id = id+sep+m.name
        } else {
          throw new Error('Internal error.')
        }
        doc.create(m)
        return m.id
      })
    }
  }
}

class Walker {

  constructor(doc, apiPage, fileId, comments) {
    this.doc = doc
    this.apiPage = apiPage
    this.fileId = fileId
    this.comments = comments

    this._items = {}
    this._clazz = null
    this._exportDefault = null
  }

  enter(node, parent, context) {
    const comments = this.comments
    let comment = null
    if (comments.length > 0 && comments[0].start < node.start) {
      comment = comments.shift()
    }
    if (comment) {
      comment = parseComment(comment.text)
    }
    switch(node.type) {
      // function defined in a module
      case 'FunctionDeclaration':
        this._function({ name: node.id.name, loc: node.loc }, comment)
        context.skip()
        this.leave(node)
        break
      case 'ClassDeclaration':
        if (this._class(node, comment) === false) {
          context.skip()
          this.leave(node)
        }
        break
      // method = member function
      case 'MethodDefinition':
        switch(node.kind) {
          case 'constructor':
            this._ctor(node, comment)
            break
          case 'get':
            this._property({ name: node.key.name, loc: node.loc, isStatic: node.static }, comment)
            break
          case 'method':
            this._method({ name: node.key.name, kind: node.kind, loc: node.loc }, comment)
            break
          default:
            //
        }
        context.skip()
        // Note: skipping prevents this.leave() getting called
        // which is necessary, to cleanup skipped comments
        this.leave(node)
        break
      // analyze assignments on module level to
      // detect static props and methods
      // TODO: we should also look for Object.defineProperties etc
      // and for old school Class.prototype.property
      case 'ExpressionStatement':
        if (node.expression.type === 'AssignmentExpression') {
          const expr = node.expression
          if (expr.left.type === 'MemberExpression' &&
              expr.left.object.type === 'Identifier' &&
              expr.left.property.type === 'Identifier') {
            const assignee = expr.left.object.name
            const name = expr.left.property.name
            const item = this._items[assignee]
            if (item && item.type === 'class') {
              // Foo.bar = function() {}
              if (expr.right.type === 'FunctionExpression') {
                this._method({ name: name, kind: 'method', loc: expr.loc, isStatic: true, clazz: item }, comment)
              }
              // Foo.bar = "baz"
              else {
                this._property({ name: name, loc: expr.loc, isStatic: true, clazz: item }, comment)
              }
            } else if (item && item.type === 'module') {
              // mymodule.foo = function() {}
              if (expr.right.type === 'FunctionExpression') {
                this._function({ name: name, loc: expr.loc, module: item }, comment)
              }
            } else {
              // console.log('### AssignmentExpression', expr)
            }
          } else {
            // console.log('### AssignmentExpression', expr)
          }
        } else {
          // console.log('### ExpressionStatement', node)
        }
        context.skip()
        this.leave(node)
        break
      case 'VariableDeclaration':
        if (comment && comment.isModule) {
          const name = node.declarations[0].id.name
          this._module({ name: name, loc: node.loc }, comment)
        } else {
          // console.log('### VariableDeclaration', this.fileId, node)
        }
        context.skip()
        break
      case 'ExportNamedDeclaration':
        // console.log('### ExportNamedDeclaration', this.fileId, node)
        context.skip()
        break
      case 'ExportDefaultDeclaration':
        this._exportDefault = node.declaration.name
        context.skip()
        break
      case 'Program':
      case 'ClassBody':
        break
      case 'EmptyStatement':
      case 'IfStatement':
      case 'ImportDeclaration':
      case 'Identifier':
        context.skip()
        break
      default:
        console.warn('Unsupported node in %s at line %s', this.fileId, node.loc.start.line, node)
    }
  }

  leave(node) {
    // remove any comments found on skipped/passed nodes
    const comments = this.comments
    while( comments.length > 0 && comments[0].start < node.end ) {
      comments.shift()
    }
    switch(node.type) {
      case 'ClassDeclaration':
        this._clazz = null
        break
      default:
        // nothing
    }
  }

  _module(data, comment) {
    // skip undocumented classes
    if (!comment) return false
    const name = data.name
    const mod = {
      type: 'module',
      name: name,
      members: [],
      sourceFile: this.fileId,
      sourceLine: data.loc.start.line,
      description: comment.description.full,
      example: comment.example,
      tags: comment.tags,
    }
    this._items[name] = mod
  }

  _class(node, comment) {
    // skip undocumented classes
    if (!comment) return false
    const name = node.id.name
    const superClass = node.superClass ? node.superClass.name : null
    const clazz = {
      type: 'class',
      name: name,
      members: [],
      sourceFile: this.fileId,
      sourceLine: node.loc.start.line,
      superClass: superClass,
      description: comment.description.full,
      isAbstract: comment.isAbstract,
      example: comment.example,
      tags: comment.tags,
    }
    this._clazz = clazz
    this._items[name] = clazz
  }

  _ctor(node, comment) {
    const clazz = this._clazz
    const fileId = this.fileId
    const ctor = {
      type: 'ctor',
      parent: clazz,
      sourceFile: fileId,
      sourceLine: node.loc.start.line,
      name: clazz.name
    }
    if (comment) {
      ctor.description = comment.description.full
      ctor.example = comment.example
      ctor.tags = comment.tags
    }
    clazz.members.push(ctor)
  }

  _method(data, comment) {
    // skip undocumented methods
    if (!comment) return
    const clazz = this._clazz || data.clazz
    const name = data.name
    const fileId = this.fileId
    const isStatic = Boolean(data.isStatic)
    const method = {
      type: 'method',
      parent: clazz,
      sourceFile: fileId,
      sourceLine: data.loc.start.line,
      name: name,
      description: comment.description.full,
      params: comment.params,
      returns: comment.returns,
      isStatic: isStatic,
      tags: comment.tags,
      example: comment.example,
    }
    clazz.members.push(method)
  }

  _property(data, comment) {
    // skip undocumented functions
    if (!comment) return
    const clazz = this._clazz || data.clazz
    const name = data.name
    const fileId = this.fileId
    const isStatic = Boolean(data.isStatic)
    const prop = {
      type: 'property',
      parent: clazz,
      sourceFile: fileId,
      sourceLine: data.loc.start.line,
      name: name,
      description: comment.description.full,
      dataType: comment.dataType,
      isStatic: isStatic,
      tags: comment.tags,
      example: comment.example,
    }
    clazz.members.push(prop)
  }

  _function(data, comment) {
    // skip undocumented functions
    if (!comment) return
    const fileId = this.fileId
    const name = data.name
    const fun = {
      type: 'function',
      sourceFile: fileId,
      sourceLine: data.loc.start.line,
      name: name,
      description: comment.description.full,
      params: comment.params,
      returns: comment.returns,
      example: comment.example,
      tags: comment.tags,
    }
    if (data.module) {
      data.module.members.push(fun)
    } else {
      this._items[name] = fun
    }
  }

  walk(ast) {
    const self = this
    estreeWalker.walk(ast, {
      enter: function(node, parent) {
        self.enter(node, parent, this)
      },
      leave: function(node, parent) {
        self.leave(node, parent, this)
      }
    })
  }
}

export default APIGenerator
