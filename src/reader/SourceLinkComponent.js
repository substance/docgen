import { Component } from 'substance'

class SourceLinkComponent extends Component {

  render($$) {
    var node = this.props.node
    var el = $$('a').addClass('sc-source-link')
      .attr({href: '#', target:'_blank', "data-source-file": node.sourceFile, "data-source-line": node.sourceLine})
      .append(node.sourceFile+"#"+node.sourceLine)
    // TODO: make this configurable
    el.attr('href', this.getGithubUrl())
    return el
  }

  getGithubUrl() {
    const node = this.props.node
    const doc = node.getDocument()
    var githubUrl = doc.repository + "/blob/" + doc.sha + "/" + node.sourceFile + "#L" + node.sourceLine
    return githubUrl
  }
}

export default SourceLinkComponent
