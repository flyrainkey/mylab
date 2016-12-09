/**
 * Created by rainkey on 2016/8/30.
 */
//##############################################################################
// src/steps/Step_Interlude_1.js
//##############################################################################
ENJ.Step_Interlude_8 = (function() {
    var Step = ENJ.Step,
        Tween = CRE.Tween;

    var base = Step.prototype;

    return ENJ.defineClass({
        /**
         * 过场
         * 所用：
         *
         * @constructor
         */
        constructor: function Step_Interlude_8() {
            Step.apply(this, arguments);
        }, extend: Step,

        start: function() {
            base.start.call(this);
            var self = this, scene = this.scene, store = this.store,waterBottle = scene.waterBottle,reagenBottle = scene.reagenBottle,
                formaldehyde = scene.formaldehyde, volumetricFlask= scene.volumetricFlask,  pipet = scene.pipet, pipet2 = scene.pipet2,
                bigPipet = scene.bigPipet,suckBall = scene.suckBall,pool = scene.pool,beakernew = scene.beakernew,
                papers = scene.papers, pipetStand= scene.pipetStand,spectrophotometer = scene.spectrophotometer,
                cuvettes0 = scene.cuvettes[0],cuvettes1 = scene.cuvettes1,cuvettes2 = scene.cuvettes2,cuvettes3 = scene.cuvettes3,
                cuvettes4 = scene.cuvettes4,cuvettes5 = scene.cuvettes5,cuvettes6 = scene.cuvettes6,board = scene.board;

            board.store('title', store.title);
            board.visible = true;

            waterBottle.visible=false;
            reagenBottle.visible=false;
            formaldehyde.visible = false;
            volumetricFlask.visible = false;
            pipet.visible = false;
            pipet2.visible = false;
            bigPipet.visible = false;
            suckBall.visible = false;
            pipetStand.visible = false;
            spectrophotometer.visible = true;
            beakernew.visible = true;
            papers.visible = true;
            cuvettes0.visible = true;
            cuvettes1.visible = true;
            cuvettes2.visible =true;
            cuvettes3.visible = true;
            cuvettes4.visible = true;
            cuvettes5.visible = true;
            cuvettes6.visible = true;
            pool.visible = false;

            Tween.get(board)
                .to({ alpha: 1.0 }, 500)
                .wait(1000)
                .to({ alpha: 0.0 }, 500)
                .call(function() {
                    board.visible = false;
                    self.stop();
                });
        },

        stop: function() {
            base.stop.call(this);
        }
    })

})();
