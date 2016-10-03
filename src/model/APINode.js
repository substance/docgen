import { DocumentNode } from 'substance'

class APINode extends DocumentNode {
  // Defaults to the regular type property
  getSpecificType() {
    return this.type
  }
}

APINode.type = 'source-code'

APINode.define({
  description: { type: 'string', optional: true }, // HTML
  example: { type: 'string', optional: true }, // HTML
  sourceFile: 'string', // ui/Component.js
  sourceLine: 'number',
  isPrivate: { type: 'boolean', default: false },
  tags: { type: ['array', 'object'], default: [] }, // [ { name: 'type', string: '...', html: '...'}]
})

APINode.isBlock = true

export default APINode
