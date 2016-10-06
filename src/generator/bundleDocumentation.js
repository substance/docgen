import bundleData from './bundleData'
import isPlainObject from 'lodash/isPlainObject'

const path = require('path')
const fs = require('fs')
const vm = require('vm')

/**
  A task for `substance-bundler` that creates a deployable
  documentation
*/
function bundleDocumentation(bundler, params) {
  ['src', 'dest', 'config'].forEach(function(prop) {
    if (!params[prop]) {
      throw new Error(`${prop} is required`)
    }
  })
  const cwd = process.cwd()
  const src = params.src
  const dest = params.dest
  let config, configFile
  if (isPlainObject(params.config)) {
    config = params.config
  } else {
    configFile = params.config
  }
  const root = params.root || cwd
  let sources = src
  if (configFile) sources = sources.concat([configFile])
  bundler.copy('node_modules/substance-docgen/dist/reader/**/*', dest, {root: 'node_modules/substance-docgen/dist/reader'})
  bundler.custom('Generating documentation into '+dest, {
    src: sources,
    dest: dest+'/data.js',
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
      bundleData(files, '.docs/data.js', _config, params)
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
  if (!isPlainObject(result)) {
    throw new Error('docgen configuration must export a configuration object.')
  }
  return result
}

function _getConfigJSON(configFile) {
  const src = fs.readFileSync(configFile, 'utf8')
  return JSON.parse(src)
}

export default bundleDocumentation
