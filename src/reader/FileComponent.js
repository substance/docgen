import MemberContainerComponent from './MemberContainerComponent'

class FileComponent extends MemberContainerComponent {

  render($$) {
    const node = this.props.node
    const el = $$('div')
      .addClass('sc-file')
      .attr("data-id", node.id)
    // members
    if (node.members && node.members.length > 0) {
      // members
      el.append(this._renderMembers($$))
    }
    return el
  }

}

export default FileComponent
