import { Configurator, substanceGlobals, JSONConverter } from 'substance'
import Documentation from './model/Documentation'
import DocumentationReader from './reader/DocumentationReader'
import DocumentationReaderPackage from './reader/DocumentationReaderPackage'
import generateDocumentation from './generator/generateDocumentation'

substanceGlobals.DEBUG_RENDERING = true

// This is used during development, to have the full generation
// done in the browser
function _generateDocumentation() {
  const sources = window.SOURCES
  const config = window.CONFIG
  return generateDocumentation(config, sources)
}

// This is can be used to serve a previously generated
// documentation and just render it dynamically
function _importDocumentation() {
  const config = window.CONFIG
  const data = window.DOCUMENTATION
  const converter = new JSONConverter()
  const doc = new Documentation(config)
  return converter.importDocument(doc, data)
  return doc
}

function _openReader(doc) {
  var configurator = new Configurator().import(DocumentationReaderPackage)
  DocumentationReader.mount({
    doc: doc,
    configurator: configurator
  }, window.document.body)
}

window.addEventListener('load', function() {
  var doc
  if (!window.DOCUMENTATION) {
    doc = _generateDocumentation()
  } else {
    doc = _importDocumentation()
  }
  window.doc = doc
  _openReader(doc)
})
