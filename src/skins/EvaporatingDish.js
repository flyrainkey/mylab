//##############################################################################
// src/skins/EvaporatingDish.js
//##############################################################################
(function() {

  var ColorFilter = CreateJS.ColorFilter;
  var Bitmap = CreateJS.Bitmap;

  var Skin = ENJ.Skin;

  var base = Skin.prototype;

  /**
   * 砂芯漏斗
   * @param props
   * @constructor
   */
  function EvaporatingDish(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: EvaporatingDish, extend: Skin,


    ready: function(props) {

      //label = new NumberLabel({ unit: 'ml' });
      //label.x = 10;

      var body = new Bitmap(RES.getRes('蒸发皿'));

      var liquid = new Bitmap(RES.getRes("蒸发皿流出液"));

      this.addChild(body, liquid);

      liquid.visible = false;
      liquid.x = -5;
      liquid.y = 5;

      this.set({
        liquid: liquid
      });
    },

    start: function() {
      base.start.call(this);
      this.liquid.visible = true;
    },

    stop: function() {
      this.liquid.visible = false;
      base.stop.call(this);
    },

    onChange: function(key, value) {
      var liquid = this.liquid;
      switch (key) {
        case 'color':
          var am = ((value >> 24) & 0xff) / 255;
          var rm = ((value >> 16) & 0xff) / 255;
          var gm = ((value >> 8)  & 0xff) / 255;
          var bm = (value & 0xff) / 255;
          var bounds = liquid.getBounds();
          liquid.filters = [new ColorFilter(rm,gm,bm,am)];
          liquid.cache(0, 0, bounds.width, bounds.height);

          break;
      }
    }
  });

  ENJ.EvaporatingDish = EvaporatingDish;

})();
