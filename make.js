var b = require('substance-bundler')

b.task('substance:css', function() {
  b.make('substance', 'css')
})

b.task('clean', function() {
  b.rm('dist')
  b.rm('.example')
})

b.task('vendor', function() {
  b.browserify('./.make/vendor.js', {
    dest: './dist/vendor.js',
    exports: ['acorn','dox','commonmark','estreeWalker','highlightjs','minimatch']
  })
})

b.task('api', function() {
  b.js('./src/docgen.js', {
    target: {
      dest: './dist/docgen.js',
      format: 'cjs', moduleName: 'docgen'
    },
    external: [
      'glob', 'fs', 'path',
    ],
    commonjs: true,
    buble: true
  })
})

var READER = "./dist/reader/"
b.task('reader', ['clean', 'substance:css', 'vendor', 'api'], function() {
  b.copy('./src/index.html', READER)
  b.copy('./node_modules/substance/dist', READER+'substance')
  b.copy('./node_modules/highlight.js/styles/github.css', READER+'github.css')
  b.copy('./src/reader.css', READER)
  b.copy('./dist/vendor.js', READER)
  b.js('./src/reader.js', {
    target: {
      dest: READER+'reader.js',
      format: 'umd', moduleName: 'reader'
    },
    commonjs: true,
  })
})

b.task('default', ['clean', 'vendor', 'api', 'reader'])
