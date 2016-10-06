import fs from 'fs'
import { JSONConverter } from 'substance'
import generateDocumentation from './generateDocumentation'
import generateSite from './generateSite'

function bundleDocumentation(files, dest, config, mode) {
  const sources = _loadSources(files)
  let data
  if (mode === 'source') {
    data = [
      'window.SOURCES = ' + JSON.stringify(data),
      'window.CONFIG = ' + JSON.stringify(config)
    ].join('\n')
    return data
  } else {
    const doc = generateDocumentation(config, sources)
    if (mode === 'json') {
      const converter = new JSONConverter()
      data = converter.exportDocument(doc)
      data = [
        'window.DOCUMENTATION = ' + JSON.stringify(data),
        'window.CONFIG = ' + JSON.stringify(config)
      ].join('\n')
      return data
    } else {
      return generateSite(doc)
    }
  }
}

function _loadSources(files) {
  var sources = {}
  files.forEach(function(file) {
    var src = fs.readFileSync(file).toString()
    var fileId = file.replace(/\\/g, '/')
    sources[fileId] = src
  })
  return sources
}

export default bundleDocumentation
