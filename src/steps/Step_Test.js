/**
 * Created by asus-rain on 2016/8/4 0004.
 */
ENJ.Step_Test = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    constructor: function Step_Test(paras) {
      Step.apply(this, arguments);
    },
    extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, arrow = scene.arrow;

      arrow.addEventListener('click', function() {
        if (arrow.active) {
          arrow.stop();
        } else {
          arrow.start();
        }
      });
    },
    stop: function() {
      base.stop.call(this);
    }
  })
})();