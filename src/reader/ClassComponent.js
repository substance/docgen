import MemberContainerComponent from './MemberContainerComponent'
import Heading from './HeadingComponent'
import Example from './ExampleComponent'
import MemberIndexComponent from './MemberIndexComponent'

class ClassComponent extends MemberContainerComponent {

  render($$) {
    var node = this.props.node;
    var el = $$('div')
      .addClass('sc-class')
      .attr("data-id", this.props.node.id);
    // class header
    el.append($$(Heading, {node: node}));
    // the description
    el.append(
      $$('div').addClass('se-description').html(node.description)
    );
    // useage block
    el.append(this.renderUsage($$));

    if (node.members && node.members.length > 0) {
      // member index
      // el.append($$(MemberIndexComponent, {node: node}));
      // members
      el.append(this._renderMembers($$));
    }

    return el;
  };

  /**
    Can be overridden by custom components.

    @see SubstanceClassComponent, which gives special treatment to @component classes
  */
  renderUsage($$) {
    var node = this.props.node;
    var el = $$('div').addClass('se-usage');
    if (node.example) {
      el.append($$(Example, {node: node}));
    }
    return el;
  };

};

export default ClassComponent
