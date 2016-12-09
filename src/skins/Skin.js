//######################################################################################################################
// src/skins/Skin.js
//######################################################################################################################
(function() {
  var Container = CRE.Container;

  function Skin(props) {
    Container.call(this);

    this.register();

    props = props || {};

    this.ready(props);

    this.save(props);
  }

  ENJ.defineClass({
    constructor: Skin,
    extend: Container,

    //statics: {
    //  startDragging: function(skin, anchor) {
    //    skin.onMove = (function(event) {
    //      skin.x = event.stageX ;
    //      skin.y = event.stageY;
    //    });
    //    skin.addEventListener('mousemove', skin.onMove);
    //  },
    //  sopDragging: function(skin) {
    //    skin.removeEventListener('mousemove', skin.onMove);
    //    skin.onMove = null;
    //  }
    //},

    save: function(props) {
      var key, old, val;
      for (key in props) {
        if (props.hasOwnProperty(key)) {
          old = this[key];
          val = props[key];

          if (old === val) {
            continue;
          }

          this[key] = val;
          this.onChange(key, val, old);
        }
      }
    },

    start: function() {
      this.active = true;
    },

    stop: function() {
      this.active = false;
    },

    register: function() {
      this.index = -1;
      this.active = false;
      this.location = null;
    },

    ready: function() {},

    refresh: function() {},

    release: function() {
      this.removeAllEventListeners();
    },

    onChange: function(key, val, old) {}
  });

  ENJ.Skin = Skin;
})();
