var fs = require('fs')
var sass = require('node-sass')

module.exports = function(opts) {
  var src = opts.src
  var dest = opts.dest
  return new Promise(function(resolve, reject) {
    sass.render({
      file: src
    }, function(err, result) {
      if (err) { return reject(err) }
      fs.writeFileSync(dest, result.css)
      resolve()
    })
  })
}
