'use strict'
/* eslint-disable no-console */

var Component = require('substance/ui/Component')
var DocumentationReader = require('substance/doc/DocumentationReader')
var importDocumentation = require('substance/doc/model/importDocumentation')
var Configurator = require('substance/util/Configurator')
var configurator = new Configurator(require('substance/doc/DocumentationReaderConfig'))

window.onload = function() {
  if (!window.DOCGEN_DATA) {
    throw new Error('DOCGEN_DATA must be provided first.')
  }
  var doc = importDocumentation(window.DOCGEN_DATA)
  window.doc = doc
  Component.mount(DocumentationReader, {
    doc: doc,
    configurator: configurator
  }, 'body')
}
