//######################################################################################################################
// src/skins/PowderBottle.js
//######################################################################################################################
(function() {
  var Text = CreateJS.Text;
  var Tween = CreateJS.Tween;
  var Bitmap = CreateJS.Bitmap;
  var Container = CreateJS.Container;

  var Skin = ENJ.Skin;

  var base  = Skin.prototype;

  function PowderBottle(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: PowderBottle,
    extend: Skin,

    register: function() {

    },

    ready: function(props) {
      var cap = new Bitmap(RES.getRes('广口瓶瓶塞'));
      var body = new Bitmap(RES.getRes('广口瓶瓶身'));
      var text = new Text('聚酰胺粉', 'normal 18px Arial', '#000000');
      var label = new Bitmap(RES.getRes('标签'));
      var powder = new Bitmap(RES.getRes('聚酰胺粉'));

      //text.set({
      //  //text: '聚酰胺粉',
      //  //color: '#000',
      //  //font: '6px Arial',
      //  x: 7, y: 5
      //});


      text.set({x: 15, y: 56, scaleX: 0.5, scaleY: 0.5});
      label.set({x: 7, y: 50});
      //label.set({scaleX: 2, scaleY: 2});

      var location = {x: 9, y: -12};

      cap.set(location);
      cap.location = location;

      var container = new Container();
      container.addChild(body, label, text);

      var bounds = container.getBounds();
      container.cache(0,0,bounds.width,bounds.height);
      //container.set({scaleX: 0.5, scaleY: 0.5});
      //container.x = 7;
      //container.y = 50;


      this.addChild(cap, powder, /*body, */container);





      this.cap = cap;
      this.body = body;
    },



    release: function() {
      base.release.call(this);

    },

    refresh:function() {

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
    }
  });

  ENJ.PowderBottle = PowderBottle;

})();
