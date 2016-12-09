/**
 * Created by rainkey on 2016/11/30.
 */
//##############################################################################
// src/elements/ResultTable_8.js
//##############################################################################
ENJ.ResultTable_8 = (function() {
    var Element = ENJ.Element,
        Bitmap = CRE.Bitmap,
        Text = CRE.Text;

    return ENJ.defineClass({
        /**
         *
         * @class ResultTable_3
         * @extends Element
         *
         * @constructor
         */
        constructor: function ResultTable_8(store) {
            Element.call(this, store);
        }, extend: Element,
        /**
         * @override
         */
        ready: function() {
            var self = this, bgg, btn, label, i, names = ['a_1', 'y_1', 'a_2', 'y_2', 'a_3', 'y_3', 'a_4', 'y_4', 'a_5','y_5','a_6','y_6'];

            try{
                bgg = new Bitmap(RES.getRes("结果报告8"));
                console.log("bgg");
            }catch(e){
                console.log("mistake");
            }


            btn = new Bitmap(RES.getRes("关闭按钮"));
            btn.set({ regX: 24, regY: 24, cursor: 'pointer' });
            btn.set({ x: 700, y: 20 });
           //bgg.set({ x: 200, y: 180 });
            self.btn = btn;

            self.addChild(bgg, btn);

            for (i = 0; i < names.length; ++i) {
                label = new Text('');
                label.set({
                    color: "#000", font: "bold 18px Arial", textAlign: 'center'
                });
                self[names[i]] = label;
                self.addChild(label);
            }

            self.a_6.set({ x: 645 , y: 125  });
            self.y_6.set({ x: 645 , y: 155  });
            self.a_3.set({ x: 400 , y: 125  });
            self.y_3.set({ x: 400 , y: 155  });

            self.a_4.set({ x: 480 , y: 125  });
            self.y_4.set({ x: 480 , y: 155  });
            self.a_5.set({ x: 570 , y: 125  });
            self.y_5.set({ x: 570 , y: 155  });
            self.a_2.set({ x: 320 , y: 125  });
            self.y_2.set({ x: 320 , y: 155  });
            self.a_1.set({ x: 250 , y: 125  });
            self.y_1.set({ x: 250 , y: 155  });

            //self.xx.set({ x: 435 , y: 185 });

            //self.storeChanged('title');
            btn.addEventListener('mousedown', function() {
                btn.set({ scaleX: 0.8, scaleY: 0.8 });
            });
            btn.addEventListener('pressup', function() {
                btn.set({ scaleX: 1.0, scaleY: 1.0 });
                self.dispatchEvent('close');
            });
            btn.cursor = 'pointer';
        },
        /**
         * @override
         */
        storeChanged: function(key) {
            var self = this, value = self.store(key);

            if (self[key] ) {
                self[key].text = '' + value;
            }
        }

    });
})();
