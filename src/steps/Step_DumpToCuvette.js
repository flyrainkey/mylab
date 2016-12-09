//##############################################################################
// src/steps/Step_DumpToCuvette.js
//##############################################################################
(function() {
  var Step = ENJ.Step;
  var Tween = CreateJS.Tween;

  var base = Step.prototype;

  function Step_DumpToCuvette() {
    Step.apply(this, arguments);
  }

  ENJ.defineClass({

    constructor: Step_DumpToCuvette, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store, self = this;

      var cuvette = scene.cuvettes[store.no], tube = scene[store.bottle];//, liquid = scene.liquid;

      var onClick = this.onClick = this.onClick.bind(this);

     cuvette.save({color: tube.color});

      Tween.get(tube)
        .to({
          y: 150
        }, 500)
        .call(function() {
          tube.start();
        })
        .to({
          x: 410, y: 225, rotation: 30
        }, 500)
        .call(function() {
          if (store.autoPlay) {
            self.startDumping();
          } else {
            tube.addEventListener('click', onClick);
            tube.cursor = "pointer";
          }
        });

      Tween.get(cuvette)
        .wait(500)
        .to({
          x: 400, y: 250, rotation: -15
        }, 500);


      //this.liquid = liquid;
      this.cuvette = cuvette;
      this.tube = tube;
      this.flags = [];

      //store.originalVolume = tube.volume;
      //store.originalOpacity = tube.opacity;
    },

    onClick: function() {
      var tube = this.cuvette, store = this.store;

      tube.removeEventListener('click', this.onClick);
      tube.cursor = "auto";
      //var self = this;
      this.startDumping();

    },

    startDumping: function() {
      var tube = this.tube, liquid = this.liquid;

      this.flags[0] = true;

      Tween.get(tube)
        .to({
          /*x: 520, y: 150, */
          rotation: 80
        }, 500);


    },

    stopDumping: function() {
      this.flags[0] = false;

      var cuvette = this.cuvette, tube = this.tube;

      Tween.get(tube)
        .to({
          x: tube.location.x, y: 150, rotation: 0
        }, 500)
        .call(function() {
          tube.stop();
        })
        .to({
          y: tube.location.y
        }, 500)
        .call(this.stop.bind(this));
      //
      //
      Tween.get(cuvette)
        .to({
          /*x: 500, y: 350, */rotation: 0
        }, 500);

    },

    stop: function() {


      base.stop.call(this);
    },

    update: function(event) {
    var store = this.store;
      var scene = this.scene;
      var tube =  scene[store.bottle], cuvette = this.cuvette ;

      tube.refresh();
      cuvette.refresh();

      if (this.flags[0]) {
        var delta = event.delta*0.001;

        var volume = cuvette.volume;

        if (volume >= store.targetVolume) {
          this.stopDumping();
          cuvette.save({volume: store.targetVolume});
        } else {
          cuvette.save({volume: volume + delta});
         // tube.save({volume: tube.volume - delta});
        }

      }
    }

  });

  ENJ.Step_DumpToCuvette = Step_DumpToCuvette;

})();
