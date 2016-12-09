//######################################################################################################################
// src/skins/PlatformScale.js
//######################################################################################################################
(function() {
  var Skin = ENJ.Skin;
  var DigitalDisplay = ENJ.DigitalDisplay;

  var base = Skin.prototype;

  /**
   * 台秤
   * @param props
   * @constructor
   */
  function PlatformScale(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: PlatformScale,
    extend: Skin,

    register: function() {
      base.register.call(this);
      this.weight = 0;
    },

    ready: function(props) {
      var body = new CreateJS.Bitmap(RES.getRes("台秤"));

      var digitalDisplay = new DigitalDisplay({number:0, maxLength: 5});
      digitalDisplay.set({
        x: 100, y: 108, scaleX: 0.5, scaleY: 0.5
      });

      this.addChild(
        body, digitalDisplay
      );

      this.digitalDisplay = digitalDisplay;
    },

    onChange: function(key, val, old) {
      if (key === 'weight') {
        this.digitalDisplay.save({number: this.weight});
      }
    }
  });

  ENJ.PlatformScale = PlatformScale;
})();
