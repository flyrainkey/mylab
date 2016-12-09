//######################################################################################################################
// src/skins/InductionCooker.js
//######################################################################################################################
(function() {
  var Bitmap = CreateJS.Bitmap;
  var Tween = CreateJS.Tween;
  var Skin = ENJ.Skin;
  var base = Skin.prototype;

  /**
   * 电磁炉
   * @param props
   * @constructor
   */
  function InductionCooker(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: InductionCooker,
    extend: Skin,

    ready: function() {
      var body = new Bitmap(RES.getRes("电磁炉"));
      var button = new Bitmap(RES.getRes("电磁炉旋钮"));

      var bounds = button.getBounds();
      button.set({x: 162, y: 90, regX: bounds.width * 0.5, regY: bounds.height * 0.5});

      this.addChild(
        body, button
      );

      this.button = button;
    },

    start: function () {
      base.start.call(this);
      Tween.get(this.button).to({rotation: 90}, 200);
    },

    stop: function () {
      base.stop.call(this);
      Tween.get(this.button).to({rotation: 0}, 200);
    }
  });

  ENJ.InductionCooker = InductionCooker;
})();
