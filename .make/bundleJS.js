/* eslint-disable semi */
var fs = require('fs');
var browserify = require('browserify');

module.exports = function(opts) {
  opts = opts || {}
  var src = opts.src ;
  var dest = opts.dest;
  var external = opts.external || []
  var ignore = opts.ignore || []
  var bopts = opts.browserify || {}
  return new Promise(function(resolve, reject) {
    var b = browserify(src, bopts)
    external.forEach(function(m) {
      b.external(m)
    })
    ignore.forEach(function(m) {
      b.ignore(m)
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
