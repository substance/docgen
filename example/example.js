import { Configurator, substanceGlobals } from 'substance'
import DocumentationGenerator from '../src/generator/DocumentationGenerator'
import DocumentationReader from '../src/reader/DocumentationReader'
import DocumentationReaderPackage from '../src/reader/DocumentationReaderPackage'
import importDocumentation from '../src/model/importDocumentation'

substanceGlobals.DEBUG_RENDERING = true;

function _generateDocumentation() {
  const sources = window.SOURCES
  const generator = new DocumentationGenerator()
  const doc = generator.doc
  const files = Object.keys(sources)
  files.forEach(function(fileId) {
    var src = sources[fileId]
    generator.addJS(fileId, src)
  })
  doc.create({
    type: 'meta',
    id: 'meta',
    description: 'TODO: repository description',
    repository: 'https://github.com/substance/docgen.git',
    sha: '0000'
  })
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
  var doc = _generateDocumentation()
  window.doc = doc
  console.log(JSON.stringify(doc.toJSON(), null, 2))
  _openReader(doc)
})
