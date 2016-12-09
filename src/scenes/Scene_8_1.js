/**
 * Created by rainkey on 2016/11/19.
 */
ENJ.Scene_8_1 =(function(){
    var ColorFilter = CreateJS.ColorFilter;
    var Container = CreateJS.Container;
    var Bitmap = CreateJS.Bitmap;
    var Point = CreateJS.Point;
    var Tween = CreateJS.Tween;
    var Scene = ENJ.Scene;
   function Scene_8_1(){

        scene.call(this);
    }
    return ENJ.defineClass({
        constructor: Scene_8_1,
        extend: Scene,

        start: function() {
            this.active = true;
        },

        stop: function() {
            this.active = false;
        },
        ready:function(){
            var self=this,bg;
            bg = new Bitmap(RES.getRes("±³¾°"));
            bg.set({regX: 600, regY: 320, scaleX: 1.2});
            self.addChild(
                bg
            );
        }
    });
ENJ.Scene_8_1=Scene_8_1;
})();