var b = require('substance-bundler')
var bundleAPI = require('./.make/bundleAPI')
var bundleCSS = require('./.make/bundleCSS')
var bundleJS = require('./.make/bundleJS')

b.task('clean', function() {
  b.rm('dist')
})

b.task('docgen', function() {
  b.custom('Bundling docgen API...', {
    src: './src/docgen.js',
    dest: './dist/docgen.js',
    execute: function() {
      return bundleAPI({
        src: './src/docgen.js',
        dest: './dist/docgen.js'
      })
    }
  })
})

b.task('reader', function() {
  b.copy('./src/index.html', './dist/')
  b.copy('node_modules/font-awesome', './dist/font-awesome')
  b.custom('Bundling reader.css ...', {
    src: './src/reader.scss',
    dest: './dist/reader.css',
    execute: function() {
      return bundleCSS({
        src: './src/reader.scss',
        dest: './dist/reader.css'
      })
    }
  })
  b.custom('Bundling reader.js ...', {
    src: './src/reader.js',
    dest: './dist/reader.js',
    execute: function() {
      return bundleJS({
        src: './src/reader.js',
        dest: './dist/reader.js'
      })
    }
  })
  // b.js('./src/reader.js', {
  //   // buble necessary here, as travis has old browser versions
  //   ignore: ['cheerio', 'dom-serializer'],
  //   external: [],
  //   commonjs: {include: [
  //     'src/**',
  //     'node_modules/lodash/**',
  //     'node_modules/substance/**'
  //   ]},
  //   targets: [{
  //     dest: './dist/reader.js', format: 'umd', moduleName: 'tests'
  //   }]
  // })
})

b.task('default', ['clean', 'docgen', 'reader'])
