import filter from 'lodash/filter'
import forEach from 'lodash/forEach'

let MemberContainerMixin = {

  getMembers: function(config) {
    config = config || {}
    var members = []
    forEach(this.getMemberCategories(), function(cat) {
      var catMembers = this.getCategoryMembers(cat, config)
      members = members.concat(catMembers)
    }.bind(this))
    return members
  },

  getCategoryMembers: function(cat, config) {
    var doc = this.getDocument()
    var memberIndex = doc.getIndex('members')
    var members = memberIndex.get([this.id].concat(cat.path))
    members = filter(members, function(memberNode) {
      // skip nodes according to configuration
      if ((memberNode.isPrivate && config.skipPrivateMethods) ||
        (memberNode.type === "class" && memberNode.isAbstract && config.skipAbstractClasses)) {
        return false
      }
      return true
    })
    return members
  },
}

export default MemberContainerMixin
