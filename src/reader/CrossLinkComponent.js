import { Component } from 'substance'

class CrossLinkComponent extends Component {

  render($$) {
    const node = this.props.node
    const linkProvider = this.context.linkProvider
    var el
    if (node) {
      el = $$('a').addClass('sc-cross-link')
        .attr({
          href: linkProvider.getURL(node.id),
          "data-type": 'cross-link',
          "data-node-id": node.id
        })
    } else {
      el = $$('span')
    }
    if (this.props.children.length > 0) {
      el.append(this.props.children)
    }
    return el
  }
}

export default CrossLinkComponent
