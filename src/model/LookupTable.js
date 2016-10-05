import { NodeIndex, TreeIndex } from 'substance'
import getBasename from './getBasename'

const CLASS_PREFIX = /^([^.#]+)([.#])([^.#]+)/
const DOT = '.'.charCodeAt(0)

class LookupTable extends NodeIndex {

  constructor(doc) {
    super()
    this.doc = doc
    this.table = new TreeIndex.Arrays()
  }

  select(node) {
    return node.isAPINode
  }

  /*
    Classes:
      - fully-qualified: `ui/Component`
      - short: `Component`
    Instance Methods:
      - fully-qualified: ui/Component#foo()
      - short: Component#foo
    Instance Properties:
      - fully-qualified: ui/Component#baz
      - short: Component#baz
      - alias: if no name clash it is fine to register it as Component.bar
    Static Methods/Properties:
      - same but with '.'
  */
  create(node) {
    // get all aliases for which we want this node be registered
    let base = getBasename(node.id)
    switch (node.type) {
      case 'class':
      case 'module':
        this.table.add(base, node.id)
        break
      default:
        //
    }
  }

  delete(node) {
    let base = getBasename(node.id)
    this.table.remove(base, node.id)
  }

  clone() {
    return new LookupTable(this.doc)
  }

  lookupId(id, hints) {
    const doc = this.doc
    // the simplest case: id is fully qualified
    if (doc.contains(id)) {
      return id
    }
    // next we try use the short name
    // and see if it leads to something
    // e.g. 'Component' instead of 'ui/Component'
    const base = getBasename(id)
    let candidates = this.table.get(base) || []
    if (candidates.length === 1) {
      return candidates[0]
    } else if (candidates.length > 2) {
      return this._disambiguate(id, candidates, hints)
    }
    // now we look it is a composed id, e.g. Foo.bar
    let m
    if (candidates.length === 0) {
      m = CLASS_PREFIX.exec(id)
      if (m) {
        const parentId = this.lookupId(m[1])
        const parent = parentId ? doc.get(parentId) : null
        return this._lookupProp(parent, m[2], m[3])
      }
    }
    // giving up
    return ''
  }

  _lookupProp(parent, sep, name) {
    const doc = this.doc
    // try the given one first
    let id = parent.id+sep+name
    if (doc.contains(id)) return id
    // Maybe tried to access an instance prop using DOT notation
    if (parent.type === 'class' && sep.charCodeAt(0) === DOT) {
      id = parent.id+'#'+name
      if (doc.contains(id)) return id
    }
    // last we try to call that again but with '()''
    if (!/\(\)$/.exec(id)) {
      return this._lookupProp(parent, sep, name+'()')
    }
    return ''
  }

  _disambiguate(id, candidates, hints) { // eslint-disable-line
    // TODO: when we face a situation with name clashes
    // then we need to use the hints somehow, to disambiguate in a meaningful way
    console.warn('Multiple classes or modules exist with the same simple name', getBasename(id))
    return candidates[0]
  }

}

export default LookupTable
