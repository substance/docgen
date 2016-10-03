import { Document, Configurator } from 'substance'
import MemberIndex from './MemberIndex'
import DocumentationPackage from './DocumentationPackage'

class Documentation extends Document {

  constructor() {
    super(getSchema())

    this.addIndex('members', new MemberIndex(this))
    this.create({
      type: 'container',
      id: 'body',
      nodes: []
    })
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
