//##############################################################################
// src/skins/TubeWithBranch.js
//##############################################################################
(function() {
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;
  var NumberLabel = ENJ.NumberLabel;
  var LiquidLayer = ENJ.LiquidLayer;
  var LiquidContainer = ENJ.LiquidContainer;

  /**
   * 具支试管
   * @param props
   * @constructor
   */
  function TubeWithBranch(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: TubeWithBranch, extend: Skin,

    register: function() {
      this.speed = 1;
    },

    ready: function(props) {
      var graphics, shape, label, liquid, body;

      graphics = new Graphics();
      graphics.beginFill('#0f0')
        .drawRect(-200, 0, 400, 200)
        /*.drawEllipse(-38, -7.5, 76, 15)*/;

      shape = new Shape(graphics);
      shape.x = 70;

      //label = new NumberLabel({ unit: 'ml' });
      //label.x = 10;

      //liquid = LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);
      liquid = new LiquidLayer({resId: '具支试管液体', mask: shape, color: props.color});// LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);
      liquid.x = 55;

      body = new Bitmap(RES.getRes("具支试管"));

      this.addChild(liquid, body);

      this.set({
        liquid: liquid,
        //label: label,
        shape: shape
      });

      this.color = props.color;
    },

    //fix: function() {
    //
    //},

    refresh: function() {
      //this.shape.rotation = -this.rotation * this.speed;
      //this.shape.x = 40 + (this.fixed ? Math.sin(this.rotation/180*3.14)*25 : 0);
      //this.shape.x = 40;
      //if (this.shape.y > 40) {
      //  this.shape.x += Math.sin(this.rotation/180*3.14)*27;
      //}
    },

    onChange: function(key, value) {
      var label = this.label, shape = this.shape;

      switch (key) {
        case 'volume':

          shape.y = 140 - value * 120 /100 - 5;
          this.liquid.visible = value > 0;
          //if (!this.fixed) {
          //  shape.y = 80 - value * 78 /100 - 2;
          //} else {
          //  shape.y = 38 - value * 38 /100 + 40;
          //}


          //label.y = shape.y - 10;
          //label.save({number: value});

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

  ENJ.TubeWithBranch = TubeWithBranch;

})();
