import { NodeIndex, TreeIndex } from 'substance'

class MemberIndex extends NodeIndex {

  constructor(doc) {
    super()

    this.doc = doc
    this.index = new TreeIndex()
  }

  /**
    Selects all nodes which have a parent.

    @param {Node}
    @returns {Boolean} true if the given node should be added to the index.
   */
  select(node) {
    return node.hasParent()
  }

  _getPath(node, parentId) {
    var doc = this.doc
    parentId = parentId || node.parent
    var type = node.type
    var parent = doc.get(parentId)

    if (!parent) {
      console.error('Could not retrieve parent node of member.')
      return [parentId, type, node.name]
    }

    if (parent.type === "class") {
      if (node.isStatic || type === "ctor") {
        return [parentId, 'class', type, node.name]
      } else {
        return [parentId, 'instance', type, node.name]
      }
    } else {
      return [parentId, type, node.name]
    }
  }

  /**
    Called when a node has been created.

    @param {Node} node
   */
  create(node) {
    this.index.set(this._getPath(node), node)
  }

  /**
    Called when a node has been deleted.

    @param {Node} node
   */
  delete(node) {
    this.index.delete(this._getPath(node))
  }

  /**
    Called when a property has been updated.

    @param {Node} node
   */
  update(node, path, newValue, oldValue) {
    if (!this.select(node) || path[1] !== 'parent') return
    this.index.delete(this._getPath(node, oldValue))
    this.index.set(this._getPath(node, newValue), node)
  }

  clone() {
    return new MemberIndex(this.doc)
  }

}

export default MemberIndex
