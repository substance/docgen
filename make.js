var b = require('substance-bundler')
var bundleCSS = require('./.make/bundleCSS')
var bundleJS = require('./.make/bundleJS')
var fs = require('fs')
var path = require('path')

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

b.task('reader', function() {
  b.copy('./src/index.html', './dist/reader/')
  b.copy('node_modules/font-awesome', './dist/reader/font-awesome')
  b.copy('node_modules/substance/dist', './dist/reader/substance')
  b.custom('Bundling reader.css ...', {
    src: './src/reader.scss',
    dest: './dist/reader/reader.css',
    execute: function() {
      return bundleCSS({
        src: './src/reader.scss',
        dest: './dist/reader/reader.css'
      })
    }
  })
  b.js('./src/reader.js', {
    ignore: [ 'substance-cheerio' ],
    external: ['substance', {
      global: 'vendor',
      path: path.resolve(__dirname, 'dist', 'vendor.js')
    }],
    commonjs: { include: [
      'node_modules/lodash/**'
    ]},
    targets: [{
      dest: './dist/reader/reader.js',
      format: 'umd', moduleName: 'reader'
    }]
  })
})

b.task('example', function() {
  b.copy('./example/index.html', '.example/')
  b.copy('./node_modules/substance/dist', '.example/substance')
  b.copy('./node_modules/font-awesome', '.example/font-awesome')
  b.copy('./dist/reader/reader.css', '.example/')
  b.custom('Creating data file...', {
    src: 'example/**/@(*.js|*.md)',
    dest: '.example/data.js',
    execute: function(files) {
      var data = {}
      files.forEach(function(file) {
        var src = fs.readFileSync(file).toString()
        var fileId = path.relative(__dirname, file)
        fileId = fileId.replace(/\\/g, '/')
        data[fileId] = src
      })
      fs.writeFileSync('.example/data.js', "window.SOURCES = " + JSON.stringify(data))
    }
  })
  b.copy('./dist/vendor.js', '.example/')
  b.js('./example/example.js', {
    external: ['substance', {
      global: 'vendor',
      path: path.resolve(__dirname, 'dist', 'vendor.js')
    }],
    commonjs: { include: [
      'node_modules/lodash/**'
    ]},
    targets: [{
      dest: '.example/example.js',
      format: 'umd', moduleName: 'generator'
    }]
  })
})

b.task('default', ['clean', 'vendor', 'api', 'reader', 'example'])
