//##############################################################################
// src/steps/Step_ConstantVolume.js
//##############################################################################
ENJ.Step_ConstantVolume = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 定容
     * 所用：蒸馏水、容量瓶
     *
     * @constructor
     */
    constructor: function Step_ConstantVolume() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store,
        handlers = this.handlers = [], bottle, flask;

      flask = this.flask = scene[store.flask];
      bottle = this.bottle = scene.waterBottle;
        var self = this;

      this.flags = [];

      if (!flask.active) {
        flask.start();
        console.log("TTTTTTTTTTT");
      }

      console.log("TTTTTTTTTTT222222");

      Tween.get(flask).to({
       //regX: 62, regY: 120, x: 300, y: 400, rotation: 30   //rotation: 30为什么没有反应？ 为什么flask.start()放在外面执行不行了
          x: 310, y: 100, rotation: 0
       }, 250).call(function(){
        flask.start();
      });

      if (!bottle.active/*this.store.keeping*/) {
        //bottle.active = true;
        bottle.start();
        Tween.get(bottle).to({
          x: flask.x + 20, y: flask.y - 200
        }, 250).call(function(){
            if(!store.act){
                self.onClickBottle();
            }
        })
      }


      handlers[0] = this.onClickBottle.bind(this);
      bottle.addEventListener('click', handlers[0]);

      bottle.cursor = 'pointer';
    },

    stop: function() {
      var store = this.store;
      var scene = this.scene;
     var bottle = this.bottle = scene.waterBottle;
     var flask = this.flask = scene[store.flask];
     var offsetX = store.offsetX || 0, offsetY = store.offsetY || 0;

     //bottle.active = false;
     /* Tween.get(bottle).to(
        {x:bottle.location.x,y:bottle.location.y,rotation:0}
        , 250);*/
      Tween.get(bottle).to({
        x:bottle.location.x,y:bottle.location.y,rotation:0
      },250).call(function(){

        bottle.stop();


      });

        Tween.get(flask).to({
            x:flask.location.x ,y:flask.location.y ,rotation:0
        },250).call(function(){
            flask.stop();
        });
      bottle.cursor = 'auto';
      bottle.removeEventListener('click', this.handlers[0]);

      base.stop.call(this);
    },

   /* update: function(event) {
      var volume, flask = this.flask, bottle = this.bottle;
      if (/!*this.active && *!/this.flags[0] && !this.flags[1]) {
        volume = flask.store('volume') + event.delta/100;
        if (volume >= this.store.volume) {
          volume = this.store.volume;
          this.flags[1] = true;

          flask.stop();
          bottle.stop();
          //bottle.active = false;
          Tween.get(bottle).to(
            {x:bottle.location.x,y:bottle.location.y,rotation:0}
            , 250).call(this.stop.bind(this));
        }
        flask.store('volume', volume);
      }
    },*/
    update: function() {
      this.flask.refresh();
    },

    onClickBottle: function() {
      var self=this;
      if (!this.flags[0]) {
        this.flags[0] = true;
        Tween.get(this.bottle).to({x:this.flask.x ,y: this.flask.y - 80,rotation:-30},250)
            .wait(1000)
            .call(function(){

                self.stop();
        });

      }
    }
  });
})();
