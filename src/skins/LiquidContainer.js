//##############################################################################
// src/skins/BlackBoard.js
//##############################################################################
(function() {
  var Bitmap = CreateJS.Bitmap;
  var ColorFilter = CreateJS.ColorFilter;

  function LiquidContainer() {
    throw new Error('LiquidContainer is static class and can not be instantiated');
  }

  LiquidContainer.createLiquidLayer = function (resId, color, mask) {
    var liquid = new Bitmap(RES.getRes(resId));

    var a, r, g, b, bounds = liquid.getBounds().clone();

    a = ((color >> 24) & 0xff) / 255;
    r = (color >> 16) & 0xff;
    g = (color >> 8) & 0xff;
    b = color & 0xff;

    liquid.filters = [new ColorFilter(0, 0, 0, a, r, g, b, 0)];
    liquid.cache(0, 0, bounds.width, bounds.height);
    liquid.setBounds(0, 0, bounds.width, bounds.height);

    liquid.mask = mask;

    //mask.compositeOperation = 'destination-in';

    return liquid;
  };

  ENJ.LiquidContainer = LiquidContainer;

})();