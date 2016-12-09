//##############################################################################
// src/steps/Step_InstallCuvette.js
//##############################################################################
(function() {
  var Step = ENJ.Step;
  var Tween = CreateJS.Tween;

  var base = Step.prototype;

  function Step_InstallCuvette() {
    Step.apply(this, arguments);
  }

  ENJ.defineClass({

    constructor: Step_InstallCuvette, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store, self = this;

      var cuvette = scene.cuvettes[store.no];//, liquid = scene.liquid;


      Tween.get(cuvette)
        //.wait(500)
        .to({
          x: 760, y: 200, rotation: 0
        }, 500)
       .to({
            x: 760 + store.ox, y: 400- store.oy, rotation: 0
         // x: 665 + store.ox, y: 325 - store.oy, rotation: 0
        }, 500)
        .call(function() {
          self.stop();
        });
    }

  });

  ENJ.Step_InstallCuvette = Step_InstallCuvette;

})();
