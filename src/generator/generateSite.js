import { Configurator, DefaultDOMElement } from 'substance'
import DocumentationReader from '../reader/DocumentationReader'
import DocumentationReaderPackage from '../reader/DocumentationReaderPackage'
import forEach from 'substance/util/forEach'

function buildSite(doc) {
  const configurator = new Configurator().import(DocumentationReaderPackage)
  const linkProvider = new StaticLinkProvider(doc)
  doc.linkProvider = linkProvider
  const root = DefaultDOMElement.createDocument('html').createElement('div')
  const output = {}
  // render the reader in default state
  let dest = 'index.html'
  linkProvider.setLocation(dest)
  const reader = DocumentationReader.mount({
    doc: doc,
    configurator: configurator,
    idProvider: new StaticIdProvider()
  }, root)
  output[dest] = _createHTML(root.innerHTML, dest)
  const nodes = doc.getNodes()
  forEach(nodes, function(node) {
    switch(node.type) {
      case "page":
      case "section":
      case "api-page":
      case "module":
      case "class":
        dest = node.id+'.html'
        linkProvider.setLocation(dest)
        reader.setState({
          nodeId: node.id
        })
        output[dest] = _createHTML(root.innerHTML, dest)
        break
      default:
        //
    }
  })
  return output
}

function _createHTML(bodyHTML, dest) {
  const pathToRoot = _getPathToRoot(dest)
  const html = `<html>
  <head>
    <link href='http://fonts.googleapis.com/css?family=Lato:400,700,400italic' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Josefin+Sans:400,600' rel='stylesheet' type='text/css'>
    <link href="${pathToRoot}github.css" rel="stylesheet" type="text/css">
    <link href='${pathToRoot}substance/substance.css' rel='stylesheet' type='text/css'/>
    <link href='${pathToRoot}reader.css' rel='stylesheet' type='text/css'/>
  </head>
  <body>
    ${bodyHTML}
  </body>
</html>`
  return html
}

function _getPathToRoot(dest) {
  let pathToRoot = []
  const depth = dest.split('/').length-1
  for (var i = 0; i < depth; i++) {
    pathToRoot.push('../')
  }
  return pathToRoot.join('')
}

const NOWHERE = 'javascript:void(0)' // eslint-disable-line

class StaticIdProvider {
  getId(node) {
    let id = node.id
    switch(node.type) {
      case 'method':
      case 'property':
      case 'function':
      case 'ctor':
        id = [node.isStatic?'static_':'', node.name].join('')
        break
      default:
        id = id.replace('/', '_')
    }
    return id
  }
}

class StaticLinkProvider {
  constructor(doc) {
    this.doc = doc
    this.location = ''
  }
  setLocation(loc) {
    this.location = loc
  }
  getURL(id, hints) {
    const doc = this.doc
    const lookupTable = doc.getIndex('id-lookup')
    const pathToRoot = _getPathToRoot(this.location)
    let _id = lookupTable.lookupId(id, hints)
    // suppress links which are going nowhere
    if (!_id) {
      console.error('StaticLinkProvider: could not lookup id', id)
      return NOWHERE
    }
    const node = doc.get(_id)
    if (!node) {
      console.error('StaticLinkProvider: node does not exist', _id)
      return NOWHERE
    }
    switch(node.type) {
      case 'page':
      case 'section':
      case 'api-page':
      case 'module':
      case 'class':
        return pathToRoot+node.id+'.html'
      default:
        //
    }
    const parent = node.parent ? node.getParent() : null
    if (!parent) {
      console.error('StaticLinkProvider: not does not have a parent', node.id)
      return NOWHERE
    }
    switch (parent.type) {
      case 'class':
        // src/MyClass.html#foo
        // src/MyClass.html#static_bar
        return [pathToRoot, parent.id,'.html','#',node.isStatic?'static_':'',node.name].join('')
      case 'module':
        return [pathToRoot, parent.id,'.html','#',node.name].join('')
      default:
        //
    }
    console.error('StaticLinkProvider: could not resolve', id)
    return NOWHERE
  }
}

export default buildSite
