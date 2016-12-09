//##############################################################################
// src/steps/Step_ResetSpectrophotometer.js
//##############################################################################
(function() {
  var Step = ENJ.Step;
  var Tween = CreateJS.Tween;

  var base = Step.prototype;

  function Step_ResetSpectrophotometer() {
    Step.apply(this, arguments);
  }

  ENJ.defineClass({

    constructor: Step_ResetSpectrophotometer, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene;
      var cuvettes = scene.cuvettes;
      var spectrophotometer = this.spectrophotometer = scene.spectrophotometer;//, liquid = scene.liquid;
      var store = this.store;
      spectrophotometer.addEventListener('click', this.stop.bind(this));
      spectrophotometer.cursor = 'pointer';
      spectrophotometer.stop();
      if(store.firthree){
        for (var i = 1; i < 4; ++i) {
          var cuvette = cuvettes[4-i];
          cuvette.visible = true;
          Tween.get(cuvette)
              .wait(200*i)
              .to({
                x: 650, y: 200
              }, 500)
              .to({
                x: 1000
              }, 500);
        }

      }else {
        for (var i = 1; i < 4; ++i) {
          var cuvette = cuvettes[7-i];
          cuvette.visible = true;
          Tween.get(cuvette)
              .wait(200*i)
              .to({
                x: 650, y: 200
              }, 500)
              .to({
                x: 1000
              }, 500);
          cuvettes[0].visible = true;
          Tween.get(cuvettes[0])
              .wait(200*4)
              .to({
                x: 650, y: 200
              }, 500)
              .to({
                x: 1000
              }, 500);
        }

      }

    },

    stop: function() {
      var spectrophotometer = this.spectrophotometer;
      spectrophotometer.removeAllEventListeners();
      spectrophotometer.save({grade: 0});
      spectrophotometer.cursor = 'auto';
      base.stop.call(this);
    }

  });

  ENJ.Step_ResetSpectrophotometer = Step_ResetSpectrophotometer;

})();
