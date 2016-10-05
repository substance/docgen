import { commonmark, highlightjs } from '../vendor'

const reader = new commonmark.Parser()
const writer = new commonmark.HtmlRenderer()

const converter = {
  toHtml: function(text) {
    var parsed = reader.parse(text)
    highlightCodeblocks(parsed)
    makeLinksExternal(parsed)
    return writer.render(parsed)
  }
}

function highlightCodeblocks(parsed) {
  const walker = parsed.walker()
  let event, node
  while ((event = walker.next())) {
    node = event.node
    if (node.type === 'CodeBlock') {
      const info = node.info ? node.info.split(/\s+/) : []
      const lang = info[0]
      let highlighted
      const classes = ['hljs']

      if (lang) {
        highlighted = highlightjs.highlight(lang, node.literal).value
        classes.push('lang-'+lang)
      } else {
        highlighted = highlightjs.highlightAuto(node.literal).value
      }

      const htmlBlock = new commonmark.Node('HtmlBlock', node.sourcepos)
      htmlBlock.literal = ['<pre>', '<code class="'+classes.join(' ')+'">', highlighted, '</code>', '</pre>'].join('')
      node.insertBefore(htmlBlock)
      node.unlink()
    }
  }
}

function makeLinksExternal(parsed) {
  const walker = parsed.walker()
  let event, node
  while ((event = walker.next())) {
    node = event.node
    if (event.entering && node.type === 'Link') {
      const href = node.destination
      let text = href
      if (node.firstChild) {
        text = node.firstChild.literal
      }
      const el = new commonmark.Node('Html')
      el.literal = ['<a href="', href, '" target="_blank">', text, '</a>'].join('')
      node.insertBefore(el)
      node.unlink()
    }
  }
}

export default converter
