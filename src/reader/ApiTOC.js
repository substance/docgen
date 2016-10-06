import { Component } from 'substance'

const order = [
  { type: 'class', label: 'classes' },
  { type: 'component', label: 'components' },
  { type: 'module', label: 'modules' },
]

class ApiTOC extends Component {

  render($$) {
    const el = $$('div').addClass(this._getClasses())
    const node = this.props.node
    const doc = node.getDocument()
    const groups = doc.getAPIGroups(this.context.config)
    order.forEach((cat) => {
      el.append(
        this._renderCategory($$, cat, groups[cat.type])
      )
    })
    return el
  }

  _getClasses() {
    return 'sc-api-toc'
  }

  _renderCategory($$, category, items) {
    const catEl = $$('div').addClass('se-category')
    // label
    const label = $$('div').addClass('se-label').text(this.getLabel(category.label))
    catEl.append(label)
    if (items.length === 0) return null
    const itemsContainer = $$('div').addClass('se-items')
    items.forEach((item) => {
      itemsContainer.append(this._renderItem($$, item))
    })
    catEl.append(itemsContainer)

    return catEl
  }

  _renderItem($$, item) {
    const linkProvider = this.context.linkProvider
    return $$('a')
      .attr('href', linkProvider.getURL(item.id))
      .addClass('se-item')
      .text(item.name)
  }

}

ApiTOC.order = order

export default ApiTOC
