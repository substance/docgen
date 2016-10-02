import MemberContainerComponent from './MemberContainerComponent'
import Heading from './HeadingComponent'
import Example from './ExampleComponent'
import MemberIndexComponent from './MemberIndexComponent'

class ModuleComponent extends MemberContainerComponent {

  render($$) {

    var node = this.props.node
    var el = $$('div')
      .addClass('sc-module')
      .attr("data-id", node.id)

    // heading
    el.append($$(Heading, {node: node}))
    // description
    el.append(
      $$('div').addClass('se-description').html(node.description)
    )
    // example
    if (node.example) {
      el.append($$(Example, {node:node}))
    }
    // members
    if (node.members && node.members.length > 0) {
      // member index
      el.append($$(MemberIndexComponent, {node: node}))
      // members
      el.append(this._renderMembers($$))
    }

    return el
  }

}

export default ModuleComponent
