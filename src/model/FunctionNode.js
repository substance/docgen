import APINode from './APINode'

class FunctionNode extends APINode {
  getName() {
    return this.name
  }
  getParent() {
    return this.getDocument().get(this.parent)
  }
}

FunctionNode.type = 'function'

FunctionNode.define({
  parent: { type: 'id', optional: true },
  name: 'string',
  params: { type: ['array', 'object'], default: [] }, // [{name: 'doc', type: 'model/Document', description: 'A Substance document instance'}]
  returns: { type: 'object', optional: true }, // {type: 'model/Document', description: 'The updated document'}
})

FunctionNode.isBlock = true

export default FunctionNode
