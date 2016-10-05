import { DocumentNode } from 'substance'

class Section extends DocumentNode {
  getTitle() {
    return this.title || ''
  }
  getPage() {
    return this.getDocument().get(this.page)
  }
}

Section.type = 'section'

Section.define({
  // should be a page
  page: 'id',
  title: 'text',
  level: { type: 'number', default: 1 },
  description: { type: 'string', default: '' }, // plain HTML
})

Section.prototype.isContentNode = true

export default Section

