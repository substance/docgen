import fs from 'fs'
import DocumentationGenerator from './DocumentationGenerator'

// TODO: discuss in which way we want to control
// the generator. E.g., one option could be to provide a sequence
// of md and js files, so that the md files can be used as chapters
function generate(files) {
  const generator = new DocumentationGenerator()
  files.forEach(function(file) {
    var src = fs.readFileSync(file, 'utf8')
    generator.addJS(file, src)
  })
  return generator.doc
}

export default generate
