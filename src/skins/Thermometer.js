//######################################################################################################################
// src/skins/Thermometer.js
//######################################################################################################################
(function() {
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;
  var NumberLabel = ENJ.NumberLabel;

  var Skin = ENJ.Skin;

  /**
   * 温度计
   * @param props
   * @constructor
   */
  function Thermometer(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: Thermometer,
    extend: Skin,

    ready: function(props) {
      var body = new Bitmap(RES.getRes('温度计'));

      var graphics = new Graphics();
      graphics.beginFill('#f00').drawRect(0,  0,  2,  250);
      var bar = new Shape(graphics);

      var label = new NumberLabel({unit: ' ℃', digits: 1});

      this.addChild(bar, body, label);

      bar.set({ x:3,  y: 0, scaleY: 0});
      label.x = 8;

      this.bar = bar;
      this.label = label;
      this.save({temperature: 'temperature' in props ? props.temperature : 0});
    },

    //toggle: function() {
    //  this.label.visible = !this.label.visible;
    //},

    onChange: function(key, val, old) {
      if (key === 'temperature') {
        this.bar.scaleY =  val  / 100;
        this.bar.y = 300 - 250 * this.bar.scaleY;

        if (val) {
          this.label.visible = true;
          this.label.save({number: val});
          this.label.y = this.bar.y - 12;
        } else {
          this.label.visible = false;
        }

      }
    }
  });

  ENJ.Thermometer = Thermometer;
})();
