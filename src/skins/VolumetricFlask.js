///##############################################################################
// src/elements/VolumetricFlask.js
//##############################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;
  var LiquidLayer = ENJ.LiquidLayer;

  var base = Skin.prototype;

  function VolumetricFlask(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    /**
     *
     * @class VolumetricFlask
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: VolumetricFlask, extend: Skin,
    /**
     * @override
     */
    ready: function(props) {
      var self = this, graphics, bounds, shape, liquid, bottle, cap;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-200, 0, 400, 400);

      shape = new Shape(graphics);
      shape.x = 63;
      //shape.y = 50;


      liquid = new LiquidLayer({resId: '容量瓶液体', mask: shape, color: props.color});

      bottle = new Bitmap(RES.getRes("容量瓶"));

      cap = new Bitmap(RES.getRes("容量瓶盖"));

      if (props.dark) {
        bottle.filters = [new CreateJS.ColorFilter(0.5,0.25,0,1)];
        bounds = bottle.getBounds();
        bottle.cache(0, 0, bounds.width, bounds.height);

        cap.filters = [new CreateJS.ColorFilter(0.5,0.25,0,1)];
        bounds = cap.getBounds();
        cap.cache(0, 0, bounds.width, bounds.height);
      }

      cap.set({ x: 22, y: -20 });

      self.addChild(liquid, bottle, cap);

      self.set({
        cap: cap,
        //label: label,
        //level: level,
        shape: shape
      });

    },

    /**
     * @override
     */
    onChange: function(key, value) {
      var shape = this.shape;//, level = this.level;
      switch (key) {
        case 'volume':
          if (value < 80) {
            shape.y = 256 - value * value / 6400 * 100;
          } else {
            shape.y = 156 - (value - 80) * 60 / 20;
          }

          break;
      }
    },

    /**
     * @override
     */
    start: function() {
      base.start.call(this);
      Tween.get(this.cap).to({
        x: 0, y: -60, rotation: -30, alpha: 0
      }, 250);
    },

    /**
     * @override
     */
    stop: function() {
      base.stop.call(this);
      Tween.get(this.cap).to({
        x: 22, y: -20, rotation: 0, alpha: 1.0
      }, 250);
    },

    /**
     * @override
     */
    refresh: function() {

      this.shape.rotation = -this.rotation;

    }
  });

  ENJ.VolumetricFlask = VolumetricFlask;

})();
