import { DocumentNode } from 'substance'

class APIPage extends DocumentNode {
  getTitle() {
    return 'API'
  }
}

APIPage.type = 'api-page'

APIPage.define({
  nodes: {type: ['array', 'id'], default: [] },
  description: {type: 'string', default: ''}
})

export default APIPage
