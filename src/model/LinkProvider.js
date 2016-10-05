class LinkProvider {
  constructor(doc) {
    this.doc = doc
  }
  getURL(id, hints) {
    const lookupTable = doc.getIndex('id-lookup')
    const _id = lookupTable.lookupId(id, hints)
    if (_id) id = _id
    return "#"+ id
  }
}

export default LinkProvider
