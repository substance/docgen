import ClassNode from './ClassNode'

class SubstanceClassNode extends ClassNode {
  // Defaults to the regular type property
  getSpecificType() {
    var isComponent = this.hasTag('component')
    if (isComponent) {
      return this.isAbstract ? 'abstract-component': 'component'
    } else {
      return super.getSpecificType()
    }
  }
}

export default SubstanceClassNode
