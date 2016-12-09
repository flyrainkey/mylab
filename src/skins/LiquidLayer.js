//##############################################################################
// src/skins/LiquidLayer.js
//##############################################################################
(function() {
  var Skin = ENJ.Skin;
  var Bitmap = CreateJS.Bitmap;
  var ColorFilter = CreateJS.ColorFilter;

  /**
   * 液体层
   * @param props
   * @constructor
   */
  function LiquidLayer(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: LiquidLayer, extend: Skin,

    ready: function(props) {
      this.addChild(new Bitmap(RES.getRes(props.resId)));
      this.mask = props.mask;
    },

    onChange: function(key, value) {
      switch (key) {
        case 'color':
          var a, r, g, b, color = value, bounds = this.getBounds().clone();

          a = ((color >> 24) & 0xff) / 255;
          r = (color >> 16) & 0xff;
          g = (color >> 8) & 0xff;
          b = color & 0xff;

          this.filters = [new ColorFilter(0, 0, 0, a, r, g, b, 0)];
          this.cache(0, 0, bounds.width, bounds.height);
          this.setBounds(0, 0, bounds.width, bounds.height);

          break;
      }
    }

  });


  ENJ.LiquidLayer = LiquidLayer;

})();