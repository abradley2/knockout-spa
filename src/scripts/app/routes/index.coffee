homeRoute = require './homeRoute.coffee'

module.exports =
    '': homeRoute
    'home': homeRoute
    'home/:message': homeRoute
