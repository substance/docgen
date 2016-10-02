import { Component } from 'substance'

class ContainerRenderer extends Component {

  constructor(...args) {
    super(...args)
    this.doc = this.context.doc
    this.componentRegistry = this.context.componentRegistry
  }

  render($$) {
    var containerNode = this.doc.get(this.props.containerId)
    var el = $$("div")
      .addClass('sc-container-renderer ')
      .attr({
        spellCheck: false,
        "data-id": containerNode.id,
        "contenteditable": false
      })
    // node components
    containerNode.nodes.forEach(function(nodeId) {
      el.append(this._renderNode($$, nodeId))
    }.bind(this))

    return el
  }

  _renderNode($$, nodeId) {
    var node = this.doc.get(nodeId)
    var ComponentClass = this.componentRegistry.get(node.type)
    if (!ComponentClass) {
      console.error('Could not resolve a component for type: ' + node.type)
      return $$('div')
    } else {
      return $$(ComponentClass, {
        doc: this.doc,
        node: node
      })
    }
  }

}

export default ContainerRenderer