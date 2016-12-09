//##############################################################################
// src/skins/Dropper.js
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
   *
   * @param props
   * @constructor
   */
  function Dropper(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: Dropper, extend: Skin,

    register: function() {
      this.speed = 1;
    },

    ready: function(props) {

      //label = new NumberLabel({ unit: 'ml' });
      //label.x = 10;

      var drop = new Bitmap(RES.getRes('水滴'));

      drop.x = 8;
      drop.visible = false;

      var pipe = new Bitmap(RES.getRes("滴管"));

      this.addChild(drop, pipe);

      this.set({
        drop: drop
      });
    },

    start: function() {
      base.start.call(this);

      this.drop.y = 120;
      this.drop.visible = true;

      Tween.get(this.drop)
          .to({
            y: 180
          }, 500)
    },

    stop: function() {
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
    }
  });

  ENJ.Dropper = Dropper;

})();
