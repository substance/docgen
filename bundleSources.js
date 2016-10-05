var fs = require('fs')

module.exports = function(files, output, config) {
  var data = {}
  files.forEach(function(file) {
    var src = fs.readFileSync(file).toString()
    var fileId = file.replace(/\\/g, '/')
    data[fileId] = src
  })
  var lines = [
    'window.SOURCES = ' + JSON.stringify(data),
    'window.CONFIG = ' + JSON.stringify(config)
  ]
  fs.writeFileSync(output, lines.join('\n'))
}
