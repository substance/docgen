var b = require('substance-bundler')
var bundleAPI = require('./.make/bundleAPI')

b.task('clean', function() {
  b.rm('dist')
})

b.task('api', function() {
  b.custom('Bundle docgen API...', {
    src: './src/api.js',
    dest: './dist/api.js',
    execute: function() {
      return bundleAPI({
        src: './src/api.js',
        dest: './dist/api.js'
      })
    }
  })
})

b.task('default', ['clean', 'api'])
