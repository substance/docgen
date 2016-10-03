import { Component, TOC, SplitPane, ScrollPane } from 'substance'
import Cover from './CoverComponent'
import ContainerRenderer from './ContainerRenderer'
import DocumentationTOCProvider from './DocumentationTOCProvider'
import DocumentationRouter from './DocumentationRouter'

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
    this.tocProvider = new DocumentationTOCProvider(this.props.doc, this.config)
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
      labelProvider: this.labelProvider
    }
  }

  getDocument() {
    return this.props.doc
  }

  // this increases rerendering speed alot.
  // A deep rerender takes quite a time (about 400ms) because of the many components.
  // We can do this as long the content is not changed depending on the state
  // -- just updating scroll position ATM.
  shouldRerender() {
    return false
  }

  navigate(route, opts) {
    this.extendState(route)
    this.router.writeRoute(route, opts)
  }

  _onRouteChanged(route) {
    this.navigate(route, {replace: true})
  }

  dispose() {
    this.router.dispose()
  }

  // Action handlers
  // ---------------

  focusNode(nodeId) {
    this.navigate({
      nodeId: nodeId
    })
  }

  switchState(newState) {
    this.navigate(newState)
  }

  jumpToNode(nodeId) {
    this.tocProvider.emit("entry:selected", nodeId)
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
    return $$('div').addClass('sc-documentation-reader sc-controller').append(
      $$(SplitPane, {splitType: 'vertical', sizeA: '270px'}).append(
        this._renderContextSection($$),
        this._renderMainSection($$)
      ).ref('splitPane')
    )
  }

  _renderContextSection($$) {
    const el = $$('div')
      .addClass('se-context-section')
      .ref('contextSection')

    el.append($$(TOC))

    return el
  }

  _renderMainSection($$) {
    var config = this.config
    const doc = this.props.doc
    const cover = doc.get('cover')

    const main = $$('div').ref('main').addClass('se-main-section')
    const body = $$(ScrollPane, {
      tocProvider: this.tocProvider
    }).ref('contentPanel')

    if (cover) body.append($$(Cover, {node: cover}).ref('cover'))
    body.append(
      $$(ContainerRenderer, { containerId: config.containerId }).ref('containerRenderer')
    )
    main.append(body)

    return main
  }

  _updateScrollPosition() {
    if (this.refs.contentPanel && this.state.nodeId) {
      this.refs.contentPanel.scrollTo(this.state.nodeId)
    }
  }
}

// TODO: we should move this into a DocumentationConfigurator API
DocumentationReader.config = {
  containerId: 'body',
  skipAbstractClasses: false,
  skipPrivateMethods: true
}

export default DocumentationReader
