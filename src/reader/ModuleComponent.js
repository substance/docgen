import { Component } from 'substance'
import Heading from './HeadingComponent'
import Example from './ExampleComponent'

class ModuleComponent extends Component {

  render($$) {

    const node = this.props.node
    const doc = node.getDocument()
    const el = $$('div')
      .addClass('sc-module')
      .attr("data-id", node.id)

    // heading
    el.append($$(Heading, {node: node}))
    // description
    el.append(
      $$('div').addClass('se-description').html(doc.prepareHTML(node.description))
    )
    // example
    if (node.example) {
      el.append($$(Example, {node:node}))
    }
    // members
    if (node.members && node.members.length > 0) {
      // members
      el.append(this._renderMembers($$))
    }

    return el
  }

  _renderMembers($$) {
    const node = this.props.node
    const members = node.getMembers()
    return members.map((node) => {
      const ComponentClass = this.getComponent(node.type)
      return $$(ComponentClass, { node:node })
    })
  }
}

export default ModuleComponent
