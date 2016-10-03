import { Component } from 'substance'
import map from 'lodash/map'
import Heading from './HeadingComponent'
import Params from './ParamsComponent'
import Example from './ExampleComponent'

class FunctionComponent extends Component {

  render($$) {
    const node = this.props.node
    const el = $$('div')
      .addClass('sc-function')
      .attr("data-id", node.id)

    // heading
    const args = map(node.params, 'name').join(', ')
    const headingName = [node.name, '(', args, ')']
    el.append($$(Heading, {node: node, name: headingName}))

    // description
    el.append($$('div').addClass('se-description').html(node.description))

    // params
    if (node.params.length > 0 || node.returns) {
      el.append($$(Params, {params: node.params, returns: node.returns}))
    }

    // example
    if (node.example) {
      el.append($$(Example, {node: node}))
    }
    return el
  }

}

export default FunctionComponent
