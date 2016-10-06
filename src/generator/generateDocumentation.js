import { minimatch } from '../vendor'
import Documentation from '../model/Documentation'
import APIGenerator from './APIGenerator'
import markdownConverter from './markdownConverter'

function generateDocumentation(config, sources) {
  const doc = new Documentation(config)
  const pages = doc.get('pages')
  let currentPage = null
  config.content.forEach(function(item) {
    switch (item.type) {
      case 'page':
        currentPage = _page(doc, sources, item)
        pages.nodes.push(currentPage.id)
        break
      case 'section':
        if (!currentPage) throw new Error('Create a page first.')
        _section(doc, sources, currentPage, item)
        break
      case 'api':
        currentPage = _api(doc, sources, item)
        pages.nodes.push(currentPage.id)
        currentPage = null
        break
      default:
        console.error('Unsupported documentation type', item.type)
    }
  })
  return doc
}

function _page(doc, sources, item) {
  const src = sources[item.src]
  const html = src ? markdownConverter.toHtml(src) : ''
  return doc.create({
    type: 'page',
    id: item.id,
    title: item.title,
    description: html
  })
}

function _section(doc, sources, page, item) {
  const src = sources[item.src]
  const html = src ? markdownConverter.toHtml(src) : ''
  const sec = doc.create({
    type: 'section',
    id: item.id,
    page: page.id,
    title: item.title,
    level: item.level,
    description: html
  })
  page.sections.push(sec.id)
  return sec
}

function _api(doc, sources, item) {
  const src = sources[item.src]
  const fileList = Object.keys(sources)
  const html = src ? markdownConverter.toHtml(src) : ''
  const apiPage = doc.create({
    type: 'api-page',
    id: item.id || 'api',
    description: html
  })
  const generator = new APIGenerator(apiPage)
  let files = item.files.map(function(file) {
    if (file.indexOf('*')>-1) {
      return fileList.filter(minimatch.filter(file))
    } else {
      return file
    }
  })
  files = Array.prototype.concat.apply([], files)
  files.sort()
  files.forEach(function(fileId) {
    const src = sources[fileId]
    if (src) {
      generator.addJS(fileId, src)
    }
  })
  return apiPage
}

export default generateDocumentation
