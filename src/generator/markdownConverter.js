import { commonmark, highlightjs } from '../vendor'
import CrossLinkComponent from '../reader/CrossLinkComponent'

const reader = new commonmark.Parser()
const writer = new commonmark.HtmlRenderer()

const converter = {
  toHtml: function(text) {
    var parsed = reader.parse(text)
    highlightCodeblocks(parsed)
    makeLinksExternal(parsed)
    convertCodeLinks(parsed)
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

function convertCodeLinks(parsed) {
  const walker = parsed.walker()
  let event, node
  let sourceposPre, sourceposLink, sourceposPost
  while ((event = walker.next())) {
    node = event.node
    if (node.type === 'Text') {
      const re = /(\{\s*@link([^\}]*)\})/
      let match = re.exec(node.literal)
      while (match) {
        sourceposPre = undefined
        sourceposLink = undefined
        sourceposPost = undefined
        if (node.sourcepos) {
          const startLine = node.sourcepos[0][0]
          const startCol = node.sourcepos[0][1]
          const matchStart = startCol+match.index
          const matchEnd = matchStart+match[0].length
          sourceposPre = [node.sourcepos[0], [startLine, matchStart]]
          sourceposLink = [[startLine, matchStart], [startLine, matchEnd]]
          sourceposPost = [[startLine, matchEnd], node.sourcepos[1]]
        }
        const id = match[2].trim()
        const pre = new commonmark.Node('Text', sourceposPre)
        pre.literal = node.literal.slice(0, match.index)
        const link = new commonmark.Node('Html', sourceposLink)
        // Note: using server-side rendering here
        const crossLink = CrossLinkComponent.render({ node: { id: id }, children: [id]})
        link.literal = crossLink.outerHTML
        const post = new commonmark.Node('Text', sourceposPost)
        post.literal = node.literal.slice(match.index+match[0].length)
        node.insertBefore(pre)
        node.insertBefore(link)
        node.insertBefore(post)
        node.unlink()

        // iterating to find all matches
        node = post
        match = re.exec(post.literal)
      }
    }
  }
}

export default converter
