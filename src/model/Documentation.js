import { Document, Configurator } from 'substance'
import map from 'lodash/map'
import MemberIndex from './MemberIndex'
import DocumentationPackage from './DocumentationPackage'

class Documentation extends Document {
  constructor(data) {
    super(getSchema())

    this.title = data.title || ''
    this.repository = data.repository || ''
    this.sha = data.sha || ''
    this.defaultPage = data.defaultPage || 'about'

    this.create({
      type: 'container',
      id: 'pages'
    })

    this.addIndex('members', new MemberIndex(this))
  }
  getPages() {
    const _pages = this.get('pages')
    if (!_pages) return []
    return _pages.getNodes()
  }
  getDefaultPage() {
    return this.get(this.defaultPage)
  }
  getClasses(config) {
    return this._getByType('class', config)
  }
  getModules(config) {
    return this._getByType('module', config)
  }
  getAPIGroups(config) {
    const groups = {
      "class": [],
      "component": [],
      "module": []
    }
    const classes = this.getClasses(config)
    classes.forEach(function(clazz) {
      if (clazz.hasTag('component')) {
        groups['component'].push(clazz)
      } else {
        groups['class'].push(clazz)
      }
    })
    groups['module'] = this.getModules(config)
    return groups
  }
  _getByType(type, config) {
    let items = map(this.getIndex('type').get(type))
    if (config.skipPrivate || config.skipAbstract || config.skipInternal) {
      items = items.filter(function(item) {
        if (config.skipAbstract && item.isAbstract) return false
        if (config.skipPrivate && item.hasTag('private')) return false
        if (config.skipInternal && item.hasTag('internal')) return false
        return true
      })
    }
    items.sort(function(a, b) {
      if (a.name<b.name) return -1
      if (a.name>b.name) return 1
      return 0
    })
    return items
  }

  prepareHTML(html) {
    const linkRe = /\{@link\s+([^}]+)\s*\}/g
    let chunks = []
    let match, lastIdx = 0
    while ((match = linkRe.exec(html))) {
      const start = match.index
      const end = start + match[0].length
      const id = match[1]
      chunks.push(html.slice(lastIdx, start))
      chunks = chunks.concat('<a href="#', id, '">', id, '</a>')
      lastIdx = end
    }
    chunks.push(html.slice(lastIdx))
    return chunks.join('')
  }
}

Documentation.getNodeInfo = function(node) {
  var info = {
    isClassMember: false,
    isModuleMember: false,
    isConstructor: false,
    storage: '',
    typeDescr: ''
  }

  var hasParent = node.hasParent()
  var parent
  if (hasParent) {
    parent = node.getParent()
    info.isClassMember = (parent.type === 'class')
    info.isModuleMember = (parent.type === 'module')
  }

  if (node.type === 'ctor') {
    info.isConstructor = true
  }

  // Derive storage
  if (info.isConstructor) {
    info.storage = 'new '
  } else if (info.isClassMember && !node.isStatic) {
    info.storage = 'this.'
  } else if (info.isModuleMember) {
    info.storage = parent.name + '.'
  }

  // Derive typeDescr
  if (info.isConstructor) {
    info.typeDescr = 'Constructor'
  } else if (info.isClassMember || info.isModuleMember) {
    if (node.isStatic) {
      info.typeDescr = 'Static Method'
    } else {
      info.typeDescr = 'Method'
    }
  }
  return info
}

function getSchema() {
  const config = new Configurator()
  config.import(DocumentationPackage)
  return config.getSchema()
}

export default Documentation
