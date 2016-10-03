import { minimatch } from '../vendor'
import DocumentationGenerator from './DocumentationGenerator'
import markdownConverter from './markdownConverter'

function generateDocumentation(config, sources) {
  const generator = new DocumentationGenerator()
  const doc = generator.doc
  const fileList = Object.keys(sources)
  doc.create({
    type: 'meta',
    id: 'meta',
    repository: config.repository,
    sha: config.sha || '0000'
  })
  config.content.forEach(function(item) {
    let src, html, files, chapter
    const body = doc.get('body')
    switch (item.type) {
      case 'cover':
        src = sources[item.src]
        html = ''
        if (src) html = markdownConverter.toHtml(src)
        doc.create({
          type: 'cover',
          id: 'cover',
          title: item.title,
          description: html
        })
        break
      case 'chapter':
        src = sources[item.src]
        html = ''
        if (src) html = markdownConverter.toHtml(src)
        chapter = doc.create({
          type: 'chapter',
          title: item.title,
          level: item.level,
          description: html
        })
        body.nodes.push(chapter.id)
        break
      case 'api':
        files = fileList.filter(minimatch.filter(item.pattern))
        files.forEach(function(fileId) {
          const src = sources[fileId]
          if (src) {
            // NOTE: this will create FileNodes and add them to the body
            generator.addJS(fileId, src)
          }
        })
        break
      default:
        console.error('Unsupported documentation type', item.type)
    }
  })
  return doc
}

export default generateDocumentation
