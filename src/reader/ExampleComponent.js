import { Component } from 'substance'

class ExampleComponent extends Component {

  render($$) {
    const node = this.props.node
    const doc = node.getDocument()
    const el = $$('div').addClass('sc-example').append(
      $$('div').addClass('se-heading').append(this.getLabel('example'))
    )
    const body = $$('div').addClass('se-body')
    body.append($$('div').addClass('se-description').html(doc.prepareHTML(node.example)))
    el.append(body)

    return el
  }

}

export default ExampleComponent
