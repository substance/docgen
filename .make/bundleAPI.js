/* eslint-disable semi */
var fs = require('fs');
var browserify = require('browserify');

module.exports = function(opts) {
  opts = opts || {}
  var src = opts.src ;
  var dest = opts.dest;
  var external = opts.external || []
  return new Promise(function(resolve, reject) {
    var b = browserify(src, {
      insertGlobalVars: {
        'process': undefined,
        'global': undefined,
        '__dirname': "",
        '__filename': "",
      },
      browserField: false,
      builtins: false,
      commondir: false,
      fullPaths: false,
      standalone: 'api'
    })
    external.forEach(function(m) {
      b.external(m)
    })
    b.bundle(function(err, buf) {
      if(err) {
        reject(err);
      } else {
        fs.writeFileSync(dest, buf.toString());
        resolve();
      }
    });
  });
}
