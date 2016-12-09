//######################################################################################################################
// src/skins/Spectrophotometer.js
//######################################################################################################################
ENJ.Spectrophotometer=(function() {
  var Skin = ENJ.Skin;
  var DigitalDisplay = ENJ.DigitalDisplay;

  var base = Skin.prototype;

  /**
   * 分光光度计
   * @param props
   * @constructor
   */
  /*function Spectrophotometer(store) {
    Skin.call(this, store);
  }
*/
 return ENJ.defineClass({
    constructor:function Spectrophotometer(store) {
      Skin.call(this, store);
    },
    extend:  Skin,

    register: function() {
      base.register.call(this);
      this.luminosity = 0;
      this.grade = 0;
    },

    ready: function() {
      var bar = new CRE.Bitmap(RES.getRes("分光光度计拉杆"));

      var mask = new CRE.Shape();
      //mask.x = 10;
      mask.y = 180;
      mask.alpha = 0.5;
      mask.graphics.beginFill('#0f0').drawRect(0,0,100,100).drawCircle(65,4,10);

      bar.mask = mask;

      var data = {
        images: [RES.getRes("分光光度计")],
        frames: { width: 300, height: 216 },
        animations: {
          close: 0, open: 1
        }
      };

      var sheet = new CRE.SpriteSheet(data);

      var body = new CRE.Sprite(sheet);

      var digitalDisplay = new DigitalDisplay({number: Math.random() * 0.1, maxLength: 5});
      digitalDisplay.set({
        x: 158, y: 148, scaleX: 0.6, scaleY: 0.6//, visible: false
      });

      this.addChild(
        body, bar, /*mask,*/ digitalDisplay
      );

      this.bar = bar;
      this.body = body;
      this.digitalDisplay = digitalDisplay;

      this.stop();
      this.onChange('grade', 0);
    },

    start: function() {
      base.start.call(this);
      this.body.gotoAndStop('close');
    },

    stop: function() {
      base.stop.call(this);
      this.body.gotoAndStop('open');
    },

    correct: function() {
      this.digitalDisplay.save({number: 0});
    },

    onChange: function(key, val, old) {
      if (key === 'luminosity') {
        this.digitalDisplay.save({number: this.luminosity});
      } else if (key === 'grade') {
        var bar = this.bar;
        switch (val) {
          case 0:
            bar.x = 57;
            bar.y = 152;
            bar.mask.y = 180;
            break;
          case 1:
            bar.x = 56;
            bar.y = 157;
            bar.mask.y = 183;
            break;
          case 2:
            bar.x = 53;
            bar.y = 167;
            bar.mask.y = 183;
            break;
          case 3:
            bar.x = 50;
            bar.y = 177;
            bar.mask.y = 183;
            break;
        }
      }
    }
  });

  //ENJ.Spectrophotometer = Spectrophotometer;
})();
