//######################################################################################################################
// src/skins/DigitalDisplay.js
//######################################################################################################################
(function() {
  var Skin = ENJ.Skin;
  var base = Skin.prototype;

  /**
   * 数显
   * @param props
   * @constructor
   */
  function DigitalDisplay(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: DigitalDisplay,
    extend: Skin,

    register: function() {
      base.register.call(this);
      this.number = 0;
      this.maximum = 99999;
      this.minimum = -9999;
      this.maxLength = 5;
    },

    ready: function(props) {
      var data = {
        images: [RES.getRes("电子数字")],
        frames: { width: 10, height: 18 },
        animations: {
          "-": 0,
          "0": 1,
          "1": 2,
          "2": 3,
          "3": 4,
          "4": 5,
          "5": 6,
          "6": 7,
          "7": 8,
          "8": 9,
          "9": 10//,
          //"e": 11,
          //"E": 11
        }
      };

      var sheet = new CreateJS.SpriteSheet(data);

      var display = new CreateJS.BitmapText('0', sheet);

      var bounds = display.getBounds();

      this.digitWidth = bounds.width;
      this.digitHeight = bounds.height;
      display.letterSpacing = Math.floor(this.digitWidth * 0.6);

      this.displayMaxWidth = (this.digitWidth + display.letterSpacing) * this.maxLength;

      var graphics = new CreateJS.Graphics();
      graphics.beginFill('#f00').drawCircle(0, 0, (display.letterSpacing-3) * 0.5);

      var dot = new CreateJS.Shape(graphics);
      dot.visible = false;

      this.addChild(
        display, dot
      );

      this.dot = dot;
      this.display = display;

      //if (!props || !props.hasOwnProperty('number')) {
        this.onChange('number');
      //}
    },

    onChange: function(key, val, old) {
      if (key === 'number') {
        var num = this.number;
        var dot = this.dot;
        var display = this.display;

        //console.log('change');

        if (!display || !dot) { return; }

        if (num < this.minimum) {
          num = this.minimum;
        } else if (num > this.maximum) {
          num = this.maximum;
        }

        var text = ('' + num.toFixed(this.maxLength)).slice(0, this.maxLength + 1);

        display.text = text;
        display.x = this.displayMaxWidth - display.getBounds().width;

        var index = text.indexOf('.');
        if (index > 0 && index < text.length - 1) {
          dot.x = index * (this.digitWidth + display.letterSpacing) - 0.5 *  display.letterSpacing + display.x;
          dot.y = this.digitHeight - 2;
          dot.visible = true;
        } else {
          dot.visible = false;
        }

      } else if (key === 'maxLength') {
        this.displayMaxWidth = (this.digitWidth + this.display.letterSpacing) * this.maxLength;
        this.minimum = -Math.pow(10, this.maxLength)+1;
        this.maximum = +Math.pow(10, this.maxLength + 1)-1;
        this.onChange('number');
      }
    }
  });

  ENJ.DigitalDisplay = DigitalDisplay;
})();
