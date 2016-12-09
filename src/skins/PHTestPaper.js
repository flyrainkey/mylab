//##############################################################################
// src/skins/PHTestPaper.js
//##############################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Bitmap = CreateJS.Bitmap;
  var Sprite = CreateJS.Sprite;
  var SpriteSheet = CreateJS.SpriteSheet;

  var Skin = ENJ.Skin;


  /**
   * 烧杯
   * @param props
   * @constructor
   */
  function PHTestPaper(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: PHTestPaper, extend: Skin,

    ready: function(props) {
      var paper = new Bitmap(RES.getRes('PH试纸'));

      var data = {
        images: [RES.getRes("色块")],
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
            shape.gotoAndStop(value*2-1);

            Tween.get(shape).to({alpha: 1.0}, 500);
          }
          break;
      }
    }
  });

  ENJ.PHTestPaper = PHTestPaper;

})();
