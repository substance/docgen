import { DocumentNode } from 'substance'

class CoverNode extends DocumentNode {}

CoverNode.type = 'cover'

CoverNode.define({
  title: 'text',
  description: { type: 'string', default: '' }, // plain HTML
})

export default CoverNode
