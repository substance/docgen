import fs from 'fs'
import { JSONConverter } from 'substance'
import generateDocumentation from './generateDocumentation'

/**
  This helper generates a data file for the `dist/reader.js` bundle.

  If used with `options.debug`, all given source files
  are stored into a hash and converted into a {@link Documentation}
  on-the-fly when the reader is started.

  Otherwise, the conversion is done upfront, and stored as JSON.
*/
function bundleData(files, dest, config, options) {
  options = options || {}
  const sources = _loadSources(files)
  let data
  if (options.debug) {
    data = [
      'window.SOURCES = ' + JSON.stringify(data),
      'window.CONFIG = ' + JSON.stringify(config)
    ].join('\n')
  } else {
    const doc = generateDocumentation(config, sources)
    const converter = new JSONConverter()
    data = converter.exportDocument(doc)
    data = [
      'window.DOCUMENTATION = ' + JSON.stringify(data),
      'window.CONFIG = ' + JSON.stringify(config)
    ]
  }
  fs.writeFileSync(dest, data)
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

export default bundleData
