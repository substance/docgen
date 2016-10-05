import { Configurator, substanceGlobals } from 'substance'
import DocumentationReader from '../src/reader/DocumentationReader'
import DocumentationReaderPackage from '../src/reader/DocumentationReaderPackage'
import generateDocumentation from '../src/generator/generateDocumentation'

substanceGlobals.DEBUG_RENDERING = true

function _generateDocumentation() {
  const sources = window.SOURCES
  const config = window.CONFIG
  return generateDocumentation(config, sources)
}

function _openReader(doc) {
  var configurator = new Configurator().import(DocumentationReaderPackage)
  DocumentationReader.mount({
    doc: doc,
    configurator: configurator
  }, window.document.body)
}

window.addEventListener('load', function() {
  var doc = _generateDocumentation()
  window.doc = doc
  console.info(JSON.stringify(doc.toJSON(), null, 2))
  _openReader(doc)
})
