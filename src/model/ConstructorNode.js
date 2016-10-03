import APINode from './APINode'

class ConstructorNode extends APINode {}

// ATTENTION: we have to use 'ctor' has constructor is a key property of
// every object
ConstructorNode.type = 'ctor';

ConstructorNode.define({
  parent: 'id', // id of parent class or module
  name: 'string',
  params: { type: ['array', 'object'], default: [] },
  isPrivate: { type: 'boolean', default: false },
});

export default ConstructorNode
