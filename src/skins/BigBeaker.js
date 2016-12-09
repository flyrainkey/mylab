//##############################################################################
// src/skins/BigBeaker.js
//##############################################################################
(function() {
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;
  var NumberLabel = ENJ.NumberLabel;
  //var LiquidContainer = ENJ.LiquidContainer;
  var LiquidLayer = ENJ.LiquidLayer;

  function BigBeaker(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: BigBeaker, extend: Skin,

    ready: function(props) {
      var graphics, shape, label, liquid, bottle;

      graphics = new Graphics();
      graphics.beginFill('#0f0')
        .drawRect(-200, 0, 400, 200)
        /*.drawEllipse(-38, -7.5, 76, 15)*/;

      shape = new Shape(graphics);
      shape.x = 75;

      //label = new NumberLabel({ unit: 'ml' });
      //label.x = 10;

      liquid = new LiquidLayer({resId: '大烧杯液体', mask: shape, color: props.color});//LiquidContainer.createLiquidLayer("大烧杯液体", props.color, shape);

      bottle = new Bitmap(RES.getRes("大烧杯"));

      this.addChild(liquid, bottle);

      this.set({
        liquid: liquid,
        //label: label,
        shape: shape
      });
    },

    refresh: function() {
      this.shape.rotation = -this.rotation;
    },

    onChange: function(key, value) {
      var label = this.label, shape = this.shape;

      switch (key) {
        case 'volume':
          shape.y = 150 - value * 150 /300 - 2;

          //label.y = shape.y - 10;
          //label.save({number: value});

          break;
        //case 'color':
        //  this.liquid = LiquidContainer.createLiquidLayer("烧杯液体", value, shape);
        //  this.removeChildAt(0);
        //  this.addChildAt(this.liquid, 0);
        //  break;
      }
    }
  });

  ENJ.BigBeaker = BigBeaker;

})();
