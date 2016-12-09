//##############################################################################
// src/skins/SugarBall.js
//##############################################################################
(function() {
  var Skin = ENJ.Skin;
  var Bitmap = CreateJS.Bitmap;
  var ColorFilter = CreateJS.ColorFilter;

  function SugarBall(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: SugarBall, extend: Skin,

    ready: function(props) {
      this.addChild(new Bitmap(RES.getRes('糖球')));
      this.set({regX: 6, regY: 6});
    },

    onChange: function(key, value) {
      switch (key) {
        case 'factors':
          var factors = value, bounds = this.getBounds().clone();

          this.filters = [new ColorFilter(1, factors[0], factors[1], factors[2])];
          this.cache(0, 0, bounds.width, bounds.height);
          this.setBounds(0, 0, bounds.width, bounds.height);

          break;
      }
    }

  });


  ENJ.SugarBall = SugarBall;

})();