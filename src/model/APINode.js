import { DocumentNode } from 'substance'

class APINode extends DocumentNode {
  constructor(doc, props) {
    super(doc, props)
    let _tags = {}
    this.tags.forEach(function(tag) {
      _tags[tag.type] = tag
    })
    this._tags = _tags
  }
  // Defaults to the regular type property
  getSpecificType() {
    return this.type
  }
  getAPIPage() {
    return this.getDocument().get(this.api)
  }
  hasTag(name) {
    return Boolean(this._tags[name])
  }
}

APINode.define({
  api: 'id',
  description: { type: 'string', optional: true }, // HTML
  example: { type: 'string', optional: true }, // HTML
  sourceFile: 'string', // ui/Component.js
  sourceLine: 'number',
  tags: { type: ['array', 'object'], default: [] }, // [ { name: 'type', string: '...', html: '...'}]
  isUndocumented: { type: 'boolean', default: false },
})

APINode.isBlock = true

APINode.prototype.isAPINode = true

export default APINode
