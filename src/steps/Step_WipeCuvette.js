//##############################################################################
// src/steps/Step_WipeCuvette.js
//##############################################################################
(function() {
  var Step = ENJ.Step;
  var Tween = CreateJS.Tween;

  var base = Step.prototype;

  function Step_WipeCuvette() {
    Step.apply(this, arguments);
  }

  ENJ.defineClass({

    constructor: Step_WipeCuvette, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store, self = this;

      var cuvette = scene.cuvettes[store.no], paper = scene.paper;//, liquid = scene.liquid;


      var index = scene.getChildIndex(paper);

      paper.visible = true;
      Tween.get(paper)
        .to({
          x: 410, y: 200,
          scaleX: 0.25, scaleY: 0.5
        }, 1000)
        .to({
          y: 270
        }, 500)
        .to({
          y: 200
        }, 500)
        .to({
          y: 270
        }, 500)
        .call(function() {
          //paper.x = 380;
          scene.setChildIndex(paper, 1);
        })
        .to({
          x: 380, y: 270
        }, 500)
        .to({
          y: 200
        }, 500)
        .to({
          y: 270
        }, 500)
        .call(function() {
          paper.set({
            visible: false,
            scaleX: 1.0, scaleY: 1.0,
            x: paper.location.x, y: paper.location.y
          });
          scene.setChildIndex(paper, index);

          self.stop();
        });

    }


  });

  ENJ.Step_WipeCuvette = Step_WipeCuvette;

})();

