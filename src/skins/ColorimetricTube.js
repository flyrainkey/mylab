//##############################################################################
// src/skins/ColorimetricTube.js
//##############################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Text = CreateJS.Text;
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;
  var NumberLabel = ENJ.NumberLabel;
  var LiquidLayer = ENJ.LiquidLayer;
  var LiquidContainer = ENJ.LiquidContainer;

  var base = Skin.prototype;

  /**
   * 比色管
   * @param props
   * @constructor
   */
  function ColorimetricTube(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: ColorimetricTube, extend: Skin,

    register: function() {
      this.opacity = 1;
      this.volume = 0;
    },

    ready: function(props) {
      var graphics, shape, label, liquid, body, cap;

      graphics = new Graphics();
      graphics.beginFill('#0f0')
        .drawRect(-200, 0, 400, 200)
        /*.drawEllipse(-38, -7.5, 76, 15)*/;

      shape = new Shape(graphics);
      shape.x = 7;
      shape.y = 200;

      //label = new NumberLabel({ unit: 'ml' });
      //label.x = 10;

      //liquid = LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);
      liquid = new LiquidLayer({resId: '比色管液', mask: shape, color: props.color});// LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);

      body = new Bitmap(RES.getRes("比色管身"));
      cap = new Bitmap(RES.getRes("比色管塞"));
      cap.y = -2;

      this.addChild(liquid, cap, body);

      if ('no' in props) {
        var text = new Text(props.no, 'normal 18px Arial', '#000000');
        text.set({x: 2, y: 50});
        this.addChild(text);
      }

      this.set({
        liquid: liquid,
        shape: shape,
        cap: cap
      });

      this.color = props.color;
    },

    //fix: function() {
    //
    //},

    refresh: function() {
      this.shape.rotation = -this.rotation;
      //this.shape.x = 40 + (this.fixed ? Math.sin(this.rotation/180*3.14)*25 : 0);
      //this.shape.x = 40;
      //if (this.shape.y > 40) {
      //  this.shape.x += Math.sin(this.rotation/180*3.14)*27;
      //}
    },

    start: function() {
      base.start.call(this);

      if (this.cap) {
        Tween.get(this.cap)
          .to({
            x: -50, y: -50, alpha: 0.0, rotation: -60
          }, 500);
      }

    },

    stop: function() {
      base.stop.call(this);

      if (this.cap) {
        Tween.get(this.cap)
          .to({
            x: 0, y: -2, alpha: 1.0, rotation: 0
          }, 500);
      }
    },

    onChange: function(key, value) {
      var label = this.label, shape = this.shape;

      switch (key) {
        case 'volume':

          shape.y = 120 - value * 100 /10 - 2;
          this.liquid.visible = value > 0;

          break;
        case 'opacity':
          this.liquid.alpha = value;
          break;
        case 'color':
          //this.liquid = LiquidContainer.createLiquidLayer("烧杯液体", value, shape);
          //this.removeChildAt(1);
          //this.addChildAt(this.liquid, 1);
          this.liquid.save({color: value});
          break;
      }
    }
  });

  ENJ.ColorimetricTube = ColorimetricTube;

})();
