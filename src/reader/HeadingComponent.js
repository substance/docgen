import { Component } from 'substance'
import SourceLink from './SourceLinkComponent'
import CrossLink from './CrossLinkComponent'

class HeadingComponent extends Component {

  render($$) {
    var node = this.props.node
    var doc = node.getDocument()

    var name = node.name
    var type = node.type
    var specificType = node.getSpecificType()
    var el = $$('div').addClass('sc-doc-heading')
    var headerEl = $$('a').attr({href: '#'}).addClass('se-header')
        .on('click', this.onClick)

    // name
    headerEl.append(
      $$('span').addClass('se-name').append(this.props.name || name)
    )
    // details: a line saying something like Class defined in '...', extends '...'
    var details = $$('div').addClass('se-details').addClass(type)
    var detailsLabel = $$('strong').addClass('se-type')
    detailsLabel.append(this.getLabel(specificType))
    details.append(detailsLabel)

    details.append(
      $$('span').addClass('se-source').append(
        $$('span').append(' ' + this.getLabel('defined-in') + ' '),
        $$(SourceLink, {node: node})
      )
    )
    if (node.type === "class" && node.superClass) {
      var superClassNode = doc.get(node.superClass)
      details.append(
        $$('span').addClass('se-extends').append(
          $$('span').append(' ' + this.getLabel('extends') + ' '),
          $$(CrossLink, {node: superClassNode})
        )
      )
    }
    el.append(headerEl, details)

    return el
  }

  onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    this.send('focusNode', this.props.node.id)
  }

}

export default HeadingComponent
