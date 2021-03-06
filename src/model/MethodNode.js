import APINode from './APINode'

class MethodNode extends APINode {
  getParent() {
    return this.getDocument().get(this.parent)
  }
}

MethodNode.type = 'method'

MethodNode.define({
  parent: 'id', // id of parent class or module
  name: 'string',
  params: { type: ['array', 'object'], default: [] }, // [{name: 'doc', type: 'model/Document', description: 'A Substance document instance'}]
  returns: { type: 'object', optional: true }, // {type: 'model/Document', description: 'The updated document'}
  isStatic: { type: 'boolean', default: false },
  isPrivate: { type: 'boolean', default: false },
})

export default MethodNode
