//##############################################################################
// src/skins/Balance.js
//##############################################################################
(function() {
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;
  var NumberLabel = ENJ.NumberLabel;
  var LiquidLayer = ENJ.LiquidLayer;
  var LiquidContainer = ENJ.LiquidContainer;

  /**
   * 烧杯
   * @param props
   * @constructor
   */
  function Balance(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: Balance, extend: Skin,

    ready: function(props) {
      this.dist = 100;

      var bar = new Bitmap(RES.getRes('天平横杆'));
      var base = new Bitmap(RES.getRes('天平底座'));
      var tray1 = new Bitmap(RES.getRes('天平托盘'));
      var tray2 = new Bitmap(RES.getRes('天平托盘'));

      this.addChild(base, tray1, tray2, bar);
      //bar.visible = false;
      bar.set({x: 150, y: 80, regX: 109, regY: 60});
      tray1.set({x: 50, regX: 50, regY: 50});
      tray2.set({x: 250, regX: 50, regY: 50});



      this.bar = bar;
      this.tray1 = tray1;
      this.tray2 = tray2;

      this.save({angle: 0});
    },


    onChange: function(key, value) {

      switch (key) {
        case 'angle':

          this.bar.rotation = value;
          this.tray1.y = this.dist * Math.sin(-value/180*Math.PI) + 80;
          this.tray2.y = this.dist * Math.sin(value/180*Math.PI) + 80;

          break;
      }
    }
  });

  ENJ.Balance = Balance;

})();
