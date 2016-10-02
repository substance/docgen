import Documentation from './Documentation'
import forEach from 'lodash/forEach'

function importDocumentation(nodes) {
  var documentation = new Documentation()
  // import data in a block with deactivated indexers and listeners
  // as the data contains cyclic references which
  // cause problems.
  documentation.import(function(tx) {
    var body = tx.get('body')
    forEach(nodes, function(node) {
      tx.create(node)
      if (node.type === 'namespace') {
        body.show(node.id)
      }
    })
  })

  return documentation
}

export default importDocumentation
