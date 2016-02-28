_.extend Backbone.View.prototype, {

    render: ->
        @el.innerHTML = @template
        ko.applyBindings this, @el
        if @afterRender then @afterRender()

    remove: ->
        if @beforeRemove then @beforeRemove()
        @stopListening()
        ko.cleanNode @el
        @el.innerHTML = ''

}
