# extensions for Knockout and Backbone
require './fn/index.coffee'

# Knockout components
require './components/index.coffee'

# Knockout custom binding handlers
require './bindings/index.coffee'

$(document).ready ->
    router = require './router.coffee'
    Backbone.history.start { pushState: true }
