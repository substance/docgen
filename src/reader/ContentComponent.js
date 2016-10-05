import { Component } from 'substance'

class ContentComponent extends Component {

  render($$) {
    var node = this.props.node
    var el = $$('div')
      .addClass('sc-content')
      .attr("data-id", node.id)
    el.append(
      $$('div').addClass('se-title').append(node.title),
      $$('div').addClass('se-description').html(node.description)
    )
    return el
  }

}

export default ContentComponent