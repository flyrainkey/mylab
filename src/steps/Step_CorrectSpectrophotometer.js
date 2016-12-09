//##############################################################################
// src/steps/Step_CorrectSpectrophotometer.js
//##############################################################################
(function() {
  var Step = ENJ.Step;
  var Tween = CreateJS.Tween;

  var base = Step.prototype;

  function Step_CorrectSpectrophotometer() {
    Step.apply(this, arguments);
  }

  ENJ.defineClass({

    constructor: Step_CorrectSpectrophotometer, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene;
      var cuvettes = scene.cuvettes;
      var spectrophotometer = this.spectrophotometer = scene.spectrophotometer;//, liquid = scene.liquid;

      spectrophotometer.addEventListener('click', this.stop.bind(this));
      spectrophotometer.cursor = 'pointer';
      spectrophotometer.start();

      for (var i = 0; i < 4; ++i) {
        var cuvette = cuvettes[i];
        if (cuvette) {
          cuvette.visible = false;
        }
      }
    },

    stop: function() {
      var spectrophotometer = this.spectrophotometer;
      spectrophotometer.removeAllEventListeners();
      //spectrophotometer.save({grade: 0});
      spectrophotometer.correct();
      spectrophotometer.cursor = 'auto';
      base.stop.call(this);
    }

  });

  ENJ.Step_CorrectSpectrophotometer = Step_CorrectSpectrophotometer;

})();
