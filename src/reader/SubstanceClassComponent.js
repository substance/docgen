import ClassComponent from './ClassComponent'
import Params from './ParamsComponent'
import Example from './ExampleComponent'

class SubstanceClassComponent extends ClassComponent {

  renderUsage($$) {
    var node = this.props.node
    var el = $$('div').addClass('se-usage')
    if (node.getSpecificType() === 'component') {
      var props = this.collectTagsByType('prop')
      var stateProps = this.collectTagsByType('state')
      if (props.length > 0) {
        el.append($$(Params, {label: 'props', params: props}))
      }
      if (stateProps.length > 0) {
        el.append($$(Params, {label: 'state', params: stateProps}))
      }
    }
    if (node.example) {
      el.append($$(Example, {node: node}))
    }
    return el
  }

  collectTagsByType(tagType) {
    var tagValues = []
    this.props.node.tags.forEach(function(tag) {
      if (tag.type === tagType) {
        tagValues.push(tag.value)
      }
    })
    return tagValues
  }

}

export default SubstanceClassComponent
