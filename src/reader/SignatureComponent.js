import { Component } from 'substance'
import map from 'lodash/map'
import Documentation from '../model/Documentation'
import SourceLink from './SourceLinkComponent'

class SignatureComponent extends Component {

  render($$) {
    var el = $$('div').addClass('sc-signature')
    var node = this.props.node
    var params = node.params

    var info = Documentation.getNodeInfo(node)
    var visibility = node.isPrivate ? 'private ' : ''
    var args = map(params, 'name').join(', ')

    const decl = $$('a').addClass('se-declaration')
      .attr({href: '#'})
      .on('click', this.onClick)

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

    el.append(
      decl,
      $$('div').addClass('se-source').append(
        $$('strong').append(info.typeDescr),
        $$('span').append(' defined in '),
        $$(SourceLink, {node: node})
      )
    )

    // param description
    // if (node.params.length > 0 || node.returns) {
    //   el.append($$(Params, {params: node.params, returns: node.returns}))
    // }

    // // if given a message indicating that this method has been inherited
    // if (this.props.inheritedFrom) {
    //   el.append(
    //     $$('div').addClass('se-inherited-from')
    //     .append(
    //       $$('span').addClass('se-label').append(this.i18n.t('inherited-from')),
    //       $$('a').addClass('se-parent-class')
    //         .attr('href','#'+this.props.inheritedFrom)
    //         .append(this.props.inheritedFrom)
    //     )
    //   )
    // }
    return el
  }

  onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    this.send('focusNode', this.props.node.id)
  }

}

export default SignatureComponent
