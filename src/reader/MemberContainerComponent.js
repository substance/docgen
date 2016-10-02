import { Component, UnsupportedNodeComponent } from 'substance'
import forEach from 'lodash/each'

class MemberContainerComponent extends Component {

  _renderMembers($$) {
    var node = this.props.node
    var el = $$('div')
    forEach(node.getMemberCategories(), function(cat) {
      var catMembers = this._getCategoryMembers(cat)
      if (catMembers.length > 0) {
        el.append(this._renderMemberCategory($$, cat, catMembers))
      }
    }.bind(this))
    return el.children
  }

  _renderMemberCategory($$, cat, catMembers) {
    var catEl = $$('div').addClass('se-member-category')
    var membersEl = $$('div').addClass('se-members')
    // Note: using lodash each, so that we are independent
    // of catMembers being an array or an object.
    forEach(catMembers, function(memberNode) {
      membersEl.append(this._renderMember($$, memberNode))
    }.bind(this))
    catEl.append(membersEl)
    return catEl
  }

  _renderMember($$, memberNode) {
    var node = this.props.node
    var doc = node.getDocument()
    var componentRegistry = this.context.componentRegistry
    var ComponentClass = componentRegistry.get(memberNode.type)
    if (!ComponentClass) {
      console.error('Could not resolve a component for type: ' + node.type)
      ComponentClass = UnsupportedNodeComponent
    }
    return $$(ComponentClass, {
      doc: doc,
      node: memberNode,
      parentNode: node
    })
  }

  _getCategoryMembers(cat) {
    var config = this.context.config
    var node = this.props.node
    return node.getCategoryMembers(cat, config)
  }

}

export default MemberContainerComponent
