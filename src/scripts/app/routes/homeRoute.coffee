viewMediator = require '../viewMediator.coffee'

module.exports = (message) ->
    viewMediator.render {
        layout: 'MainLayout'
        views:
            '#navigation-region': 'NavbarView'
            '#content-region': 'HomeView'
        params:
            'HomeView':
                message: message
    }
