import { JSONConverter } from 'substance'
import Documentation from './Documentation'

const converter = new JSONConverter()

function importDocumentation(json) {
  var doc = new Documentation()
  converter.importDocument(doc, json)
  return doc
}

export default importDocumentation
