//######################################################################################################################
// src/skins/WaterBottle.js
//######################################################################################################################
(function() {
  //var Tween = CreateJS.Tween;
  //var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Sprite = CreateJS.Sprite;
  var SpriteSheet = CreateJS.SpriteSheet;

  var Skin = ENJ.Skin;

  var base  = Skin.prototype;

  function WaterBottle(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: WaterBottle,
    extend: Skin,

    ready: function(props) {
      var bottle, flow;

      bottle = new Bitmap(RES.getRes("蒸馏水瓶"));

      var data = {
        images: [RES.getRes("水流")],
        frames: { width: 100, height: 80 }
      };
      var sheet = new SpriteSheet(data);

      this.flow = flow = new Sprite(sheet);
      flow.set({y: 21, scaleX: -0.75, scaleY: 0.75, rotation: -10, visible: false});
      //flow.framerate = 30;
      //flow.gotoAndPlay(0);

      this.addChild(bottle, flow);
    },

    start: function(flag, rotation) {
      base.start.call(this);

      var flow = this.flow;

      flow.visible = true;
      flow.gotoAndPlay(0);
    },

    stop: function() {
      var flow = this.flow;

      flow.visible = false;
      flow.gotoAndStop(0);

      base.stop.call(this);
    },

    onChange: function(key, val, old) {

    }
  });

  ENJ.WaterBottle = WaterBottle;

})();
