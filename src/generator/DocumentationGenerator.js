import { acorn, estreeWalker } from '../vendor'
import Documentation from '../model/Documentation'
import parseComment from './parseComment'

const STAR = '*'.charCodeAt(0)

/*
  Takes an `estree` AST and creates Documentation nodes
*/
class DocumentationGenerator {

  constructor() {
    this.doc = new Documentation()
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
          text = text.slice(1).trim()
          comments.push({ start: start, end: end, text: text })
        }
      }
    })
    const body = this.doc.get('body')
    const walker = new Walker(this.doc, fileId, comments)
    walker.walk(ast)
    const fileNode = walker._fileNode
    // only show nodes with documented content
    if (fileNode.members.length > 0) {
      body.nodes.push(fileNode.id)
    }
  }
}

class Walker {

  constructor(doc, fileId, comments) {
    this.doc = doc
    this.fileId = fileId
    this.comments = comments

    let name = _getBasename(fileId)
    this._fileNode = doc.create({
      type: 'file',
      id: fileId,
      name: name,
    })
    this._clazz = null
    this._classes = {}
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
      // module level functions
      case 'FunctionDeclaration':
        this._function(node, comment)
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
            this._property({
              name: node.key.name,
              loc: node.loc,
              isStatic: node.static
            }, comment)
            break
          case 'method':
            this._method({
              name: node.key.name,
              kind: node.kind,
              loc: node.loc
            }, comment)
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
      case 'ExpressionStatement':
        if (node.expression.type === 'AssignmentExpression') {
          const expr = node.expression
          if (expr.left.type === 'MemberExpression' &&
              expr.left.object.type === 'Identifier' &&
              expr.left.property.type === 'Identifier') {
            const assignee = expr.left.object.name
            const name = expr.left.property.name
            const clazz = this._classes[assignee]
            if (clazz) {
              if (expr.right.type === 'FunctionExpression') {
                this._method({
                  name: name,
                  kind: 'method',
                  loc: expr.loc,
                  isStatic: true,
                  clazz: clazz
                }, comment)
              } else {
                this._property({
                  name: name,
                  loc: expr.loc,
                  isStatic: true,
                  clazz: clazz
                }, comment)
              }
            }
          }
        }
        context.skip()
        break
      case 'Program':
      case 'ClassBody':
        break
      case 'ImportDeclaration':
      case 'ExportNamedDeclaration':
      case 'ExportDefaultDeclaration':
      case 'Identifier':
        context.skip()
        break
      default:
        console.warn('Unsupported node type:', node.type)
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

  _class(node, comment) {
    // skip undocumented classes
    if (!comment) return false
    const module = this._fileNode
    const name = node.id.name
    const superClass = node.superClass ? node.superClass.name : null
    const clazz = this.doc.create({
      type: 'class',
      id: this.fileId+'@'+name,
      name: name,
      sourceFile: this.fileId,
      sourceLine: node.loc.start.line,
      parent: module.id,
      superClass: superClass,
      description: comment.description.body,
      isAbstract: comment.isAbstract,
    })
    module.members.push(clazz.id)
    this._clazz = clazz
    this._classes[name] = clazz
  }

  _ctor(node, comment) {
    const clazz = this._clazz
    const fileId = this.fileId
    const description = comment ? comment.description.body : ''
    const ctor = this.doc.create({
      type: 'ctor',
      id: fileId+'@'+clazz.name+'()',
      parent: clazz.id,
      sourceFile: fileId,
      sourceLine: node.loc.start.line,
      name: clazz.name,
      description: description
    })
    clazz.members.push(ctor.id)
  }

  _method(data, comment) {
    // skip undocumented methods
    if (!comment) return
    const clazz = this._clazz || data.clazz
    const name = data.name
    const fileId = this.fileId
    const isStatic = Boolean(data.isStatic)
    const sep = isStatic ? '.' : '#'
    const method = this.doc.create({
      type: 'method',
      id: fileId+'@'+clazz.name+sep+name+'()',
      parent: clazz.id,
      sourceFile: fileId,
      sourceLine: data.loc.start.line,
      name: name,
      description: comment.description.body,
      params: comment.params,
      returns: comment.returns,
      isStatic: isStatic,
      isPrivate: comment.isPrivate,
    })
    clazz.members.push(method.id)
  }

  _property(data, comment) {
    // skip undocumented functions
    if (!comment) return
    const clazz = this._clazz || data.clazz
    const name = data.name
    const fileId = this.fileId
    const isStatic = Boolean(data.isStatic)
    const sep = isStatic ? '.' : '#'
    const prop = this.doc.create({
      type: 'property',
      id: fileId+'@'+clazz.name+sep+name,
      parent: clazz.id,
      sourceFile: fileId,
      sourceLine: data.loc.start.line,
      name: name,
      description: comment.description.body,
      dataType: comment.dataType,
      isStatic: isStatic
    })
    clazz.members.push(prop.id)
  }

  _function(node, comment) {
    // skip undocumented functions
    if (!comment) return
    const module = this._fileNode
    const fileId = this.fileId
    const name = node.id.name
    const fun = this.doc.create({
      type: 'function',
      id: fileId+'@'+name+'()',
      parent: module.id,
      sourceFile: fileId,
      sourceLine: node.loc.start.line,
      name: name,
      description: comment.description.body,
      params: comment.params,
      returns: comment.returns
    })
    module.members.push(fun.id)
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

function _getBasename(path) {
  let idx = path.lastIndexOf('/')
  if (idx > -1) {
    return path.slice(idx+1)
  } else {
    return path
  }
}

export default DocumentationGenerator
