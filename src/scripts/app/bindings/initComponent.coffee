module.exports =
    init: (element, value, allBindings, viewModel, bindingContext) ->
        if viewModel.initComponent? then viewModel.initComponent element
