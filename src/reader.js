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
  Component.mount(DocumentationReader, {
    doc: doc,
    configurator: configurator
  }, 'body')
}
