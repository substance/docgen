import { Component } from 'substance'

class ExampleComponent extends Component {

  render($$) {
    var node = this.props.node
    var el = $$('div').addClass('sc-example').append(
      $$('div').addClass('se-heading').append(this.getLabel('example'))
    )
    var body = $$('div').addClass('se-body')
    body.append($$('div').addClass('se-description').html(node.example))
    el.append(body)

    return el
  }

}

export default ExampleComponent
