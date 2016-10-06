import { Component } from 'substance'

class Navbar extends Component {
  render($$) {
    const pages = this.props.pages
    const linkProvider = this.context.linkProvider
    const el = $$('div').addClass('sc-navbar')

    const title = $$('div').addClass('se-title').append(
      $$('a').attr('href', './').append(this.props.title)
    )
    el.append(title)

    const pagesEl = $$('div').addClass('se-pages')
    pages.forEach((page) => {
      const pageEl = $$('a')
        .attr('href', linkProvider.getURL(page.id))
        .addClass('se-page')
        .text(page.getTitle())
      pagesEl.append(pageEl)
    })
    el.append(pagesEl)

    return el
  }
}

export default Navbar
