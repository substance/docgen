var acorn = require('acorn')
var dox = require('dox')
var estreeWalker = require('estree-walker')
var glob = require('glob')
var highlightjs = require('highlight.js')
var commonmark = require('commonmark')
var minimatch = require('minimatch')

module.exports = {
  acorn: acorn,
  dox: dox,
  commonmark: commonmark,
  estreeWalker: estreeWalker,
  glob: glob,
  highlightjs: highlightjs,
  minimatch: minimatch
}
