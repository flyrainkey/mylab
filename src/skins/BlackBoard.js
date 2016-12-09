//##############################################################################
// src/skins/BlackBoard.js
//##############################################################################
(function() {
  var Skin = ENJ.Skin,
    Shape = CreateJS.Shape,
    Text = CreateJS.Text,
    Graphics = CreateJS.Graphics;

  function BlackBoard(store) {
    Skin.call(this, store);
  }

  ENJ.defineClass({
    /**
     *
     * @class BlackBoard
     * @extends Skin
     *
     * @constructor
     */
    constructor: BlackBoard, extend: Skin,
    /**
     * @override
     */
    ready: function(props) {
      var self = this, graphics, rect, label;

      graphics = new Graphics();
      graphics.beginFill('#000')
        .drawRect(0, 0, 951, 506);

      rect = new Shape(graphics);

      label = new Text();
      label.set({
        x: 951/2 , y: 200, color: "#fff", font: "bold 36px Arial", textAlign: 'center'
      });
      //label.setBounds(0, 0, 200, 40);
      //label.set({x: 480 - 100, y: 320 -20 });


      self.addChild(rect, label);


      self.set({
        label: label,
        rect: rect
      });

      //self.storeChanged('title');

    },
    /**
     * @override
     */
    onChange: function(key, value, old) {
      //var self = this, label = this.label;
      switch (key) {
        case 'title':
          this.label.text = value;
//          var bounds = label.getBounds();
//          console.log(bounds);
//          label.set({x: 480 , y: 320 });
          break;
      }
    }

  });

  ENJ.BlackBoard = BlackBoard;

})();
