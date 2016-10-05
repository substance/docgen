var b = require('substance-bundler')
var bundleCSS = require('./.make/bundleCSS')
var bundleJS = require('./.make/bundleJS')
var fs = require('fs')
var path = require('path')
var glob = require('glob')

b.task('substance', function() {
  b.make('substance')
})

b.task('clean', function() {
  b.rm('dist')
  b.rm('.example')
})

b.task('vendor', function() {
  b.custom('Bundling vendor.js', {
    src: './.make/vendor.js',
    dest: './dist/vendor.js',
    execute: function() {
      return bundleJS({
        src: './.make/vendor.js',
        dest: './dist/vendor.js',
        browserify: {
          standalone: 'vendor'
        }
      })
    }
  })
})

b.task('api', function() {
  b.js('./src/docgen.js', {
    external: ['glob', 'fs', 'substance', {
      global: 'vendor',
      path: path.resolve(__dirname, 'dist', 'vendor.js')
    }],
    commonjs: { include: [
      'node_modules/lodash/**'
    ]},
    targets: [{
      dest: './dist/docgen.js',
      format: 'cjs', moduleName: 'docgen'
    }]
  })
})

var READER = "./dist/reader/"
b.task('reader', ['clean', 'vendor', 'api'], function() {
  b.copy('./src/index.html', READER)
  b.copy('./node_modules/substance/dist', READER+'substance')
  b.copy('./node_modules/font-awesome', READER+'font-awesome')
  b.copy('./node_modules/highlight.js/styles/github.css', READER+'github.css')
  b.copy('./src/reader.css', READER)
  b.copy('./dist/vendor.js', READER)
  b.js('./src/reader.js', {
    external: ['substance', {
      global: 'vendor',
      path: path.resolve(__dirname, 'dist', 'vendor.js')
    }],
    commonjs: { include: [
      'node_modules/lodash/**'
    ]},
    targets: [{
      dest: READER+'reader.js',
      format: 'umd', moduleName: 'reader'
    }]
  })
})


b.task('default', ['substance', 'clean', 'vendor', 'api', 'reader', 'example'])
