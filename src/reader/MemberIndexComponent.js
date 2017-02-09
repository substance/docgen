import forEach from 'substance/util/forEach'
import MemberContainerComponent from './MemberContainerComponent'
import CrossLink from './CrossLinkComponent'

class MemberIndexComponent extends MemberContainerComponent {

  render($$) {
    var el = $$('div').addClass('sc-member-index')
    el.append(this._renderMembers($$))
    return el
  }

  _renderMembers($$) {
    var children = super._renderMembers($$)
    var node = this.props.node
    if (node.type === 'class' && node.superClass) {
      children = children.concat(this._renderInheritedMembers($$))
    }
    return children
  }

  _renderInheritedMembers($$) {
    var elements = []
    var config = this.context.config
    var node = this.props.node
    var categories = node.getMemberCategories()
    var inheritedMembers = node.getInheritedMembers(config)
    forEach(inheritedMembers, function(members, group) {
      members = members.sort(m => m.id)
      var cat = categories[group]
      var catEl = this.__renderMemberCategory__($$, cat, members)
      catEl.insertAt(0,
        $$('span').addClass('se-label').append(this.getLabel('inherited-' + cat.name))
      )
      elements.push(catEl)
    }.bind(this))
    return elements
  }

  __renderMemberCategory__($$, cat, members) {
    return super._renderMemberCategory($$, cat, members)
  }

  _renderMemberCategory($$, cat, members) {
    var catEl = super._renderMemberCategory($$, cat, members)
    catEl.insertAt(0,
      $$('span').addClass('se-label').append(this.getLabel(cat.name))
    )
    return catEl
  }

  _renderMember($$, memberNode) {
    return $$(CrossLink, {node: memberNode}).append(memberNode.name, ' ')
  }

  getMemberCategories() {
    return this.props.node.getMemberCategories()
  }

}

export default MemberIndexComponent
