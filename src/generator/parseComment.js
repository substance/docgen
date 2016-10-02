import { dox } from '../vendor'
import markdown from './markdownConverter'

const _typeTagMatcher = /^\s*(\{[^@][^{]+\})\s+([\w\/]+)\s+(.+)/

function parseComment(comment) {
  let data = dox.parseComment(comment)
  const tags = data.tags
  const refinedTags = []
  data.params = []
  data.tags = refinedTags
  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i]
    switch (tag.type) {
      case 'param':
        data.params.push(_extractParam(tag))
        break
      case 'return':
      case 'returns':
        // TODO: in dox a type can have multiple entries
        var returnVal = {
          type: tag.types.join('|'),
          description: tag.description
        }
        refinedTags.push({ type: 'returns', value: returnVal })
        data.returns = returnVal
        break
      case 'event':
        data.isEvent = true
        break
      case 'abstract':
        data.isAbstract = true
        break
      case 'private':
        data.isPrivate = true
        break
      case 'see':
        data.see = tag.string
        break
      case 'example':
        data.example = _extractExample(tag.string)
        break
      case 'type':
        data.dataType = tag.string
        break
      default:
        var typeDescription = _typeTagMatcher.exec(tag.string)
        if (typeDescription) {
          tag.name = typeDescription[2]
          tag.description = typeDescription[3]
          dox.parseTagTypes(typeDescription[1], tag)
          var customParam = _extractParam(tag)
          refinedTags.push({ type: tag.type, value: customParam })
        } else {
          refinedTags.push({ type: tag.type, value: tag.string })
        }
    }
  }
  return data
}

var dox_parseTagTypes = dox.parseTagTypes
dox.parseTagTypes = parseTagTypes
dox.setMarkdownConverter(markdown)

function parseTagTypes(str, tag) {
  if (/\{[^{]+\}/.exec(str)) {
    str = str.replace(/\//g, '_SEP_')
    str = str.replace(/\[\]/g, '_ARR_')
    try {
      var types = dox_parseTagTypes(str, tag)
      for (var i = 0; i < types.length; i++) {
        types[i] = types[i].replace(/_SEP_/g, '/')
        types[i] = types[i].replace(/_ARR_/g, '[]')
      }
    } catch (err) {
      throw new Error('Could not parse jsdoc expression: ' + str + "\n" + err.message)
    }
  } else {
    return dox_parseTagTypes(str, tag)
  }
}

function _extractParam(tag) {
  const shortTypes = tag.types.map(function(type) {
    const idx = type.lastIndexOf('/')
    if (idx > 0) {
      return type.slice(idx+1)
    } else {
      return type
    }
  })
  var param = {
    type: tag.types.join('|'),
    shortType: shortTypes.join('|'),
    name: tag.name,
    description: markdown.toHtml(tag.description)
  }
  if (tag.optional) {
    // param.name = param.name.replace(/[\[\]]/g, '')
    param.optional = true
  }
  return param
}

function _extractExample(str) {
  var firstLineBreak = str.indexOf("\n")
  // var header
  var body
  if (firstLineBreak >= 0) {
    // header = str.slice(0, firstLineBreak).trim()
    body = str.slice(firstLineBreak)
    body = dox.trimIndentation(body)
  } else {
    // header = undefined
    body = str.trim()
  }
  return markdown.toHtml(body)
}

export default parseComment
