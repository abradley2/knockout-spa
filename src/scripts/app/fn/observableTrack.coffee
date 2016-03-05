_.extend ko.observable.fn, Backbone.Events

ko.observable.fn.track = (model, field) ->
    trackId = _.uniquedId()

    if this() then model.set( field, this() ) else this( model.get field )

    handleModelUpdate = (model, value, options) ->
        if options.trackId == trackId then this(value) else false

    @listenTo model,
        "change:#{field}",
        _.partial handleModelUpdate, _, _, trackId: trackId

    sub = @subscribe (val) => model.set field, val, trackId: false

    @on 'untrack', sub.dispose

    return this

ko.observable.fn.untrack = ->
    @trigger 'untrack'
    @stopListening()
