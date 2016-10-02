import { Component } from 'substance'
import Signature from './SignatureComponent'
import Example from './ExampleComponent'
import Params from './ParamsComponent'

class MethodComponent extends Component {

  render($$) {
    const node = this.props.node
    const parent = node.getParent()
    const el = $$('div')
      .addClass('sc-method')
      .attr("data-id", node.id)

    // signature
    el.append($$(Signature, {node: node}))

    // the description
    el.append(
      $$('div').addClass('se-description').html(node.description)
    )

    // param description
    if (node.params.length > 0 || node.returns) {
      el.append($$(Params, {params: node.params, returns: node.returns}))
    }

    if (node.example) {
      el.append($$(Example, {node:node}))
    }

    return el
  }

}

export default MethodComponent