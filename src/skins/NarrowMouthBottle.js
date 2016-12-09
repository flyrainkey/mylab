//##############################################################################
// src/skins/NarrowMouthBottle.js
//##############################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Shape = CreateJS.Shape;
  var Text = CreateJS.Text;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;
  var Container = CreateJS.Container;

  var Skin = ENJ.Skin;
  var NumberLabel = ENJ.NumberLabel;
  var LiquidLayer = ENJ.LiquidLayer;
  var LiquidContainer = ENJ.LiquidContainer;

  var base = Skin.prototype;

  /**
   * 细口瓶
   * @param props
   * @constructor
   */
  function NarrowMouthBottle(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: NarrowMouthBottle, extend: Skin,

    ready: function(props) {
      var graphics, shape, label, liquid, bottle;

      graphics = new Graphics();
      graphics.beginFill('#0f0')
        .drawRect(-200, 0, 400, 200)
        /*.drawEllipse(-38, -7.5, 76, 15)*/;

      shape = new Shape(graphics);
      shape.x = 40;

      //label = new NumberLabel({ unit: 'ml' });
      //label.x = 10;

      //liquid = LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);
      liquid = new LiquidLayer({resId: '细口瓶液体', mask: shape, color: props.color});// LiquidContainer.createLiquidLayer("烧杯液体", props.color, shape);

      bottle = new Bitmap(RES.getRes("细口瓶"));

      if (props.useCap) {
        var cap = new Bitmap(RES.getRes('玻璃塞'));
        cap.set({x: 16, y: -10});
        this.addChild(cap);
        this.cap =  cap;
      }

      if (props.label) {
        label = new Bitmap(RES.getRes('标签'));
        var text = new Text(props.label, 'normal 18px Arial', '#000000');

        var container = new Container();
        container.addChild(bottle, label, text);

        text.set({x: 15, y: 56, scaleX: 0.5, scaleY: 0.5});
        label.set({x: 7, y: 50});

        var bounds = container.getBounds();
        container.cache(0,0,bounds.width,bounds.height);

        this.addChild(liquid, container);
      } else {
        this.addChild(liquid, bottle);
      }

      this.set({
        liquid: liquid,
        //label: label,
        shape: shape
      });

      this.color = props.color;
    },

    start: function() {
      base.start.call(this);

      if (this.cap) {
        Tween.get(this.cap)
          .to({
            x: 60, y: -60, alpha: 0.0, rotation: 60
          }, 500);
      }

    },

    stop: function() {
      base.stop.call(this);

      if (this.cap) {
        Tween.get(this.cap)
          .to({
            x: 16, y: -10, alpha: 1.0, rotation: 0
          }, 500);
      }
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

    onChange: function(key, value) {
      var label = this.label, shape = this.shape;

      switch (key) {
        case 'volume':

          shape.y = 80 - value * 78 /100 - 2;
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

  ENJ.NarrowMouthBottle = NarrowMouthBottle;

})();
