import { DocumentNode } from 'substance'
import MemberContainerMixin from './MemberContainerMixin'

var MEMBER_CATEGORIES = {
  'classes': {name: 'classes', path: ['class']},
  'functions': {name: 'functions', path: ['function']},
  'properties': {name: 'properties', path: ['property']},
}

class FileNode extends DocumentNode {
  getMemberCategories() {
    return MEMBER_CATEGORIES
  }
}

Object.assign(FileNode.prototype, MemberContainerMixin)

FileNode.type = 'file';

FileNode.define({
  members: { type: ['array', 'id'], default: [] },
});

FileNode.isBlock = true

export default FileNode