import { Component } from 'substance'

class PageTOC extends Component {

  render($$) {
    const node = this.props.node
    const linkProvider = this.context.linkProvider
    const el = $$('div').addClass('sc-page-toc')
    const titleEl = $$('a').addClass('se-title')
      .attr('href', linkProvider.getURL(node.id))
      .text(node.getTitle())
      .on('click', this._onClickItem.bind(this, node))

    const sectionsEl = $$('div').addClass('se-sections')
    node.getSections().forEach((sec) => {
      sectionsEl.append(
        this._renderSection($$, sec)
      )
    })
    el.append(titleEl)
    el.append(sectionsEl)
    return el
  }

  _renderSection($$, sec) {
    const linkProvider = this.context.linkProvider
    const secEl = $$('a').addClass('se-section')
      .attr('href', linkProvider.getURL(sec.id))
      .text(this.getLabel(sec.getTitle()))
      .on('click', this._onClickItem.bind(this, sec))
    return secEl
  }

  _onClickItem(node, evt) {
    evt.stopPropagation()
  }

}

export default PageTOC
