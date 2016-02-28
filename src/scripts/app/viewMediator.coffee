layouts = require './layouts/index.coffee'
views = require './views/index.coffee'

module.exports = new Backbone.ViewMediator {
    layouts: layouts
    views: views
    el: 'body'
}
