//##############################################################################
// src/skins/PHTestPaper_2.js
//##############################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Bitmap = CreateJS.Bitmap;
  var Sprite = CreateJS.Sprite;
  var SpriteSheet = CreateJS.SpriteSheet;
  var ColorFilter = CreateJS.ColorFilter;

  var Skin = ENJ.Skin;


  /**
   * 烧杯
   * @param props
   * @constructor
   */
  function PHTestPaper_2(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: PHTestPaper_2, extend: Skin,

    ready: function(props) {
      var paper = new Bitmap(RES.getRes('PH试纸'));
      var bounds = paper.getBounds();
      paper.filters = [new ColorFilter(1, 1, 1, 1, 1, 0, 0, 0)];
      paper.cache(0, 0 ,bounds.width, bounds.height);

      var data = {
        images: [RES.getRes("色块2")],
        frames: { width: 19, height: 30 }
      };

      var sheet = new SpriteSheet(data);

      var shape = new Sprite(sheet);

      shape.visible = false;

      this.addChild(paper, shape);

      this.shape = shape;
    },


    onChange: function(key, value) {
      var shape = this.shape;

      switch (key) {
        case 'ph':

          shape.visible = value > 0;
          if (shape.visible) {
            shape.alpha = 0.5;
            shape.gotoAndStop(value - 1);

            Tween.get(shape).to({alpha: 1.0}, 500);
          }
          break;
      }
    }
  });

  ENJ.PHTestPaper_2 = PHTestPaper_2;

})();
