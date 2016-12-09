/**
 * Created by asus-rain on 2016/8/4 0004.
 */
ENJ.Step_BlowPool=(function(){
      var Step = ENJ.Step,
        Tween = CRE.Tween;
   var base = Step.prototype;
  return ENJ.defineClass({

    constructor: function Step_BlowPool(paras) {
      Step.apply(this, arguments);
    },
    extend: Step,
    start: function(){
      base.start.call(this);
      var store = this.store, scene = this.scene,pool = scene.pool,handlers = this.handlers = [], self = this,
        hand, pipet, point, suckBall;
      hand = this.hand = scene.hand;
      pipet = this.pipet = store.pipet ?  scene[store.pipet] : scene.pipet;

      suckBall = this.suckBall = scene.suckBall;
      pipet.cursor = 'pointer';
      suckBall.cursor = 'pointer';

      handlers[0] = this.onClickPipet.bind(this);
     // handlers[1] = this.onClickHand.bind(this);
     // handlers[2] = this.onClickSuckBall.bind(this);

      this.flags = [];


      [/*suckBall, */pipet]
        .forEach(function(element) {
          //scene.setToTop(element, 7);
          element.cursor = 'pointer';
        });
      hand.visible = false;

      hand.set({visible:true, y:pipet.y - 20, x: pipet.x - 10});
      pipet.addEventListener('click', handlers[0]);
     // hand.addEventListener('mousedown', handlers[1]);
     // hand.addEventListener('pressup', handlers[1]);
     // suckBall.addEventListener('mousedown', handlers[2]);
      //suckBall.addEventListener('pressup', handlers[2]);



    },
    stop: function () {

      var hand = this.hand,handlers = this.handlers;    var pipet = this.pipet;
      pipet.removeEventListener('click', handlers[0]);
      hand.visible = false;
      console.log("111111");
      base.stop.call(this);

    },
    onClickPipet:function(){
      var pipet = this.pipet;
      var hand = this.hand;
      var remain= this.store.remain;
      var self=this;


      if(pipet.active){
       // pipet.stop();
        Tween.get(pipet).to({
          x:860,y:300
        },500);
        Tween.get(hand).to({
          x:860,y:280
        },500).wait(500)
          .call(function(){
          hand.gotoAndStop('up');
           // hand.visible = false;

        }).wait(500).call(function(){
            if(remain>1){
              self.stop();
            }
          });



      }

    },
    update:function(){
      var remain= this.store.remain;

    }
  })
})();