import { BasePackage } from 'substance'
import DocumentationPackage from '../model/DocumentationPackage'
import ContentComponent from './ContentComponent'
import APIPageComponent from './APIPageComponent'
import FileComponent from './FileComponent'
import FunctionComponent from './FunctionComponent'
import ClassComponent from './SubstanceClassComponent'
import ConstructorComponent from './ConstructorComponent'
import MethodComponent from './MethodComponent'
import ModuleComponent from './ModuleComponent'
import PropertyComponent from './PropertyComponent'
import EventComponent from './EventComponent'

export default {
  name: 'documentation',
  configure: function(config) {
    config.import(BasePackage)
    config.import(DocumentationPackage)

    config.addComponent('page', ContentComponent)
    config.addComponent('api-page', APIPageComponent)
    config.addComponent('section', ContentComponent)
    config.addComponent('file-node', FileComponent)
    config.addComponent('function', FunctionComponent)
    config.addComponent('class', ClassComponent)
    config.addComponent('ctor', ConstructorComponent)
    config.addComponent('method', MethodComponent)
    config.addComponent('module', ModuleComponent)
    config.addComponent('property', PropertyComponent)
    config.addComponent('event', EventComponent)
    config.addLabel('inherited-from', 'Inherited from')
    config.addLabel('example', 'Example')
    config.addLabel('parameters', 'Parameters')
    config.addLabel('abstract-class', 'Abstract Class')
    config.addLabel('component', 'Component')
    config.addLabel('components', 'Components')
    config.addLabel('abstract-component', 'Abstract Component')
    config.addLabel('ctor', 'Constructor')
    config.addLabel('function', 'Function')
    config.addLabel('functions', 'Functions')
    config.addLabel('method', 'Method')
    config.addLabel('module', 'Module')
    config.addLabel('event', 'Event')
    config.addLabel('defined-in', 'defined in')
    config.addLabel('returns', 'Returns')
    config.addLabel('extends', 'inherits from')
    config.addLabel('inner-classes', 'Inner Classes')
    config.addLabel('class-properties', 'Class properties')
    config.addLabel('class-methods', 'Class methods')
    config.addLabel('class', 'Class')
    config.addLabel('classes', 'Classes')
    config.addLabel('method', 'Method')
    config.addLabel('methods', 'Methods')
    config.addLabel('module', 'Module')
    config.addLabel('modules', 'Modules')
    config.addLabel('property', 'Property')
    config.addLabel('properties', 'Properties')
    config.addLabel('instance-methods', 'Methods')
    config.addLabel('instance-properties', 'Properties')
    config.addLabel('instance-events', 'Events')
    config.addLabel('inherited-instance-methods', 'Inherited Methods')
    config.addLabel('inherited-instance-properties', 'Inherited Properties')
    config.addLabel('inherited-class-properties', 'Inherited Class properties')
    config.addLabel('inherited-class-methods', 'Inherited Class methods')
    config.addLabel('props', 'Props')
    config.addLabel('state', 'State')
  }
}
