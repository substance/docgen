import { Component } from 'substance'

const order = [
  { type: 'class', label: 'classes' },
  { type: 'component', label: 'components' },
  { type: 'module', label: 'modules' },
]

class ApiTOC extends Component {

  render($$) {
    const el = $$('div').addClass('sc-api-toc')
    const doc = this.props.doc
    const groups = doc.getAPIGroups(this.context.config)
    order.forEach((cat) => {
      el.append(
        this._renderCategory($$, cat, groups[cat.type])
      )
    })
    return el
  }

  _renderCategory($$, category, items) {
    const linkProvider = this.context.linkProvider
    const catEl = $$('div').addClass('se-category')
    // label
    const label = $$('div').addClass('se-label').text(this.getLabel(category.label))
    catEl.append(label)
    if (items.length === 0) return null
    const itemsContainer = $$('div').addClass('se-items')
    items.forEach((item) => {
      const itemEl = $$('a').attr('href', linkProvider.getURL(item.id)).addClass('se-item').text(item.name)
        .on('click', this._onClickItem.bind(this, item))
      itemsContainer.append(itemEl)
    })
    catEl.append(itemsContainer)

    return catEl
  }

  _onClickItem(node, evt) {
    // evt.preventDefault()
    evt.stopPropagation()
    // console.log('Open page', node.id)
  }

}

export default ApiTOC
