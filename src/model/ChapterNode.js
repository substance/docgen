import { DocumentNode } from 'substance'

class ChapterNode extends DocumentNode {}

ChapterNode.type = 'chapter'

ChapterNode.define({
  title: 'text',
  level: 'number',
  description: { type: 'string', default: '' }, // plain HTML
})

export default ChapterNode
