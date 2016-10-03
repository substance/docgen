require('source-map-support').install()

import fs from 'fs'
import glob from 'glob'
import generateDocumentation from './generateDocumentation'
import { JSONConverter } from 'substance'

const converter = new JSONConverter()

function generate(config) {
  let fileList = []
  config.content.forEach(function(item) {
    switch(item.type) {
      case 'cover':
      case 'chapter':
        if (item.src) fileList.push(item.src)
        break
      case 'api':
        fileList = fileList.concat(glob.sync(item.pattern))
        break;
      default:
        console.error('Unsupported item', item.type)
    }
  })
  const sources = {}
  fileList.forEach(function(fileId) {
    const src = fs.readFileSync(fileId, 'utf8')
    sources[fileId] = src
  })
  const doc = generateDocumentation(config, sources)
  return converter.exportDocument(doc)
}

export default generate
