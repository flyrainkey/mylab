//##############################################################################
// src/steps/Step_MeasureLuminosity.js
//##############################################################################
(function() {
  var Step = ENJ.Step;
  var Tween = CreateJS.Tween;

  var base = Step.prototype;

  function Step_MeasureLuminosity() {
    Step.apply(this, arguments);
  }

  ENJ.defineClass({

    constructor: Step_MeasureLuminosity, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene;

      var spectrophotometer = this.spectrophotometer = scene.spectrophotometer;//, liquid = scene.liquid;

      spectrophotometer.addEventListener('click', this.onClick.bind(this));
      spectrophotometer.cursor = 'pointer';

      spectrophotometer.start();
    },

    stop: function() {
      var spectrophotometer = this.spectrophotometer;

      spectrophotometer.removeAllEventListeners();
      spectrophotometer.cursor = 'auto';
      base.stop.call(this);
    },

    onClick: function() {
      var store = this.store, spectrophotometer = this.spectrophotometer;
      var grade = spectrophotometer.grade;
      spectrophotometer.save({
        grade: grade+1,
        luminosity: store.luminosities[grade]
      });
      if (grade+1 >= store.luminosities.length) {
        this.stop();
      }
    }

  });

  ENJ.Step_MeasureLuminosity = Step_MeasureLuminosity;

})();
