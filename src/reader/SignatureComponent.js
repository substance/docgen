import { Component } from 'substance'
import Documentation from '../model/Documentation'
import SourceLink from './SourceLinkComponent'

const LBRACKET = '['.charCodeAt(0)

class SignatureComponent extends Component {

  render($$) {
    const node = this.props.node
    const linkProvider = this.context.linkProvider
    const el = $$('div').addClass('sc-signature')

    var params = node.params
    var info = Documentation.getNodeInfo(node)
    var visibility = node.isPrivate ? 'private ' : ''
    var args = params.map(function(param) {
      let name = param.name
      // HACK: skip options parameters here
      if (name.indexOf('.')>0) return null
      // HACK: removing brackets
      if (name.charCodeAt(0) === LBRACKET) {
        name = name.slice(1, name.length-1)
      }
      return name
    }).filter(Boolean).join(', ')

    const decl = $$('a').addClass('se-declaration')
      .attr('href', linkProvider.getURL(node.id))

    if (node.isPrivate) {
      decl.append($$('span').addClass('se-visibility').append(visibility))
    }
    decl.append($$('span').addClass('se-storage').append(info.storage))

    if (node.isStatic) {
      const parentName = node.getParent().name
      decl.append($$('span').addClass('se-parent').text(parentName))
        .append('.')
    }

    decl.append($$('span').addClass('se-name').text(node.name))
      .append('(')
      .append($$('span').addClass('se-arguments').append(args))
      .append(')')

    el.append(decl)

    if (!this.props.short) {
      el.append(
        $$('div').addClass('se-source').append(
          $$('strong').append(info.typeDescr),
          $$('span').append(' defined in '),
          $$(SourceLink, {node: node})
        )
      )
    }

    return el
  }

}

export default SignatureComponent
