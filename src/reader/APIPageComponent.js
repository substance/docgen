import ApiTOC from './ApiTOC'
import MemberContainerComponent from './MemberContainerComponent'
import Signature from './SignatureComponent'

class APIPageComponent extends ApiTOC {

  render($$) {
    const el = $$('div').addClass(this._getClasses())
    const node = this.props.node
    const doc = node.getDocument()
    const groups = doc.getAPIGroups(this.context.config)

    el.append(
      $$('div').addClass('se-description').html(doc.prepareHTML(node.description))
    )

    const indexEl = $$('div').addClass('se-index')

    ApiTOC.order.forEach((cat) => {
      indexEl.append(
        this._renderCategory($$, cat, groups[cat.type])
      )
    })

    el.append(indexEl)
    return el
  }

  _getClasses() {
    return 'sc-api-page'
  }

  // this renders one of the major categories as displayed in the ApiTOC
  _renderItem($$, item) {
    const linkProvider = this.context.linkProvider
    const itemEl = $$('div').addClass('se-item')
    itemEl.append(
      $$('a')
        .attr('href', linkProvider.getURL(item.id))
        .addClass('se-label')
        .text(item.name)
    )
    itemEl.append($$(Members, {node: item}))
    return itemEl
  }

}

class Members extends MemberContainerComponent {
  render($$) {
    const node = this.props.node
    const el = $$('div')
      .addClass('se-members se-'+node.type)
    if (node.members && node.members.length > 0) {
      el.append(this._renderMembers($$))
    }
    return el
  }

  _renderMember($$, member) {
    const linkProvider = this.context.linkProvider
    let name = member.name
    const el = $$('div').addClass('se-member').addClass('se-'+member.type)
    switch(member.type) {
      case 'function':
      case 'method':
      case 'ctor':
        el.append($$(Signature, {node: member, short: true}))
        break
      default:
        el.append($$('a')
          .attr('href', linkProvider.getURL(member.id))
          .text(name)
        )
    }
    return el
  }
}

export default APIPageComponent
