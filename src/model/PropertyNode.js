import APINode from './APINode'

class PropertyNode extends APINode {
  getParent() {
    return this.getDocument().get(this.parent)
  }
}

PropertyNode.type = 'property'

PropertyNode.define({
  parent: 'id', // id of parent class or module
  name: 'string',
  dataType: { type: 'string', optional: true },
  isStatic: { type: 'boolean', default: false },
})

export default PropertyNode
