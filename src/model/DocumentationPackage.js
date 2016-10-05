import Documentation from './Documentation'
import Page from './Page'
import APIPage from './APIPage'
import Section from './Section'
import FileNode from './FileNode'
import ModuleNode from './ModuleNode'
import FunctionNode from './FunctionNode'
import SubstanceClassNode from './SubstanceClassNode'
import ConstructorNode from './ConstructorNode'
import MethodNode from './MethodNode'
import PropertyNode from './PropertyNode'
import EventNode from './EventNode'

export default {
  name: 'documentation-model',
  configure: function(config) {
    config.defineSchema({
      name: 'documentation',
      ArticleClass: Documentation,
      defaultTextType: 'paragraph'
    })
    config.addNode(Page)
    config.addNode(APIPage)
    config.addNode(Section)
    config.addNode(FileNode)
    config.addNode(ModuleNode)
    config.addNode(FunctionNode)
    config.addNode(SubstanceClassNode)
    config.addNode(ConstructorNode)
    config.addNode(MethodNode)
    config.addNode(PropertyNode)
    config.addNode(EventNode)
  }
}
