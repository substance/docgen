import { DocumentNode } from 'substance'

class Page extends DocumentNode {
  getTitle() {
    return this.title
  }
  getSections() {
    const doc = this.getDocument()
    return this.sections.map(function(id) {
      return doc.get(id)
    }).filter(Boolean)
  }
}

Page.type = 'page'

Page.define({
  title: 'string',
  description: 'string', // HTML
  sections: { type: ['array', 'id'], default: [] }
})

Page.prototype.isContentNode = true

export default Page
