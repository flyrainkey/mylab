//##############################################################################
// src/steps/Step_ShakeUp.js
//##############################################################################
ENJ.Step_ShakeUp = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 摇匀
     * 所用：容量瓶
     *
     * @constructor
     */
    constructor: function Step_ShakeUp() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var flask, flags = this.flags = [], handlers = this.handlers = [];
      var scene = this.scene;
      var store = this.store;
      var self  = this;
      //flask = this.flask = this.scene.volumetricFlasks[this.store.flask];
      flask = this.flask = scene[store.flask];
      flask.cursor = 'pointer';

      handlers[0] = this.onClickFlask.bind(this);
      console.log("rrrrrrrrrrrr");
      Tween.get(flask).to({
        regX: -10, regY: 120,
        x: 400, y: 200, rotation: 30   //rotation: 30为什么没有反应？
      }, 250).call(function() {
        flags[0] = true;
      }).call(function(){
        if(!store.act){
          self.onClickFlask();
        }
      });
      console.log("rrrrrrrrrrrrqqqqq");
      flask.addEventListener('click', handlers[0]);
    },

    stop: function() {
      var flask = this.flask;

      flask.cursor = 'auto';
      //regX: 0, regY: 0
      Tween.get(flask).to({
        x: flask.location.x, y: flask.location.y,regX: 0, regY: 0  //如果这边加一个rotation 最后 元素还是没有角度？
      }, 250).call(function() {
        flask.rotation = 0;
        flask.refresh();
      });

      flask.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    update: function() {
      this.flask.refresh();
    },

    onClickFlask: function() {
      if (!this.flags[0]) { return; }
      var self=this;
      var flask = this.flask, stop = this.stop.bind(this);
      Tween.get(flask)
        .to({x:400,y:200,regX:0,regY:100},500)
        .to({ rotation: 30 }, 150)
        .to({ rotation: -30 }, 150)
        .to({ rotation: 30 }, 150)
        .to({ rotation: -30 }, 150)
        .to({x:400,y:200,regX:0,regY:0,rotation:0},500)
          .call(function() {
         //self.stop();//stop.bind(this)是什么意思？
          stop();
        });
    }
  });
})();
