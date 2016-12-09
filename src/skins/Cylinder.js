//##############################################################################
// src/elements/Cylinder.js
//##############################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;
  var NumberLabel = ENJ.NumberLabel;
  //var LiquidContainer = ENJ.LiquidContainer;
  var LiquidLayer = ENJ.LiquidLayer;

  /**
   * 量筒
   * @param props
   * @constructor
   */
  function Cylinder(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    /**
     *
     * @class Cylinder
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: Cylinder, extend: Skin,
    /**
     * @override
     */
    ready: function(props) {
      var graphics, shape, liquid, barrel;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-300, 0, 600, 400);

      shape = new Shape(graphics);
      shape.x = 35;

      liquid = new LiquidLayer({resId: '量筒液体', mask: shape, color: props.color});//LiquidContainer.createLiquidLayer("量筒液体", props.color, shape);
      barrel = new Bitmap(RES.getRes("量筒"));

      var label = new NumberLabel({unit: ' ml', digits: 1});
      label.visible = false;
      label.x = 50;

      this.addChild(liquid, barrel, label);

      this.liquid = liquid;
      this.label = label;
      this.shape = shape;

      //this.store('volume', 5);
      //this.onChange('volume', props.volume);
    },

    refresh: function() {
      this.shape.rotation = -this.rotation;
    },

    toggle: function(duration) {
      duration = duration || 500;

      var label = this.label;
      if (label.visible) {
        Tween.get(label).to({
          alpha: 0
        }, duration).call(function() {
          label.visible = false;
        });
      } else {
        label.visible = true;
        Tween.get(label).to({
          alpha: 1.0
        }, duration);
      }
    },
    /**
     * @override
     */
    onChange: function(key, value) {

      switch (key) {
        case 'volume':
          this.shape.y = 200 - value * 175 / 80 - 25;
          this.label.save({number: value});
          this.label.y = this.shape.y - 10;
          this.liquid.visible = value > 0;
          break;
      }
    }
  });

  ENJ.Cylinder = Cylinder;

})();