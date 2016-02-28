class HomeModel extends Backbone.Model
    url: 'api'
    defaults:
        message: 'Default Message'

class HomeView extends Backbone.View
    template: require './HomeTemplate.jade'

    initialize: (params) ->
        @model = new HomeModel params
        @message = ko.observable().track @model, 'message'

    save: ->
        @model.save()

module.exports = HomeView
