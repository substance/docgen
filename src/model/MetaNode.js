import { DocumentNode } from 'substance'

class MetaNode extends DocumentNode {}

MetaNode.type = 'meta'

MetaNode.define({
  repository: 'string', // https://github.com/substance/substance
  sha: 'string',
})

export default MetaNode
