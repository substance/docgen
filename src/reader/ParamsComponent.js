import { Component } from 'substance'
import CrossLink from './CrossLinkComponent'

class ParamsComponent extends Component {

  render($$) {
    var doc = this.context.doc
    var el = $$('div').addClass('sc-params')
    var params = this.props.params
    var returns = this.props.returns

    if (params.length > 0) {
      el.append($$('div').addClass('se-label').append(this.getLabel(this.props.label || 'parameters')))

      var paramsTable = $$('table').addClass('se-params-table')
      params.forEach(function(param) {
        var typeNode
        if (param.type) {
          typeNode = doc.get(param.type)
        }
        paramsTable.append(
          $$('tr').addClass('se-param').append(
            $$('td').addClass('se-param-name').append(param.name),
            $$('td').addClass('se-param-type').append(
              $$(CrossLink, {node: typeNode}).append(param.shortType)
            ),
            $$('td').addClass('se-param-description').html(param.description)
          )
        )
      })
      el.append(paramsTable)
    }
    if (returns) {
      var returnTypeNode
      if (returns.type) {
        returnTypeNode = doc.get(returns.type)
      }
      el.append($$('div').addClass('se-returns se-label').append(this.getLabel('returns')))
      el.append(
        $$('table').addClass('se-params-table').append(
          $$('tr').addClass('se-param').append(
            $$('td').addClass('se-param-type').append(
              $$(CrossLink, {node: returnTypeNode}).append(returns.type)
            ),
            $$('td').addClass('se-param-description').html(returns.description)
          )
        )
      )
    }
    return el
  }
}

export default ParamsComponent
