//######################################################################################################################
// src/skins/WeightingPaper.js
//######################################################################################################################
(function() {
  //var Tween = CreateJS.Tween;
  var Shape = CreateJS.Shape;
  var Bitmap = CreateJS.Bitmap;
  var Graphics = CreateJS.Graphics;
  var Container = CreateJS.Container;

  var Skin = ENJ.Skin;

  var base  = Skin.prototype;

  function WeightingPaper(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: WeightingPaper,
    extend: Skin,

    ready: function(props) {
      var paper = new Bitmap(RES.getRes('称量纸折边'));
      var content = new Container();

      var graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(0,  0,  80,  50);
      var shape = new Shape(graphics);
      shape.alpha = 0.5;
      shape.set({alpha: 0.5, x: 40, y: -32, rotation: 2});

      content.mask = shape;

      this.addChild(paper, content/*, shape*/);

      this.content = content;
    },

    clear: function() {
      this.content.removeAllChildren();
    },

    addSome: function() {
      var content = this.content;
      content.addChild.apply(content, arguments);
    },

    pickOne: function() {
      var content = this.content;

      var child = content.getChildAt(0);

      content.removeChildAt(0);

      return child;
    },


    onChange: function(key, val, old) {

    }
  });

  ENJ.WeightingPaper = WeightingPaper;

})();
