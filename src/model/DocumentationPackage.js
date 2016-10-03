import Documentation from './Documentation'
import CoverNode from './CoverNode'
import ChapterNode from './ChapterNode'
import FileNode from './FileNode'
import MetaNode from './MetaNode'
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
    config.addNode(CoverNode)
    config.addNode(ChapterNode)
    config.addNode(FileNode)
    config.addNode(MetaNode)
    config.addNode(ModuleNode)
    config.addNode(FunctionNode)
    config.addNode(SubstanceClassNode)
    config.addNode(ConstructorNode)
    config.addNode(MethodNode)
    config.addNode(PropertyNode)
    config.addNode(EventNode)
  }
}
