import bundleDocumentation from './bundleDocumentation'
import forEach from 'substance/util/forEach'
import isNil from 'substance/util/isNil'
import isString from 'substance/util/isString'

const path = require('path')
const fs = require('fs')
const vm = require('vm')

/**
  A task for `substance-bundler` that creates a deployable
  documentation
*/
function bundle(bundler, params) {
  ['src', 'dest', 'config'].forEach(function(prop) {
    if (!params[prop]) {
      throw new Error(`${prop} is required`)
    }
  })
  const cwd = process.cwd()
  const src = params.src
  const dest = params.dest
  const mode = params.mode || 'json'
  let config, configFile
  if (isString(params.config)) {
    configFile = params.config
  } else {
    config = params.config
  }
  const root = params.root || cwd
  let sources = src
  let output
  if (mode === 'site') {
    output = dest+'/index.html'
  } else {
    output = dest+'/data.js'
  }
  if (configFile) sources = sources.concat([configFile])
  if (mode !== 'site') {
    bundler.copy('node_modules/substance-docgen/dist/reader/**/*', dest, {root: 'node_modules/substance-docgen/dist/reader'})
  } else {
    bundler.copy('node_modules/substance-docgen/dist/reader/reader.css', dest)
    bundler.copy('node_modules/substance-docgen/dist/reader/github.css', dest)
    bundler.copy('node_modules/substance-docgen/dist/reader/substance/**/*.css', dest+'substance', { root: 'node_modules/substance-docgen/dist/reader/substance' })
  }
  bundler.custom('Generating documentation into '+dest, {
    src: sources,
    dest: output,
    execute: function(files) {
      let _config
      if (!config) {
        const _absPath = path.join(cwd, configFile)
        if (/\.js$/.exec(configFile)) {
          _config = _getConfigJS(_absPath)
        } else if (/\.json$/.exec(configFile)) {
          _config = _getConfigJSON(_absPath)
        } else {
          throw new Error('Unsupported docgen configuration file: ' + configFile)
        }
      }
      files = files.map(function(file) {
        return path.relative(root, file)
      })
      const output = bundleDocumentation(files, '.docs/data.js', _config, mode)
      if (mode === 'site') {
        forEach(output, function(html, file) {
          bundler.writeSync(path.join(dest, file), html)
        })
      } else {
        bundler.writeSync(dest+'/data.js', output)
      }
    }
  })
}

function _getConfigJS(configFile) {
  const exports = {}
  const sandbox = {
    "module": { exports: exports },
    "exports": exports,
    "__filename": configFile,
    "__dirname": path.dirname(configFile)
  }
  const src = fs.readFileSync(configFile, 'utf8')
  const script = new vm.Script(src)
  const context = new vm.createContext(sandbox)
  script.runInContext(context)
  const result = sandbox.module.exports
  if (isNil(result)) {
    throw new Error('docgen configuration must export a configuration object.')
  }
  return result
}

function _getConfigJSON(configFile) {
  const src = fs.readFileSync(configFile, 'utf8')
  return JSON.parse(src)
}

export default bundle
