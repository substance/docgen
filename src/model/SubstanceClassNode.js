import ClassNode from './ClassNode'
import find from 'lodash/find'

class SubstanceClassNode extends ClassNode {
  // Defaults to the regular type property
  getSpecificType() {
    var isComponent = false
    if (this.tags.length > 0) {
      isComponent = Boolean(find(this.tags, 'type', 'component'))
    }
    if (isComponent) {
      return this.isAbstract ? 'abstract-component': 'component'
    } else {
      return ClassNode.prototype.getSpecificType.call(this)
    }
  }
}

export default SubstanceClassNode
