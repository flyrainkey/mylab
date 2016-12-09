//##############################################################################
// src/elements/Pipet.js
//##############################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;
  var NumberLabel = ENJ.NumberLabel;
  var LiquidLayer = ENJ.LiquidLayer;

  function Pipet(props) {
    Skin.call(this, props);
  }


  ENJ.defineClass({
    constructor: Pipet, extend: Skin,
    /**
     * @override
     */
    ready: function(props) {
      var self = this, graphics, shape, label, liquid, pipe;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-200, 0, 400, 240);

      shape = new Shape(graphics);
      shape.x = 8;

      label = new NumberLabel({unit: ' ml', digits: 1});
      label.visible = false;
      label.x = 10;

      liquid = new LiquidLayer({resId: '移液管液体', mask: shape, color: props.color});

      pipe = new Bitmap(RES.getRes("移液管"));

      self.addChild(liquid, pipe, label);

      self.set({
        label: label,
        shape: shape,
        liquid: liquid/*,
        ratio: this.store('ratio') || 1*/
      });

    },

    /**
     * @override
     */
    onChange: function(key, value) {
      var label = this.label, shape = this.shape;
      switch (key) {
        case 'volume':
          //this.shape.y = 240 - value * 240 / 8 + 16;
          shape.set({
            y: 240 - value * 240 / 8 + 60,
            scaleY: value / 8
          });

          label.save({'number': value});
          //label.store('num', value * this.ratio);
          label.y = shape.y - 10;
          break;
        case 'display':
          if (value) {
            label.visible = true;
            Tween.get(label)
              .to({alpha: 1.0}, 500);
          } else {
            Tween.get(label)
              .to({alpha: 0.0}, 500)
              .call(function() {
                label.visible = false;
              });
          }
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

  ENJ.Pipet = Pipet;
})();
