import { Component } from 'substance'

class ContentComponent extends Component {

  render($$) {
    const node = this.props.node
    const doc = node.getDocument()
    const el = $$('div')
      .addClass('sc-content')
      .attr("data-id", node.id)
    el.append(
      $$('div').addClass('se-title').append(node.title),
      $$('div').addClass('se-description').html(doc.prepareHTML(node.description))
    )
    return el
  }

}

export default ContentComponent
