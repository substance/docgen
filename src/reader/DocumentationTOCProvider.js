import { TOCProvider } from 'substance'

// Documentation consists of chapters and APINodes.
// The TOC shows chapter titles and names of functions and classes
class DocumentationTOCProvider extends TOCProvider {

  computeEntries() {
    const doc = this.getDocument()
    let entries = []
    let queue = doc.get('body').nodes.slice()
    let level = 0
    while (queue.length >0) {
      const id = queue.shift()
      const node = doc.get(id)
      const entry = {
        id: node.id,
        level: level+1,
        node: node
      }
      switch (node.type) {
        case 'chapter':
          entry.name = node.title
          entry.level = node.level
          level = node.level
          break
        case 'file':
          // FileNodes do not appear in the TOC, instead their content is flattened
          queue = node.members.concat(queue)
          continue
        case 'class':
        case 'function':
          entry.name = node.name
          break
        default:
          continue
      }
      entries.push(entry)
    }
    return entries
  }
}

export default DocumentationTOCProvider