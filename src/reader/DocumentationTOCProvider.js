import { TOCProvider } from 'substance'
import forEach from 'lodash/forEach'

class DocumentationTOCProvider extends TOCProvider {

  computeEntries() {
    var doc = this.getDocument()
    var config = this.config

    var entries = []
    var contentNodes = doc.get('body').nodes

    contentNodes.forEach(function(nsId) {
      var ns = doc.get(nsId)
      entries.push({
        id: nsId,
        name: ns.name,
        level: 1,
        node: ns
      })

      forEach(ns.getMemberCategories(), function(cat) {
        var catMembers = ns.getCategoryMembers(cat, config)
        catMembers.forEach(function(catMember) {
          entries.push({
            id: catMember.id,
            name: catMember.name,
            level: 2,
            node: catMember
          })
        })
      })
    })
    return entries
  }
}

DocumentationTOCProvider.tocTypes = ['module', 'class', 'function']

export default DocumentationTOCProvider
