var _ = require("lodash");

// Component class
var Component = function (name) {
  // This state
  var self = this;
  //
  self._name = name;
  // Mixins
  self._mixins = [];
  self.mixin = function (value) {
    self._mixins.push(value);
  };
  self.mixins = function (values) {
    _.each(values, function (value) {
      self.mixin(value);
    });
  };
  // Components
  self._components = {};
  self.component = function (name, value) {
    if (self._components[name]) {
      throw new Error("[" + self._name + "] Overriding component " + name);
    }
    self._components[name] = value;
  };
  self.components = function (dict) {
    _.each(dict, function (value, name) {
      self.component(name, value);
    });
  };
  // Datas
  self._datas = {};
  self.data = function (name, value) {
    if (self._datas[name]) {
      throw new Error("[" + self._name + "] Overriding data " + name);
    }
    self._datas[name] = value;
  };
  self.datas = function (dict) {
    _.each(dict, function (value, name) {
      self.data(name, value);
    });
  };
  // Props
  self._props = {};
  self.prop = function (name, value) {
    if (self._props[name]) {
      throw new Error("[" + self._name + "] Overriding prop " + name);
    }
    self._props[name] = value;
  };
  self.props = function (dict) {
    _.each(dict, function (value, name) {
      self.prop(name, value);
    });
  };
  // Methods
  self._methods = {};
  self.method = function (name, value) {
    if (self._methods[name]) {
      throw new Error("[" + self._name + "] Overriding method " + name);
    }
    self._methods[name] = function (a, b, c, d, e, f, g) {
      var inst = this;
      try {
        return value.apply(inst, [a, b, c, d, e, f, g, ]);
      } catch (e) {
        console.error("==>", self._name + "." + name);
        console.error(e);
      }
    };
  };
  self.methods = function (dict) {
    _.each(dict, function (value, name) {
      self.method(name, value);
    });
  };
  // Computed values
  self._computeds = {};
  self.computed = function (name, value) {
    if (self._computeds[name]) {
      throw new Error("[" + self._name + "] Overriding computed " + name);
    }
    self._computeds[name] = value;
  };
  self.computeds = function (dict) {
    _.each(dict, function (value, name) {
      self.computed(name, value);
    });
  };
  // Watching for changes
  self._watchs = {};
  self.watch = function (name, call) {
    var fcall = call;
    if (_.isArray(call)) {
      fcall = function chainWatch(a, b, c, d, e) {
        var inst = this;
        var args = [a, b, c, d, e];
        if (call[1]) {
          args = args.slice(0, call[1]);
        }
        inst[call[0]].apply(inst, args);
      };
    }
    if (_.isString(call)) {
      fcall = function stringWatch(a, b, c, d, e) {
        var inst = this;
        inst[call].apply(inst, [a, b, c, d, e]);
      };
    }
    if (_.isArray(name)) {
      _.each(name, function (nm) {
        var list = self._watchs[nm] || [];
        list.push(fcall);
        self._watchs[nm] = list;
      });
    } else {
      var list = self._watchs[name] || [];
      list.push(fcall);
      self._watchs[name] = list;
    }
  };
  // When dom created
  self._created = [];
  self.created = function (call) {
    var fcall = call;
    if (_.isString(call)) {
      fcall = function stringCreated(a, b, c, d, e) {
        var inst = this;
        inst[call].apply(inst, [a, b, c, d, e]);
      };
    }
    self._created.push(fcall);
  };
  // When getting started
  self._mounted = [];
  self.mounted = function (call) {
    var fcall = call;
    if (_.isString(call)) {
      fcall = function stringMounted(a, b, c, d, e) {
        var inst = this;
        inst[call].apply(inst, [a, b, c, d, e, ]);
      };
    }
    self._mounted.push(fcall);
  };
  //
  self._destroyed = [];
  self.destroyed = function (call) {
    var fcall = call;
    if (_.isString(call)) {
      fcall = function stringDestroyed (a, b, c, d, e) {
        var inst = this;
        inst[call].apply(inst, [a, b, c, d, e, ]);
      };
    }
    self._destroyed.push(fcall);
  };
  //
  self.when = function (triggers, call) {
    _.each(triggers, function (trigger, idx) {
      if (trigger == "$created") {
        self.created(call);
      }
      else if (trigger == "$mounted") {
        self.mounted(call);
      }
      else if (trigger == "$destroyed") {
        self.destroyed(call);
      }
      else {
        self.watch(trigger, call);
      }
    });
  };
  //
  self.passEmit = function (name) {
    self.method(name, function emitMethod(a, b, c, d) {
      var inst = this;
      inst.$emit(name, a, b, c, d);
    });
  };

  self.periodic = function (interval, call) {
    var _h;
    self.mounted(function () {
      var inst = this;
      _h = _.every(interval, function () {
        call.apply(inst, []);
      });
    });
    self.destroyed(function () {
      if (_h) {
        _.stop(_h);
      }
    });
  };

  self.globally = function (events, call) {

    var fcall = call;
    if (_.isString(call)) {
      fcall = function (a, b, c, d, e) {
        var inst = this;
        inst[call].apply(inst, [a, b, c, d, e]);
      };
    }

    var fevents = events;
    if (!_.isArray(fevents)) {
      fevents = [fevents, ];
    }

    var ncall = "__" + fevents.join("__");
    self.method(ncall, fcall);

    self.mounted(function globallyEventMounted() {
      var inst = this;
      _.each(fevents, function mountedEvent(event) {
        window.addEventListener(event, inst[ncall]);
      });
    });
    self.destroyed(function globallyEventDestroyed() {
      var inst = this;
      _.each(fevents, function unmountedEvent(event) {
        window.removeEventListener(event, inst[ncall]);
      });
    });
  };

  /**
   * Usefull and simple functions available on all components
   */
  self.data("uid__", function () {
    return 42 /*_.uid() */;
  });
  self.method("nop__", function () {
    // Do nothing
  });
  self.method("prevent__", function (event) {
    event.preventDefault();
  });
  self.method("stop__", function (event) {
    event.stopPropagation();
  });

  //
  self.export = function () {
    return {
      name: self._name,
      data () {
        var finalDatas = {};
        _.each(self._datas, function (value, key) {
          var finalData;
          if (_.isFunction(value)) {
            finalData = value();
          } else {
            finalData = value;
          }
          finalDatas[key] = finalData;
        });
        return finalDatas;
      },
      mixins: self._mixins,
      components: self._components,
      methods: self._methods,
      props: self._props,
      watch: function () {
        var finalWatches = {};
        _.each(self._watchs, function (calls, name) {
          finalWatches[name] = function (a, b, c, d) {
            var inst = this;
            _.each(calls, function (call) {
              call.apply(inst, [a, b, c, d, ]);
            });
          };
        });
        return finalWatches;
      }(),
      created: function (a, b, c, d) {
        var inst = this;
        _.each(self._created, function (call) {
          call.apply(inst, [a, b, c, d, ]);
        });
      },
      mounted: function (a, b, c, d) {
        var inst = this;
        _.each(self._mounted, function (call) {
          call.apply(inst, [a, b, c, d, ]);
        });
      },
      destroyed: function (a, b, c, d) {
        var inst = this;
        _.each(self._destroyed, function (call) {
          call.apply(inst, [a, b, c, d, ]);
        });
      },
      computed: self._computeds,
    };
  };
};
// Make it a module
export default Component;
