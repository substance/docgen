import { Component, Configurator } from 'substance'
import DocumentationReader from './reader/DocumentationReader'
import DocumentationReaderPackage from './reader/DocumentationReaderPackage'
import importDocumentation from './model/importDocumentation'

window.onload = function() {
  if (!window.DOCGEN_DATA) {
    throw new Error('DOCGEN_DATA must be provided first.')
  }
  var configurator = new Configurator().import(DocumentationReaderPackage)
  var doc = importDocumentation(window.DOCGEN_DATA)
  window.doc = doc
  DocumentationReader.mount({
    doc: doc,
    configurator: configurator
  }, window.document.body)
}
