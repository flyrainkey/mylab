//######################################################################################################################
// src/skins/WildMouthBottle.js
//######################################################################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Bitmap = CreateJS.Bitmap;
  var Container = CreateJS.Container;

  var Skin = ENJ.Skin;

  var base  = Skin.prototype;

  /**
   * 广口瓶
   * @param props
   * @constructor
   */
  function WildMouthBottle(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: WildMouthBottle,
    extend: Skin,

    ready: function(props) {
      var cap = new Bitmap(RES.getRes('广口瓶瓶塞'));
      var body = new Bitmap(RES.getRes('广口瓶瓶身'));

      var location = {x: 11, y: -15};

      cap.set(location);
      cap.location = location;
      //var container = new Container();



      var content = props.content;

      //content = new Container();
      //for (var i = 0; i < 50; ++i) {
      //  var ball = new Bitmap(RES.getRes('糖球'));
      //  ball.x = Math.random() * 60/* + 10*/;
      //  ball.y = Math.random() * 60 + 57;
      //  content.addChild(ball);
      //}
      //content.cache(0,0,80,137);

      if (content instanceof Container) {
        var bounds = content.getBounds();
        content.y = 17;//137 - bounds.height;

        this.addChild(content);
      }
      console.log(content instanceof Container);

      this.addChild(cap, body);

      this.cap = cap;
    },

    start: function() {
      base.start.call(this);
      Tween.get(this.cap).to({
        x: -30, y: -30, alpha: 0, rotation: -60
      }, 500);
    },

    stop: function() {
      var cap = this.cap;
      Tween.get(cap).to({
        x: cap.location.x, y: cap.location.y, alpha: 1.0, rotation: 0
      }, 500);

      base.stop.call(this);
    },

    onChange: function(key, val, old) {
      if (key === 'temperature') {


      }
    }
  });

  ENJ.WildMouthBottle = WildMouthBottle;
  
})();
