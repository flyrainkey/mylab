//######################################################################################################################
// src/utils.js
//######################################################################################################################
(function() {

  function assign(target/*,..sources*/) {
    if (!(target instanceof Object)) {
      throw new TypeError('target must be object');
    }

    var source, prop, i, n = arguments.length;

    for (i = 1; i < n; i++) {
      source = arguments[i];
      for (prop in source) {
        if (source.hasOwnProperty(prop )) {
          Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
        }
      }
    }

    return target;
  }

  //function defineClass(props) {
  //  var subClass, superClass;
  //
  //  if (props.hasOwnProperty('extend')) {
  //    superClass = props.extend;
  //    if (typeof superClass !== 'function') {
  //      throw new TypeError("superClass must be a function");
  //    }
  //  } else {
  //    superClass = Object;
  //  }
  //
  //  if (props.hasOwnProperty('constructor')) {
  //    subClass = props.constructor;
  //    if (typeof subClass !== 'function') {
  //      throw new TypeError("subClass must be a function");
  //    }
  //  } else {
  //    subClass = function() {
  //      superClass.apply(this, arguments);
  //    }
  //  }
  //
  //  if (props.hasOwnProperty('statics')) {
  //    assign(subClass, superClass, props.statics);
  //  }
  //
  //  subClass.prototype = Object.create(superClass.prototype);
  //
  //  assign(subClass.prototype, props);
  //  Object.defineProperty(subClass.prototype, 'constructor', {
  //    value: subClass, enumerable: false, writable: true, configurable: true
  //  });
  //
  //  return subClass;
  //}

  function defineClass(props) {
    var subClass, superClass, mixins, statics, sources;//, ObjectUtil = Exact.ObjectUtil;

    // superClass
    if (props.hasOwnProperty('extend')) {
      superClass = props.extend;

      if (typeof superClass !== 'function') {
        throw new TypeError('superClass must be a function');
      }
    } else {
      superClass = Object;
    }

    // subClass
    if (props.hasOwnProperty('constructor')) {
      subClass = props.constructor;
      //delete props.constructor;
      if (typeof subClass !== 'function') {
        throw new TypeError('subClass must be a function');
      }
    } else {
      subClass = function() {
        superClass.apply(this, arguments);
      };
    }

    // props
    subClass.prototype = Object.create(superClass.prototype);//ObjectUtil.create(superClass.prototype);

    sources = [subClass.prototype];

    mixins = props.mixins;
    if (Array.isArray(mixins)) {
      //delete props.mixins;
      sources.push.apply(sources, mixins);
    }

    sources.push(props);

    defineProps(subClass.prototype, sources);

    Object.defineProperty(subClass.prototype, 'constructor', {
      value: subClass, enumerable: false, writable: true, configurable: true
    });

    // static
    sources = [subClass, superClass];

    statics = props.statics;

    if (statics) {
      mixins = statics.mixins;
      if (Array.isArray(mixins)) {
        //delete statics.mixins;
        sources.push.apply(sources, mixins);
      }

      sources.push(statics);
    }

    defineProps(subClass, sources);

    delete subClass.prototype.statics;
    delete subClass.prototype.entend;
    delete subClass.prototype.mixins;
    delete subClass.mixins;

    return subClass;
  }

  function defineProps(target, sources) {
    var i, n, source;
    for (i = 0, n = sources.length; i < n; ++i) {
      source = sources[i];
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        }
      }
    }
  }

  ENJ.assign = assign;
  ENJ.defineClass = defineClass;

})();