import DocumentedNode from './DocumentedNode'

class EventNode extends DocumentedNode {}

EventNode.type = 'event'

EventNode.define({
  parent: 'id',
  name: 'string',
  params: { type: ['array', 'object'], default: [] } // [{name: 'doc', type: 'model/Document', description: 'A Substance document instance'}]
})

EventNode.isBlock = true

export default EventNode
