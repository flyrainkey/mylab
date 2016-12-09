/**
 * Created by asus-rain on 2016/8/3 0003.
 */
ENJ.Arrow = (function() {

  var Shape = CRE.Shape,
    Bitmap = CRE.Bitmap,
    Element = ENJ.Element,
    Tween = CRE.Tween,
    Graphics = CRE.Graphics;

  var base = Element.prototype;

  return ENJ.defineClass({
    /**
     *
     * @class Beaker
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: function Arrow(store) {
      Element.call(this, store);
    },

    extend: Element,

    ready:function(){

      var arrow = new Bitmap(RES.getRes("箭头"));
      this.addChild(arrow);

      this.arrow = arrow;
    },
    start:function(){
      base.start.call(this);

      this.arrow.alpha = 1;
      Tween.get(this.arrow).to({
        x:0,y:60},500)
        .to({x:0,y:-60},500);

    },

      stop:function(){
        base.stop.call(this);
        Tween.get(this.arrow).to({
          alpha: 0.1
        }, 250);

      }


  });



})();