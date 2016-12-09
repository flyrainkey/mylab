//##############################################################################
// src/skins/SuckBall.js
//##############################################################################
(function() {
  var Skin = ENJ.Skin;
  var Bitmap = CreateJS.Bitmap;
  var Rectangle = CreateJS.Rectangle;
  //var ColorFilter = CreateJS.ColorFilter;

  /**
   * 吸球
   * @param props
   * @constructor
   */
  function SuckBall(props) {
    this.scale = 1;
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: SuckBall, extend: Skin,

    ready: function(props) {
      var ball = new Bitmap(RES.getRes('吸球'));
      var mouth = new Bitmap(RES.getRes('吸球'));


      ball.sourceRect = new Rectangle(0,36,38,30);
      mouth.sourceRect = new Rectangle(0,0,38,36);


      ball.y = 36;
      this.addChild(mouth, ball);
      //this.set({regX: 6, regY: 6});

      this.ball = ball;


    },

    onChange: function(key, value) {
      var ball = this.ball;

      switch (key) {
        case 'scale':

          ball.scaleY = value;
          break;
      }
    }

  });


  ENJ.SuckBall = SuckBall;

})();