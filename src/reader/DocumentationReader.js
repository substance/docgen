import { Component, SplitPane, ScrollPane, inBrowser } from 'substance'
import DocumentationRouter from './DocumentationRouter'
import Navbar from './Navbar'
import ApiTOC from './ApiTOC'
import PageTOC from './PageTOC'

class DocumentationReader extends Component {

  constructor(...args) {
    super(...args)
    this._initialize(this.props)
    this.handleActions({
      'switchState': this.switchState,
      'extendState': this.extendState,
      'tocEntrySelected': this.focusNode,
      'focusNode': this.focusNode
    })
  }

  _initialize(props) {
    var configurator = props.configurator

    this.config = DocumentationReader.config
    this.router = new DocumentationRouter(this)
    this.router.on('route:changed', this._onRouteChanged, this)
    this.componentRegistry = configurator.getComponentRegistry()
    this.iconProvider = configurator.getIconProvider()
    this.labelProvider = configurator.getLabelProvider()
  }

  getChildContext() {
    return {
      doc: this.getDocument(),
      config: this.config,
      tocProvider: this.tocProvider,
      componentRegistry: this.componentRegistry,
      iconProvider: this.iconProvider,
      labelProvider: this.labelProvider,
      linkProvider: this.getDocument().linkProvider
    }
  }

  // this increases rerendering speed alot.
  // A deep rerender takes quite a time (about 400ms) because of the many components.
  // We can do this as long the content is not changed depending on the state
  // -- just updating scroll position ATM.
  // shouldRerender() {
  //   return false
  // }

  dispose() {
    this.router.dispose()
  }

  didMount() {
    var route = this.router.readRoute()
    // Replaces the current entry without creating new history entry
    // or triggering hashchange
    this.navigate(route, {replace: true})
    this._updateScrollPosition()
  }

  didUpdate() {
    this._updateScrollPosition()
  }

  render($$) {
    const el =$$('div').addClass('sc-documentation-reader sc-controller')
    el.append(
      $$(SplitPane, {splitType: 'horizontal'}).append(
        this._renderNavBar($$),
        $$(SplitPane, {splitType: 'vertical'}).append(
          this._renderTOC($$),
          this._renderMainSection($$)
        )
      )
    )
    return el
  }

  _renderNavBar($$) {
    return $$(Navbar, { title: this._getTitle(), pages: this._getPages() })
  }

  _renderTOC($$) {
    const el = $$('div')
      .addClass('se-context-section')
      .ref('contextSection')

    const content = this._getContent()
    let TOCComponent
    let page
    if (content) {
      switch (content.type) {
        case 'page':
          TOCComponent = PageTOC
          page = content
          break
        case 'section':
          TOCComponent = PageTOC
          page = content.getPage()
          break
        case 'api-page':
          TOCComponent = ApiTOC
          page = content
          break
        case 'module':
        case 'class':
        case 'method':
        case 'property':
        case 'function':
          TOCComponent = ApiTOC
          page = content.getAPIPage()
          break
        default:
          //
      }
    }
    if (TOCComponent) {
      el.append($$(TOCComponent, { doc: this.props.doc, node: page }))
    }
    return el
  }

  _renderMainSection($$) {
    const main = $$('div').ref('main').addClass('se-main-section')
    const body = $$(ScrollPane, {
      tocProvider: this.tocProvider
    }).ref('contentPanel')

    let ContentRenderer
    let content = this._getContent()
    if (content) {
      switch (content.type) {
        case 'method':
        case 'property':
        case 'function':
          content = content.getParent()
          break
        default:
          //
      }
      ContentRenderer = this.getComponent(content.type)
      body.append(
        $$(ContentRenderer, { node: content }).ref('content')
      )
    }
    main.append(body)
    return main
  }

  getComponentRegistry() {
    return this.componentRegistry
  }

  getDocument() {
    return this.props.doc
  }

  _getContent() {
    const doc = this.getDocument()
    if (this.state.nodeId) {
      return doc.get(this.state.nodeId)
    } else {
      return doc.getDefaultPage()
    }
  }

  _getPages() {
    return this.getDocument().getPages()
  }

  _getTitle() {
    return this.getDocument().title
  }

  navigate(route, opts) {
    this.extendState(route)
    this.router.writeRoute(route, opts)
  }

  _onRouteChanged(route) {
    this.navigate(route, {replace: true})
  }

  focusNode(nodeId) {
    this.navigate({
      nodeId: nodeId
    })
  }

  switchState(newState) {
    this.navigate(newState)
  }

  _updateScrollPosition() {
    if (inBrowser && this.refs.contentPanel && this.state.nodeId) {
      this.refs.contentPanel.scrollTo(this.state.nodeId, true)
    }
  }
}

// TODO: we should move this into a DocumentationConfigurator API
DocumentationReader.config = {
  skipAbstract: false,
  skipPrivate: true,
  skipInternal: true,
}

export default DocumentationReader
