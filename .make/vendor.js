var acorn = require('acorn')
var dox = require('dox')
var estreeWalker = require('estree-walker')
var highlightjs = require('highlight.js')
var commonmark = require('commonmark')
var minimatch = require('minimatch')

module.exports = {
  acorn: acorn,
  dox: dox,
  commonmark: commonmark,
  estreeWalker: estreeWalker,
  highlightjs: highlightjs,
  minimatch: minimatch
}
