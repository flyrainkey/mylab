//######################################################################################################################
// src/skins/ProgressBar.js
//######################################################################################################################
(function() {
  var Shape = CreateJS.Shape;
  var Graphics = CreateJS.Graphics;

  var Skin = ENJ.Skin;

  function ProgressBar(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: ProgressBar,
    extend: Skin,

    ready: function(props) {
      var length = props.length || 500;

      var graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(0,  0,  length,  5);
      var bar = new Shape(graphics);

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(0,  0,  length,  1);
      var line = new Shape(graphics);

      this.addChild(line);
      line.set({ x:0,  y: 5 });

      this.addChild(bar);
      bar.set({ x:0,  y: 0, scaleX: 0});

      this.bar = bar;
    },

    onChange: function(key, val, old) {
      if (key === 'progress') {
        this.bar.scaleX =  val;
      }
    }
  });

  ENJ.ProgressBar = ProgressBar;
})();
