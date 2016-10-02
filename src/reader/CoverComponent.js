import { Component } from 'substance'

class CoverComponent extends Component {

  render($$) {
    var node = this.props.node
    var el = $$('div')
      .addClass('sc-cover')
      .attr("data-id", node.id)

    el.append(
      $$('div').addClass('se-title').append('Substance'),
      $$('div').addClass('se-description').html(node.description)
    )

    return el
  }
}

export default CoverComponent
