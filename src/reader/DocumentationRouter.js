import { Router } from 'substance'

class DocumentationRouter extends Router {

  constructor(controller) {
    super()

    this.controller = controller
  }

  parseRoute(route) {
    if (!route) {
      return this.controller.getInitialState()
    } else {
      // var nodeId = route
      return {
        nodeId: route
      }
    }
  }

  stringifyRoute() {
    return this.controller.state.nodeId
  }

}

export default DocumentationRouter
