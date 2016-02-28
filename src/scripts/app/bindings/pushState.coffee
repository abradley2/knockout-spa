router = require '../router.coffee'

module.exports =
    init: (element, value) ->
        params = if value()? then value else {}

        if ko.unwrap(params.trigger)?
            shouldTrigger = ko.unwrap(params.trigger)
        else
            shouldTrigger = true
        if ko.unwrap(params.replace)?
            shouldReplace = ko.unwrap(params.replace)
        else
            shouldReplace = false

        $(element).on 'click', (event) ->
            event.preventDefault()
            router.navigate(
                element.getAttribute 'href'
                trigger: shouldTrigger, replace: shouldReplace
            )
