import APINode from './APINode'

class FunctionNode extends APINode {
  getParent() {
    return this.document.get(this.parent)
  }
}

FunctionNode.type = 'function'

FunctionNode.define({
  parent: 'id',
  name: 'string',
  params: { type: ['array', 'object'], default: [] }, // [{name: 'doc', type: 'model/Document', description: 'A Substance document instance'}]
  returns: { type: 'object', optional: true }, // {type: 'model/Document', description: 'The updated document'}
})

FunctionNode.isBlock = true

export default FunctionNode
