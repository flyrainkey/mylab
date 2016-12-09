//##############################################################################
// src/steps/Step_WashCuvette.js
//##############################################################################
(function() {
  var Step = ENJ.Step;
  var Tween = CreateJS.Tween;

  var base = Step.prototype;

  function Step_WashCuvette() {
    Step.apply(this, arguments);
  }

  ENJ.defineClass({

    constructor: Step_WashCuvette, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store, self = this;

      var cuvette = scene.cuvettes[store.no], beaker = scene.beakernew;//, liquid = scene.liquid;


      Tween.get(cuvette)
        //.wait(500)
        .to({
          x: 545, y: 400, rotation: 60
        }, 500)
        .call(function() {
          self.startDumping();
        });


      //this.liquid = liquid;
      this.cuvette = cuvette;
      this.beaker = beaker;
      this.flags = [];
    },

    startDumping: function() {
      var cuvette = this.cuvette;

      this.flags[0] = true;

      Tween.get(cuvette)
        .to({
          /*x: 520, y: 150, */
          rotation: 120
        }, 250);


    },

    stopDumping: function() {
      this.flags[0] = false;

      var cuvette = this.cuvette, tube = this.tube;

      //Tween.get(tube)
      //  .to({
      //    x: tube.location.x, y: 150, rotation: 0
      //  }, 500)
      //  .call(function() {
      //    tube.stop();
      //  })
      //  .to({
      //    y: tube.location.y
      //  }, 500)
      //  .call(this.stop.bind(this));
      //
      //
      Tween.get(cuvette)
        .to({
          rotation: 60
        }, 500)
        .call(this.stop.bind(this));

    },

    stop: function() {


      base.stop.call(this);
    },

    update: function(event) {
      var beaker = this.beaker, cuvette = this.cuvette,  store = this.store;



      if (this.flags[0]) {
        var delta = event.delta*0.001;

        var volume = cuvette.volume;

        if (volume <= 0) {
          this.stopDumping();
          cuvette.save({volume: 0});
        } else {
          cuvette.save({volume: volume - delta});
          beaker.save({volume: beaker.volume + delta});
        }

      }

      cuvette.refresh();
    }

  });

  ENJ.Step_WashCuvette = Step_WashCuvette;

})();
