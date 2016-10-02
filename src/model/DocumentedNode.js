import { DocumentNode } from 'substance'

class DocumentedNode extends DocumentNode {
  // Defaults to the regular type property
  getSpecificType() {
    return this.type
  }
}

DocumentedNode.type = 'source-code'

DocumentedNode.define({
  description: { type: 'string', optional: true }, // HTML
  example: { type: 'string', optional: true }, // HTML
  sourceFile: 'string', // ui/Component.js
  sourceLine: 'number',
  isPrivate: { type: 'boolean', default: false },
  tags: { type: ['array', 'object'], default: [] }, // [ { name: 'type', string: '...', html: '...'}]
})

DocumentedNode.isBlock = true

export default DocumentedNode
