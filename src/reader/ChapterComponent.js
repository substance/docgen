import { Component } from 'substance'

class ChapterComponent extends Component {

  render($$) {
    var node = this.props.node
    var el = $$('div')
      .addClass('sc-chapter')
      .attr("data-id", node.id)

    el.append(
      $$('div').addClass('se-title').addClass('sm-level-'+node.level).append(node.title),
      $$('div').addClass('se-description').html(node.description)
    )

    return el
  }

}

export default ChapterComponent
