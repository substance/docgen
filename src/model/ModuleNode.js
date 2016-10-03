import APINode from './APINode'
import MemberContainerMixin from './MemberContainerMixin'

var MEMBER_CATEGORIES = {
  'classes': {name: 'classes', path: ['class']},
  'methods': {name: 'methods', path: ['method']},
  'properties': {name: 'properties', path: ['property']},
}

class ModuleNode extends APINode {
  getMemberCategories() {
    return MEMBER_CATEGORIES
  }
}

Object.assign(ModuleNode.prototype, MemberContainerMixin)

ModuleNode.type = 'module'

ModuleNode.define({
  name: 'string',
  members: { type: ['array', 'property'], default: [] }, // ['model/documentHelpers.getAllAnnotations']
})

ModuleNode.isBlock = true

export default ModuleNode

