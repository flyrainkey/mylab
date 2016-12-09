//##############################################################################
// src/elements/Cuvette.js
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
  function Cuvette(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    /**
     *
     * @class Cuvette
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: Cuvette, extend: Skin,
    /**
     * @override
     */
    ready: function(props) {
      var graphics, shape, liquid, body;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-300, 0, 600, 400);

      shape = new Shape(graphics);
      shape.x = 9;

      liquid = new LiquidLayer({resId: '比色皿液体', mask: shape, color: props.color});//LiquidContainer.createLiquidLayer("量筒液体", props.color, shape);
      body = new Bitmap(RES.getRes("比色皿"));

      //var label = new NumberLabel({unit: ' ml', digits: 1});
      //label.visible = false;
      //label.x = 50;

      this.addChild(liquid, body);

      this.liquid = liquid;
      this.shape = shape;

      //this.store('volume', 5);
      //this.onChange('volume', props.volume);
    },

    refresh: function() {
      this.shape.rotation = -this.rotation;
      this.liquid.visible = this.rotation < 90;
    },

    //toggle: function(duration) {
    //  duration = duration || 500;
    //
    //  var label = this.label;
    //  if (label.visible) {
    //    Tween.get(label).to({
    //      alpha: 0
    //    }, duration).call(function() {
    //      label.visible = false;
    //    });
    //  } else {
    //    label.visible = true;
    //    Tween.get(label).to({
    //      alpha: 1.0
    //    }, duration);
    //  }
    //},
    /**
     * @override
     */
    onChange: function(key, value) {

      switch (key) {
        case 'volume':
          this.shape.y = 50 - value * 45 / 2.5 - 2;
          //this.label.save({number: value});
          //this.label.y = this.shape.y - 10;
          this.liquid.visible = value > 0;
          break;
      }
    }
  });

  ENJ.Cuvette = Cuvette;

})();