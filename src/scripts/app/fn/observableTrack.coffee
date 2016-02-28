_.extend ko.observable.fn, Backbone.Events

ko.observable.fn.track = (model, field) ->
    if this() then model.set( field, this() ) else this( model.get field )

    handleModelUpdate = (model, value, options) ->
        if options.updateObservable then this(value) else false

    @listenTo model,
        "change:#{field}",
        _.partial handleModelUpdate, _, _, updateObservable: true

    sub = @subscribe (val) => model.set field, val, updateObservable: false

    @on 'untrack', sub.dispose

    return this

ko.observable.fn.untrack = ->
    @trigger 'untrack'
    @stopListening()
