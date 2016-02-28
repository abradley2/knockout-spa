(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./fn/index.coffee');

require('./components/index.coffee');

require('./bindings/index.coffee');

$(document).ready(function() {
  var router;
  router = require('./router.coffee');
  return Backbone.history.start({
    pushState: true
  });
});


},{"./bindings/index.coffee":2,"./components/index.coffee":5,"./fn/index.coffee":7,"./router.coffee":11}],2:[function(require,module,exports){
_.extend(ko.bindingHandlers, {
  initComponent: require('./initComponent.coffee'),
  pushState: require('./pushState.coffee')
});


},{"./initComponent.coffee":3,"./pushState.coffee":4}],3:[function(require,module,exports){
module.exports = {
  init: function(element, value, allBindings, viewModel, bindingContext) {
    if (viewModel.initComponent != null) {
      return viewModel.initComponent(element);
    }
  }
};


},{}],4:[function(require,module,exports){
var router;

router = require('../router.coffee');

module.exports = {
  init: function(element, value) {
    var params, shouldReplace, shouldTrigger;
    params = value() != null ? value : {};
    if (ko.unwrap(params.trigger) != null) {
      shouldTrigger = ko.unwrap(params.trigger);
    } else {
      shouldTrigger = true;
    }
    if (ko.unwrap(params.replace) != null) {
      shouldReplace = ko.unwrap(params.replace);
    } else {
      shouldReplace = false;
    }
    return $(element).on('click', function(event) {
      event.preventDefault();
      return router.navigate(element.getAttribute('href'), {
        trigger: shouldTrigger,
        replace: shouldReplace
      });
    });
  }
};


},{"../router.coffee":11}],5:[function(require,module,exports){


},{}],6:[function(require,module,exports){
_.extend(Backbone.View.prototype, {
  render: function() {
    this.el.innerHTML = this.template;
    ko.applyBindings(this, this.el);
    if (this.afterRender) {
      return this.afterRender();
    }
  },
  remove: function() {
    if (this.beforeRemove) {
      this.beforeRemove();
    }
    this.stopListening();
    ko.cleanNode(this.el);
    return this.el.innerHTML = '';
  }
});


},{}],7:[function(require,module,exports){
require('./backboneView.coffee');

require('./observableTrack.coffee');


},{"./backboneView.coffee":6,"./observableTrack.coffee":8}],8:[function(require,module,exports){
_.extend(ko.observable.fn, Backbone.Events);

ko.observable.fn.track = function(model, field) {
  var handleModelUpdate, sub;
  if (this()) {
    model.set(field, this());
  } else {
    this(model.get(field));
  }
  handleModelUpdate = function(model, value, options) {
    if (options.updateObservable) {
      return this(value);
    } else {
      return false;
    }
  };
  this.listenTo(model, "change:" + field, _.partial(handleModelUpdate, _, _, {
    updateObservable: true
  }));
  sub = this.subscribe((function(_this) {
    return function(val) {
      return model.set(field, val, {
        updateObservable: false
      });
    };
  })(this));
  this.on('untrack', sub.dispose);
  return this;
};

ko.observable.fn.untrack = function() {
  this.trigger('untrack');
  return this.stopListening();
};


},{}],9:[function(require,module,exports){
module.exports="<div id=\"navigation-region\"></div><div id=\"content-region\"></div>";
},{}],10:[function(require,module,exports){
module.exports = {
  MainLayout: require('./MainLayout.jade')
};


},{"./MainLayout.jade":9}],11:[function(require,module,exports){
var routes;

routes = require('./routes/index.coffee');

module.exports = new Backbone.Router({
  routes: routes
});


},{"./routes/index.coffee":13}],12:[function(require,module,exports){
var viewMediator;

viewMediator = require('../viewMediator.coffee');

module.exports = function(message) {
  return viewMediator.render({
    layout: 'MainLayout',
    views: {
      '#navigation-region': 'NavbarView',
      '#content-region': 'HomeView'
    },
    params: {
      'HomeView': {
        message: message
      }
    }
  });
};


},{"../viewMediator.coffee":14}],13:[function(require,module,exports){
var homeRoute;

homeRoute = require('./homeRoute.coffee');

module.exports = {
  '': homeRoute,
  'home': homeRoute,
  'home/:message': homeRoute
};


},{"./homeRoute.coffee":12}],14:[function(require,module,exports){
var layouts, views;

layouts = require('./layouts/index.coffee');

views = require('./views/index.coffee');

module.exports = new Backbone.ViewMediator({
  layouts: layouts,
  views: views,
  el: 'body'
});


},{"./layouts/index.coffee":10,"./views/index.coffee":17}],15:[function(require,module,exports){
module.exports="<div><h3>Welcome to Backbone/Knockout Boilerplate</h3><input type=\"text\" data-bind=\"value: message\"><button data-bind=\"click: save\">Save</button><h3 data-bind=\"text: message\"></h3></div>";
},{}],16:[function(require,module,exports){
var HomeModel, HomeView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

HomeModel = (function(superClass) {
  extend(HomeModel, superClass);

  function HomeModel() {
    return HomeModel.__super__.constructor.apply(this, arguments);
  }

  HomeModel.prototype.url = 'api';

  HomeModel.prototype.defaults = {
    message: 'Default Message'
  };

  return HomeModel;

})(Backbone.Model);

HomeView = (function(superClass) {
  extend(HomeView, superClass);

  function HomeView() {
    return HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.template = require('./HomeTemplate.jade');

  HomeView.prototype.initialize = function(params) {
    this.model = new HomeModel(params);
    return this.message = ko.observable().track(this.model, 'message');
  };

  HomeView.prototype.save = function() {
    return this.model.save();
  };

  return HomeView;

})(Backbone.View);

module.exports = HomeView;


},{"./HomeTemplate.jade":15}],17:[function(require,module,exports){
module.exports = {
  HomeView: require('./home/HomeView.coffee'),
  NavbarView: require('./navbar/NavbarView.coffee')
};


},{"./home/HomeView.coffee":16,"./navbar/NavbarView.coffee":19}],18:[function(require,module,exports){
module.exports="<div class=\"pure-menu pure-menu-horizontal\"><ul class=\"pure-menu-list\"><li class=\"pure-menu-item\"><a data-bind=\"pushState\" href=\"/home\" class=\"pure-menu-link\">Home</a></li></ul></div>";
},{}],19:[function(require,module,exports){
var NavbarView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NavbarView = (function(superClass) {
  extend(NavbarView, superClass);

  function NavbarView() {
    return NavbarView.__super__.constructor.apply(this, arguments);
  }

  NavbarView.prototype.template = require('./NavbarTemplate.jade');

  return NavbarView;

})(Backbone.View);

module.exports = NavbarView;


},{"./NavbarTemplate.jade":18}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAvYXBwLm1haW4uY29mZmVlIiwic3JjL3NjcmlwdHMvYXBwL2JpbmRpbmdzL2luZGV4LmNvZmZlZSIsInNyYy9zY3JpcHRzL2FwcC9iaW5kaW5ncy9pbml0Q29tcG9uZW50LmNvZmZlZSIsInNyYy9zY3JpcHRzL2FwcC9iaW5kaW5ncy9wdXNoU3RhdGUuY29mZmVlIiwic3JjL3NjcmlwdHMvYXBwL2ZuL2JhY2tib25lVmlldy5jb2ZmZWUiLCJzcmMvc2NyaXB0cy9hcHAvZm4vaW5kZXguY29mZmVlIiwic3JjL3NjcmlwdHMvYXBwL2ZuL29ic2VydmFibGVUcmFjay5jb2ZmZWUiLCJzcmMvc2NyaXB0cy9hcHAvbGF5b3V0cy9NYWluTGF5b3V0LmphZGUiLCJzcmMvc2NyaXB0cy9hcHAvbGF5b3V0cy9pbmRleC5jb2ZmZWUiLCJzcmMvc2NyaXB0cy9hcHAvcm91dGVyLmNvZmZlZSIsInNyYy9zY3JpcHRzL2FwcC9yb3V0ZXMvaG9tZVJvdXRlLmNvZmZlZSIsInNyYy9zY3JpcHRzL2FwcC9yb3V0ZXMvaW5kZXguY29mZmVlIiwic3JjL3NjcmlwdHMvYXBwL3ZpZXdNZWRpYXRvci5jb2ZmZWUiLCJzcmMvc2NyaXB0cy9hcHAvdmlld3MvaG9tZS9Ib21lVGVtcGxhdGUuamFkZSIsInNyYy9zY3JpcHRzL2FwcC92aWV3cy9ob21lL0hvbWVWaWV3LmNvZmZlZSIsInNyYy9zY3JpcHRzL2FwcC92aWV3cy9pbmRleC5jb2ZmZWUiLCJzcmMvc2NyaXB0cy9hcHAvdmlld3MvbmF2YmFyL05hdmJhclRlbXBsYXRlLmphZGUiLCJzcmMvc2NyaXB0cy9hcHAvdmlld3MvbmF2YmFyL05hdmJhclZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQ0EsT0FBQSxDQUFRLG1CQUFSOztBQUdBLE9BQUEsQ0FBUSwy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Q0FBc0IsSUFBQyxDQUFBLEtBQXZCLEVBQThCLFNBQTlCO0VBRkg7O3FCQUlaLElBQUEsR0FBTSxTQUFBO1dBQ0YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7RUFERTs7OztHQVBhLFFBQVEsQ0FBQzs7QUFVaEMsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNmakIsTUFBTSxDQUFDLE9BQVAsR0FDSTtFQUFBLFFBQUEsRUFBVSxPQUFBLENBQVEsd0JBQVIsQ0FBVjtFQUNBLFVBQUEsRUFBWSxPQUFBLENBQVEsNEJBQVIsQ0FEWjs7Ozs7QUNESjs7QUNBQSxJQUFBLFVBQUE7RUFBQTs7O0FBQU07Ozs7Ozs7dUJBQ0YsUUFBQSxHQUFVLE9BQUEsQ0FBUSx1QkFBUjs7OztHQURXLFFBQVEsQ0FBQzs7QUFHbEMsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBleHRlbnNpb25zIGZvciBLbm9ja291dCBhbmQgQmFja2JvbmVcbnJlcXVpcmUgJy4vZm4vaW5kZXguY29mZmVlJ1xuXG4jIEtub2Nrb3V0IGNvbXBvbmVudHNcbnJlcXVpcmUgJy4vY29tcG9uZW50cy9pbmRleC5jb2ZmZWUnXG5cbiMgS25vY2tvdXQgY3VzdG9tIGJpbmRpbmcgaGFuZGxlcnNcbnJlcXVpcmUgJy4vYmluZGluZ3MvaW5kZXguY29mZmVlJ1xuXG4kKGRvY3VtZW50KS5yZWFkeSAtPlxuICAgIHJvdXRlciA9IHJlcXVpcmUgJy4vcm91dGVyLmNvZmZlZSdcbiAgICBCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0IHsgcHVzaFN0YXRlOiB0cnVlIH1cbiIsIl8uZXh0ZW5kIGtvLmJpbmRpbmdIYW5kbGVycyxcbiAgICBpbml0Q29tcG9uZW50OiByZXF1aXJlICcuL2luaXRDb21wb25lbnQuY29mZmVlJ1xuICAgIHB1c2hTdGF0ZTogcmVxdWlyZSAnLi9wdXNoU3RhdGUuY29mZmVlJ1xuIiwibW9kdWxlLmV4cG9ydHMgPVxuICAgIGluaXQ6IChlbGVtZW50LCB2YWx1ZSwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIC0+XG4gICAgICAgIGlmIHZpZXdNb2RlbC5pbml0Q29tcG9uZW50PyB0aGVuIHZpZXdNb2RlbC5pbml0Q29tcG9uZW50IGVsZW1lbnRcbiIsInJvdXRlciA9IHJlcXVpcmUgJy4uL3JvdXRlci5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBpbml0OiAoZWxlbWVudCwgdmFsdWUpIC0+XG4gICAgICAgIHBhcmFtcyA9IGlmIHZhbHVlKCk/IHRoZW4gdmFsdWUgZWxzZSB7fVxuXG4gICAgICAgIGlmIGtvLnVud3JhcChwYXJhbXMudHJpZ2dlcik/XG4gICAgICAgICAgICBzaG91bGRUcmlnZ2VyID0ga28udW53cmFwKHBhcmFtcy50cmlnZ2VyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzaG91bGRUcmlnZ2VyID0gdHJ1ZVxuICAgICAgICBpZiBrby51bndyYXAocGFyYW1zLnJlcGxhY2UpP1xuICAgICAgICAgICAgc2hvdWxkUmVwbGFjZSA9IGtvLnVud3JhcChwYXJhbXMucmVwbGFjZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2hvdWxkUmVwbGFjZSA9IGZhbHNlXG5cbiAgICAgICAgJChlbGVtZW50KS5vbiAnY2xpY2snLCAoZXZlbnQpIC0+XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGUoXG4gICAgICAgICAgICAgICAgZWxlbWVudC5nZXRBdHRyaWJ1dGUgJ2hyZWYnXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogc2hvdWxkVHJpZ2dlciwgcmVwbGFjZTogc2hvdWxkUmVwbGFjZVxuICAgICAgICAgICAgKVxuIiwiXy5leHRlbmQgQmFja2JvbmUuVmlldy5wcm90b3R5cGUsIHtcblxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgQGVsLmlubmVySFRNTCA9IEB0ZW1wbGF0ZVxuICAgICAgICBrby5hcHBseUJpbmRpbmdzIHRoaXMsIEBlbFxuICAgICAgICBpZiBAYWZ0ZXJSZW5kZXIgdGhlbiBAYWZ0ZXJSZW5kZXIoKVxuXG4gICAgcmVtb3ZlOiAtPlxuICAgICAgICBpZiBAYmVmb3JlUmVtb3ZlIHRoZW4gQGJlZm9yZVJlbW92ZSgpXG4gICAgICAgIEBzdG9wTGlzdGVuaW5nKClcbiAgICAgICAga28uY2xlYW5Ob2RlIEBlbFxuICAgICAgICBAZWwuaW5uZXJIVE1MID0gJydcblxufVxuIiwicmVxdWlyZSAnLi9iYWNrYm9uZVZpZXcuY29mZmVlJ1xucmVxdWlyZSAnLi9vYnNlcnZhYmxlVHJhY2suY29mZmVlJ1xuIiwiXy5leHRlbmQga28ub2JzZXJ2YWJsZS5mbiwgQmFja2JvbmUuRXZlbnRzXG5cbmtvLm9ic2VydmFibGUuZm4udHJhY2sgPSAobW9kZWwsIGZpZWxkKSAtPlxuICAgIGlmIHRoaXMoKSB0aGVuIG1vZGVsLnNldCggZmllbGQsIHRoaXMoKSApIGVsc2UgdGhpcyggbW9kZWwuZ2V0IGZpZWxkIClcblxuICAgIGhhbmRsZU1vZGVsVXBkYXRlID0gKG1vZGVsLCB2YWx1ZSwgb3B0aW9ucykgLT5cbiAgICAgICAgaWYgb3B0aW9ucy51cGRhdGVPYnNlcnZhYmxlIHRoZW4gdGhpcyh2YWx1ZSkgZWxzZSBmYWxzZVxuXG4gICAgQGxpc3RlblRvIG1vZGVsLFxuICAgICAgICBcImNoYW5nZToje2ZpZWxkfVwiLFxuICAgICAgICBfLnBhcnRpYWwgaGFuZGxlTW9kZWxVcGRhdGUsIF8sIF8sIHVwZGF0ZU9ic2VydmFibGU6IHRydWVcblxuICAgIHN1YiA9IEBzdWJzY3JpYmUgKHZhbCkgPT4gbW9kZWwuc2V0IGZpZWxkLCB2YWwsIHVwZGF0ZU9ic2VydmFibGU6IGZhbHNlXG5cbiAgICBAb24gJ3VudHJhY2snLCBzdWIuZGlzcG9zZVxuXG4gICAgcmV0dXJuIHRoaXNcblxua28ub2JzZXJ2YWJsZS5mbi51bnRyYWNrID0gLT5cbiAgICBAdHJpZ2dlciAndW50cmFjaydcbiAgICBAc3RvcExpc3RlbmluZygpXG4iLCJtb2R1bGUuZXhwb3J0cz1cIjxkaXYgaWQ9XFxcIm5hdmlnYXRpb24tcmVnaW9uXFxcIj48L2Rpdj48ZGl2IGlkPVxcXCJjb250ZW50LXJlZ2lvblxcXCI+PC9kaXY+XCI7IiwibW9kdWxlLmV4cG9ydHMgPVxuICAgIE1haW5MYXlvdXQ6IHJlcXVpcmUgJy4vTWFpbkxheW91dC5qYWRlJ1xuIiwicm91dGVzID0gcmVxdWlyZSAnLi9yb3V0ZXMvaW5kZXguY29mZmVlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCYWNrYm9uZS5Sb3V0ZXIgeyByb3V0ZXM6IHJvdXRlcyB9XG4iLCJ2aWV3TWVkaWF0b3IgPSByZXF1aXJlICcuLi92aWV3TWVkaWF0b3IuY29mZmVlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChtZXNzYWdlKSAtPlxuICAgIHZpZXdNZWRpYXRvci5yZW5kZXIge1xuICAgICAgICBsYXlvdXQ6ICdNYWluTGF5b3V0J1xuICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICcjbmF2aWdhdGlvbi1yZWdpb24nOiAnTmF2YmFyVmlldydcbiAgICAgICAgICAgICcjY29udGVudC1yZWdpb24nOiAnSG9tZVZpZXcnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICdIb21lVmlldyc6XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgIH1cbiIsImhvbWVSb3V0ZSA9IHJlcXVpcmUgJy4vaG9tZVJvdXRlLmNvZmZlZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgICcnOiBob21lUm91dGVcbiAgICAnaG9tZSc6IGhvbWVSb3V0ZVxuICAgICdob21lLzptZXNzYWdlJzogaG9tZVJvdXRlXG4iLCJsYXlvdXRzID0gcmVxdWlyZSAnLi9sYXlvdXRzL2luZGV4LmNvZmZlZSdcbnZpZXdzID0gcmVxdWlyZSAnLi92aWV3cy9pbmRleC5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEJhY2tib25lLlZpZXdNZWRpYXRvciB7XG4gICAgbGF5b3V0czogbGF5b3V0c1xuICAgIHZpZXdzOiB2aWV3c1xuICAgIGVsOiAnYm9keSdcbn1cbiIsIm1vZHVsZS5leHBvcnRzPVwiPGRpdj48aDM+V2VsY29tZSB0byBCYWNrYm9uZS9Lbm9ja291dCBCb2lsZXJwbGF0ZTwvaDM+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6IG1lc3NhZ2VcXFwiPjxidXR0b24gZGF0YS1iaW5kPVxcXCJjbGljazogc2F2ZVxcXCI+U2F2ZTwvYnV0dG9uPjxoMyBkYXRhLWJpbmQ9XFxcInRleHQ6IG1lc3NhZ2VcXFwiPjwvaDM+PC9kaXY+XCI7IiwiY2xhc3MgSG9tZU1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWxcbiAgICB1cmw6ICdhcGknXG4gICAgZGVmYXVsdHM6XG4gICAgICAgIG1lc3NhZ2U6ICdEZWZhdWx0IE1lc3NhZ2UnXG5cbmNsYXNzIEhvbWVWaWV3IGV4dGVuZHMgQmFja2JvbmUuVmlld1xuICAgIHRlbXBsYXRlOiByZXF1aXJlICcuL0hvbWVUZW1wbGF0ZS5qYWRlJ1xuXG4gICAgaW5pdGlhbGl6ZTogKHBhcmFtcykgLT5cbiAgICAgICAgQG1vZGVsID0gbmV3IEhvbWVNb2RlbCBwYXJhbXNcbiAgICAgICAgQG1lc3NhZ2UgPSBrby5vYnNlcnZhYmxlKCkudHJhY2sgQG1vZGVsLCAnbWVzc2FnZSdcblxuICAgIHNhdmU6IC0+XG4gICAgICAgIEBtb2RlbC5zYXZlKClcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lVmlld1xuIiwibW9kdWxlLmV4cG9ydHMgPVxuICAgIEhvbWVWaWV3OiByZXF1aXJlICcuL2hvbWUvSG9tZVZpZXcuY29mZmVlJ1xuICAgIE5hdmJhclZpZXc6IHJlcXVpcmUgJy4vbmF2YmFyL05hdmJhclZpZXcuY29mZmVlJ1xuIiwibW9kdWxlLmV4cG9ydHM9XCI8ZGl2IGNsYXNzPVxcXCJwdXJlLW1lbnUgcHVyZS1tZW51LWhvcml6b250YWxcXFwiPjx1bCBjbGFzcz1cXFwicHVyZS1tZW51LWxpc3RcXFwiPjxsaSBjbGFzcz1cXFwicHVyZS1tZW51LWl0ZW1cXFwiPjxhIGRhdGEtYmluZD1cXFwicHVzaFN0YXRlXFxcIiBocmVmPVxcXCIvaG9tZVxcXCIgY2xhc3M9XFxcInB1cmUtbWVudS1saW5rXFxcIj5Ib21lPC9hPjwvbGk+PC91bD48L2Rpdj5cIjsiLCJjbGFzcyBOYXZiYXJWaWV3IGV4dGVuZHMgQmFja2JvbmUuVmlld1xuICAgIHRlbXBsYXRlOiByZXF1aXJlICcuL05hdmJhclRlbXBsYXRlLmphZGUnXG5cbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyVmlld1xuIl19
