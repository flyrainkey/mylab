//##############################################################################
// src/skins/Funnel.js
//##############################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;
  var NumberLabel = ENJ.NumberLabel;
  var LiquidLayer = ENJ.LiquidLayer;
  var LiquidContainer = ENJ.LiquidContainer;

  var base = Skin.prototype;

  /**
   * 砂芯漏斗
   * @param props
   * @constructor
   */
  function Funnel(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: Funnel, extend: Skin,

    register: function() {
      this.speed = 1;
    },

    ready: function(props) {
      var graphics, shape, shape2, plug, liquid, content, body, drop;

      graphics = new Graphics();
      graphics.beginFill('#0f0')
        .drawRect(-200, 0, 400, 200)
        /*.drawEllipse(-38, -7.5, 76, 15)*/;

      shape = new Shape(graphics);
      shape.x = 20;

      shape2 = new Shape(graphics);
      shape2.x = 20;
      shape2.y = 35;

      //label = new NumberLabel({ unit: 'ml' });
      //label.x = 10;

      drop = new Bitmap(RES.getRes('水滴'));

      //liquid = LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);
      liquid = new LiquidLayer({resId: '砂芯漏斗2', mask: shape, color: props.color});// LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);
      content = new LiquidLayer({resId: '砂芯漏斗2', mask: shape2, color: props.color});// LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);

      plug = new Bitmap(RES.getRes('塞子'));
      plug.x = 7;
      plug.y = 75;

      drop.x = 16;
      drop.visible = false;

      content.visible = false;

      body = new Bitmap(RES.getRes("砂芯漏斗"));

      this.addChild(content, liquid, drop, body, plug);

      this.set({
        content: content,
        liquid: liquid,
        plug: plug,
        drop: drop,
        shape: shape
      });

      this.color = props.color;
    },

    start: function() {
      base.start.call(this);

      this.drop.y = 120;
      this.drop.visible = true;

      this.tween =
        Tween.get(this.drop, {loop: true})
          .to({
            y: 180
          }, 500)
    },

    stop: function() {
      this.tween.setPaused(true);
      this.drop.visible = false;

      base.stop.call(this);
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

          shape.y = 45 - value * 45 /50;
          this.liquid.visible = value > 0;
          //if (!this.fixed) {
          //  shape.y = 80 - value * 78 /100 - 2;
          //} else {
          //  shape.y = 38 - value * 38 /100 + 40;
          //}


          //label.y = shape.y - 10;
          //label.save({number: value});

          break;
        case 'display':
          this.content.visible = value;
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

  ENJ.Funnel = Funnel;

})();
