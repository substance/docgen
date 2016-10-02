import DocumentedNode from './DocumentedNode'
import MemberContainerMixin from './MemberContainerMixin'

const MEMBER_CATEGORIES = {
  'ctor': {name: 'ctor', path: ['class', 'ctor']},
  'instance-methods': {name: 'instance-methods', path: ['instance', 'method']},
  'instance-properties': {name: 'instance-properties', path: ['instance', 'property']},
  'instance-events': {name: 'instance-events', path: ['instance', 'event']},
  'class-methods': {name: 'class-methods', path: ['class', 'method']},
  'class-properties': {name: 'class-properties', path: ['class', 'property']},
  'inner-classes': {name: 'inner-classes', path: ['class', 'class']}
}

// var INHERITED = ['instance-methods', 'instance-properties', 'class-methods', 'class-properties']
const INHERITED = ['instance-methods', 'instance-properties']

class ClassNode extends DocumentedNode {

  getSpecificType() {
    if (this.isAbstract) return 'abstract-class'
    return 'class'
  }

  getMemberCategories() {
    return MEMBER_CATEGORIES
  }


  getInheritedMembers(config) {
    var inheritedMembers = {}
    var doc = this.getDocument()
    var superClass = this.superClass ? doc.get(this.superClass) : null
    if (superClass) {
      inheritedMembers = superClass.getInheritedMembers(config)
      INHERITED.forEach(function(group) {
        var members = superClass.getCategoryMembers(MEMBER_CATEGORIES[group], config)
        if (members.length > 0) {
          inheritedMembers[group] = inheritedMembers[group] || {}
          members.forEach(function(member) {
            inheritedMembers[group][member.id] = member
          })
        }
      })
    }
    return inheritedMembers
  }

}

Object.assign(ClassNode.prototype, MemberContainerMixin)

ClassNode.type = 'class'
ClassNode.define({
  parent: 'id',
  name: 'string',
  members: { type: ['array', 'id'], default: [] },
  isAbstract: { type: 'boolean', default: false },
  superClass: { type: 'id', optional: true }
})

ClassNode.isBlock = true

export default ClassNode

