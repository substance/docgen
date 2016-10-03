import fs from 'fs'
import { glob } from '../vendor'
import generateDocumentation from './generateDocumentation'

function generate(config) {
  let fileList = []
  config.content.forEach(function(item) {
    switch(item.type) {
      case 'cover':
      case 'chapter':
        fileList.push(item.src)
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
  const doc = generateDocumentation(sources)
}

export default generate
