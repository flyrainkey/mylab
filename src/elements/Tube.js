/**
 * Created by asus-rain on 2016/8/9 0009.
 */
ENJ.Tube=(function(){

  var LiquidContainer = ENJ.LiquidContainer,
      Tween = CRE.Tween,
      Shape = CRE.Shape,
      Bitmap = CRE.Bitmap,
      Graphics = CRE.Graphics;

   var base = LiquidContainer.prototype;

   return ENJ.defineClass({
     constructor :function Tube(store){
       LiquidContainer.call(this,store);
     },extend:LiquidContainer,

     ready:function(){
         var self = this, graphics, shape,level, label, liquid, tube, cap;

       graphics = new Graphics();
       graphics.beginFill('#0f0').drawRect(-200, 0, 400, 400);

       shape = new Shape(graphics);
       shape.x = 63;
       tube = new Bitmap(RES.getRes("试管瓶"));
       cap = new Bitmap(RES.getRes("试管盖"));
       cap.set({ x: 2, y: 5});

         liquid = LiquidContainer.createLiquid("试管液体", self.store('color'), shape);
         level = new Shape(graphics);
         level.set({
             x: shape.x - 4,
             scaleY: 0.2,
             alpha: 0.2
         });

         label = new ENJ.NumLabel({ unit: 'ml' });
         label.visible = false;
         label.x = 10;
        self.addChild(tube, cap,liquid, level);
         self.cap = cap;

      // self.shape = shape;
         self.set({
             liquid: liquid,
             level: level,
             shape: shape,
             label: label,
             ratio: this.store('ratio') || 1
         });

         self.storeChanged('volume');

     },
       storeChanged: function(key) {
           var self = this, value = self.store(key),
               label = self.label, shape = self.shape;
           switch (key) {
               case 'volume':
                   if (value <= 0) {
                       self.level.visible = false;
                       self.level.y = shape.y = 500;
                   } else {
                       if(!this.fixing){
                           self.level.visible = false;
                       }
                       //console.log(value);
                       self.level.y = shape.y = 120 - value * 150/30 - 0;
                      // console.log(shape.y );


                       //self.level.y = shape.y = value;
                   }

                  label.store('num', value);
                  // label.store('num', value * this.ratio);
                   label.y = shape.y - 10;
                   break;
               case 'color':
                   self.liquid = LiquidContainer.createLiquid("试管液体", value, shape);
                   self.removeChildAt(0);
                   self.addChildAt(self.liquid, 0);
                   break;
           }
       },
    /* storeChanged: function(key) {
       var value = this.store(key);//, label = this.label, shape = this.shape;
       switch (key) {
         case 'volume':
           this.shape.y = 260 - value * 260 / 250;
           //label.store('num', value);
           //label.y = shape.y - 10;
           break;
       }
     },*/

     start:function(){
       base.start.call(this);
       Tween.get(this.cap).to({

         x: 0, y: -50, rotation: -30, alpha: 0
       }, 300);


     },
     stop:function(){
       base.stop.call(this);
       Tween.get(this.cap).to({
         x: 2, y: 5, rotation: 0, alpha: 1.0
       }, 300);

     },
     refresh:function(){


       }








   });


})();