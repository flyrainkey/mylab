//##############################################################################
// src/entry.js
//##############################################################################

'use strict';

/**
 * @copyright Copyright 2016 Enjolras. All rights reserved.
 * @namespace
 */
var ENJ = {
  scaleX: 951/960, scaleY: 506/640
};

var CRE = createjs;

//ENJ.invalid = false;

var RES = new CRE.LoadQueue();
RES.getRes = RES.getResult;

ENJ.assign = function(target/*,..sources*/) {
  if (typeof target !== "object" && typeof target !== "function") {
    throw new TypeError("target must be object or function");
  }

  var source, prop, i, len = arguments.length;

  for (i = 1; i < len; i++) {
    source = arguments[i];
    for (prop in source) {
      if (source.hasOwnProperty(prop )) {
        Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
      }
    }
  }

  return target;
};


ENJ.defineClass = function (protoProps, staticProps) {
  var subClass, superClass;

  if ('extend' in protoProps) {
    superClass = protoProps.extend;
    if (typeof superClass !== 'function') {
      throw new TypeError("superClass must be a function");
    }
  } else {
    superClass = Object;
  }

  if ('constructor' in protoProps) {
    subClass = protoProps.constructor;
    if (typeof subClass !== 'function') {
      throw new TypeError("subClass must be a function");
    }
  } else {
    subClass = function() {
      superClass.apply(this, arguments);
    }
  }

  subClass.prototype = Object.create(superClass.prototype);

  if (protoProps) { ENJ.assign(subClass.prototype, protoProps); }
  if (staticProps) { ENJ.assign(subClass, superClass, staticProps); }

  Object.defineProperty(subClass.prototype, 'constructor', {
    value: subClass, enumerable: false, writable: true, configurable: true
  });

  return subClass;
};
//##############################################################################
// src/elements/Element.js
//##############################################################################
ENJ.Element = (function() {
  var Container = CRE.Container,
    Point = CRE.Point;

  return ENJ.defineClass({
    /**
     * Container with some easy APIs.
     *
     * @class Element
     * @extends Container
     *
     * @constructor
     * @param {Object} store
     */

    constructor: function Element(store) {
      Container.apply(this, arguments);

      this.register();

      if (typeof store === 'object') {
        this._store = store ;
      }

      this.ready();//this.addEventListener('added', this.ready.bind(this));//
    }, extend: Container,
    /**
     * @property active
     * @type {Boolean}
     */
    get active() {
      return this._active;
    },
    /**
     * Register somethings.
     * @method register
     */
    register: function() {
      this._store = {};
      this._active = false;
      this.index = -1;
      this.location = null;
    },
    /**
     * @method ready
     * @abstract
     */
    ready: function() {},
    /**
     * @method refresh
     * @abstract
     */
    refresh: function() {},
    /**
     * @method release
     */
    release: function() {
      this.removeAllEventListeners();
    },
    /**
     * Start interacting.
     *
     * @method start
     */
    start: function() {
      this._active = true;
    },
    /**
     * Stop interacting.
     *
     * @method stop
     */
    stop: function() {
      this._active = false;
    },
    /**
     * Locate this element in scene.
     *
     * @method locate
     * @param {Scene} scene
     * @param {Point} location
     * @param {undefined|Number} index
     */
    locate: function(scene, location, index) {
      var self = this;
      //scene.addChild(this);
      if (location) {
        //this.x = location.x;
        //this.y = location.y;
        self.set(location);
        self.location = location;
      } else {
        self.location = new Point(self.x, self.y);
      }

      if (index === undefined) {
        self.index = scene.getChildIndex(self);
      } else {
        self.index = index;
        if (index !== scene.getChildIndex(self)){
          scene.setChildIndex(self, index);
        }
      }
    },
    /**
     * Get or store key/value.
     * If key is string and value is undefined, get the value by key.
     * Else store value by key.
     *
     * @method store
     * @param {String|Object} key
     * @param {*|undefined} value
     * @returns {*|self}
     */
    store: function(key, value) {
      var props, self = this;

      if (typeof key === 'object') {
        props = key;
        for(key in props) {
          if (props.hasOwnProperty(key)) {
            self.store(key, props[key]);
          }
        }
      }

      if (typeof key !== 'string'){
        return self;
      }

      if (value !== undefined && value !== self._store[key]) {
        self._store[key] = value;
        self.storeChanged(key);
        return self;
      }

      return self._store[key];
    },
    /**
     * @method storeChanged
     * *param {String} key
     * @abstract
     */
    storeChanged: function(key) {}
  });
})();
//##############################################################################
// src/elements/NumNumLabel.js
//##############################################################################
ENJ.NumLabel = (function() {
  var Element = ENJ.Element,
    Bitmap = CRE.Bitmap,
    Text = CRE.Text;

  return ENJ.defineClass({
      /**
       * Label showing number.
       *
       * @class NumLabel
       * @extends Element
       *
       * @constructor
       */
      constructor: function NumLabel(store) {
        Element.call(this, store);
      }, extend: Element,
      /**
       * @override
       */
      register: function() {
        Element.prototype.register.call(this);
        this.field = null;
      },

      /**
       * @override
       */
      ready: function() {
        var field, label;

        label = new Bitmap(RES.getRes('标签'));

        field = new Text();
        field.set({
          color: '#fff',
          font: '16px Arial',
          x: 15, y: 5
        });
        //field.color = '#fff';
        //field.font = '12px Arial';

        this.addChild(label, field);

        this.field = field;
      },

      /**
       * @override
       */
      storeChanged: function(key) {
        var self = this, value = self.store(key), a, b;
        switch (key) {
          case 'num':
            a = Math.floor(value);
            b = Math.floor((value - a) * 10);
            self.field.text = '' + a + '.' + b + self.store('unit');
            break;
        }
      }
    }
  );
})();

//##############################################################################
// src/elements/Board.js
//##############################################################################
ENJ.Board = (function() {
  var Element = ENJ.Element,
    Shape = CRE.Shape,
    Text = CRE.Text,
    Graphics = CRE.Graphics;

  return ENJ.defineClass({
    /**
     *
     * @class Board
     * @extends Element
     *
     * @constructor
     */
    constructor: function Board(store) {
      Element.call(this, store);
    }, extend: Element,
    /**
     * @override
     */
    ready: function() {
      var self = this, graphics, rect, label;

      graphics = new Graphics();
      graphics.beginFill('#000')
        .drawRect(-80, 0, 1250, 640);

      rect = new Shape(graphics);

      label = new Text();
      label.set({
        x: 510 , y: 300, color: "#fff", font: "bold 36px Arial", textAlign: 'center'
      });
      //label.setBounds(0, 0, 200, 40);
      //label.set({x: 480 - 100, y: 320 -20 });


      self.addChild(rect, label);


      self.set({
        label: label,
        rect: rect
      });

      //self.storeChanged('title');

    },
    /**
     * @override
     */
    storeChanged: function(key) {
      var self = this, value = self.store(key), label = self.label;
      switch (key) {
        case 'title':
          label.text = value;
//          var bounds = label.getBounds();
//          console.log(bounds);
//          label.set({x: 480 , y: 320 });
          break;
      }
    }

  });
})();

//##############################################################################
// src/elements/Curve.js
//##############################################################################
ENJ.Curve = (function() {
  var Shape = CRE.Shape,
    Graphics = CRE.Graphics;
  return ENJ.defineClass({
    constructor: function(graphics) {
      Shape.call(this, graphics || new Graphics());
    },

    extend: Shape,

    update: function(p0, p6) {
      var p = [], dist;

      p[0] = p0;
      p[6] = p6;

      //angle = 90;// - Math.atan2((p[4].x-p[0].x), (p[4].y-p[0].y)) * 180 / Math.PI;
      dist = Math.sqrt(
          (p[6].x-p[0].x) * (p[6].x-p[0].x) + (p[6].y-p[0].y) * (p[6].y-p[0].y)
      );

      p[1] = new CRE.Point(2/12 * dist, -100);
      p[2] = new CRE.Point(4/12 * dist, 0);
      p[3] = new CRE.Point(6/12 * dist, 100);
      p[4] = new CRE.Point(8/12 * dist, 50);
      p[5] = new CRE.Point(10/12 * dist, 0);
      p[6].x = p[6].x - p[0].x;
      p[6].y = p[6].y - p[0].y;

      this.graphics
        .clear()
        .setStrokeStyle(4,1,1)
        .beginStroke('#000')
        .moveTo(0,0)
        .quadraticCurveTo(p[1].x,p[1].y,p[2].x,p[2].y)
        .quadraticCurveTo(p[3].x,p[3].y,p[4].x,p[4].y)
        .quadraticCurveTo(p[5].x,p[5].y,p[6].x,p[6].y)
        .endStroke();

      this.x = p[0].x + 9;
      this.y = p[0].y + 5;
    }
  });
})();
//##############################################################################
// src/elements/LiquidContainer.js
//##############################################################################
ENJ.LiquidContainer = (function() {
  var Element = ENJ.Element,
    Bitmap = CRE.Bitmap,
    Tween = CRE.Tween;

  return ENJ.defineClass({
    /**
     * Container that contains liquid. You may change its volume.
     *
     * @class
     * @extends ENJ.Element
     *
     * @constructor
     * @param {Object} store
     */
    constructor: function LiquidContainer(store) {
      Element.apply(this, arguments);
    }, extend: Element,
    /**
     * @override
     */
    register: function () {
      Element.prototype.register.call(this);
      this.shape = null;
      this.label = null;
      //this._data = null;
    },

    /**
     * @override
     */
    refresh: function () {
      //base.refresh.call(this);
      //this.rotation += 0.1;
      this.shape.rotation = -this.rotation;
    },

    /**
     * @method showLabel
     */
    showLabel: function () {
      var label = this.label;
      if (label) {
        label.alpha = 1.0;
        label.visible = true;
      }
    },

    /**
     * @method hideLabel
     */
    hideLabel: function () {
      var label = this.label;
      if (label) {
        Tween.get(label)
          .to({alpha: 0.0},2500)
          .call(function() {
            label.visible = false;
          });

      }
    }
  }, {
    /**
     * Create liquid bitmap.
     *
     * @method createLiquid
     * @param {String} resId - resource id
     * @param {Number} color - ARGB
     * @param {CRE.Shape} mask
     * @returns {CRE.Bitmap}
     * @static
     */
    createLiquid: function (resId, color, mask) {
      var liquid = new Bitmap(RES.getRes(resId));

      var a, r, g, b, bounds = liquid.getBounds().clone();

      a = ((color >> 24) & 0xff) / 255;
      r = (color >> 16) & 0xff;
      g = (color >> 8) & 0xff;
      b = color & 0xff;

      liquid.filters = [new CRE.ColorFilter(0, 0, 0, a, r, g, b, 0)];
      liquid.cache(0, 0, bounds.width, bounds.height);
      liquid.setBounds(0, 0, bounds.width, bounds.height);

      liquid.mask = mask;

      //mask.compositeOperation = 'destination-in';

      return liquid;
    }
  });
})();

//##############################################################################
// src/elements/SuckBall.js
//##############################################################################
ENJ.SuckBall = (function() {
  var Element = ENJ.Element,
    Bitmap = CRE.Bitmap,
    Tween = CRE.Tween;

  return ENJ.defineClass({
    /**
     *
     * @class SuckBall
     * @extends Element
     *
     * @constructor
     */
    constructor: function SuckBall() {
      Element.apply(this, arguments);
    }, extend: Element,
    /**
     * @override
     */
    ready: function() {
      var ball, mouth;

      ball = new Bitmap(RES.getRes("吸球"));
      ball.x = -22;

      mouth =  new Bitmap(RES.getRes("吸嘴"));
      mouth.x = -6;
      mouth.y = -48;

      this.addChild(mouth, ball);

      this.ball = ball;
      //this.mouth = mouth;
    },

    /**
     * @method scale
     */
    scale: function() {
      this.ball.scaleY = 0.5;
    },

    /**
     * @method suck
     */
    suck: function() {
      Tween.get(this.ball).to({ 'scaleY': 1.0 }, 500);
    }
  });
})();

//##############################################################################
// src/elements/Buret.js
//##############################################################################
ENJ.Buret = (function() {
  var LiquidContainer = ENJ.LiquidContainer,
    Shape = CRE.Shape,
    Bitmap = CRE.Bitmap,
    Graphics = CRE.Graphics;

  return ENJ.defineClass({
    /**
     *
     * @class Buret
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: function Buret(store) {
      LiquidContainer.call(this, store);
    }, extend: LiquidContainer,
    /**
     * @override
     */
    ready: function() {
      var self = this, graphics, shape, liquid, pipe;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-200, 0, 400, 640);

      shape = new Shape(graphics);
      shape.x = 20;

      liquid = LiquidContainer.createLiquid("滴定管液�?", self.store('color'), shape);

      pipe = new Bitmap(RES.getRes("滴定�?"));

      self.addChild(liquid/*, shape*/, pipe);


      self.total = 100;
      //this.label = label;
      self.shape = shape;

      //this.store('volume', 5);
      self.storeChanged('volume');
    },
    /**
     * @override
     */
    refresh: function() {
      var self = this;
      if (self.scaleX < 0) {
        self.shape.rotation = -2 * self.rotation + 90;
      } else {
        self.shape.rotation = -self.rotation;
      }
    },
    /**
     * @override
     */
    storeChanged: function(key) {
      var value = this.store(key);
      switch (key) {
        case 'volume':
          this.shape.set({
            y: 450 - value * 450 / 80 + 50
            //y: 300 - (value + 50) * 300 / 100 + 60
          });
          //label.num = 50 - value;
          //label.y = shape.y - 10;
          break;
      }
    }
  });
})();

//##############################################################################
// src/elements/BeakerNew.js
//##############################################################################
ENJ.Beaker = (function() {
  var LiquidContainer = ENJ.LiquidContainer,
    Shape = CRE.Shape,
    Bitmap = CRE.Bitmap,
    Graphics = CRE.Graphics;

  return ENJ.defineClass({
    /**
     *
     * @class Beaker
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: function Beaker(store) {
      LiquidContainer.call(this, store);
    }, extend: LiquidContainer,
    /**
     * @override
     */
    ready: function() {
      var self = this, graphics, shape, label, level, liquid, bottle;

      graphics = new Graphics();
      graphics.beginFill('#0f0')
        .drawRect(-200, 0, 400, 200)
        .drawEllipse(-38, -7.5, 76, 15);

      shape = new Shape(graphics);
      shape.x = 50;

      graphics = new Graphics();
      graphics.beginFill('#fff').drawCircle(0,0,38);

      level = new Shape(graphics);
      level.set({
        x: shape.x - 4,
        scaleY: 0.2,
        alpha: 0.2
      });

      label = new ENJ.NumLabel({ unit: 'ml' });
      label.x = 10;

      liquid = LiquidContainer.createLiquid("烧杯液体", self.store('color'), shape);

      bottle = new Bitmap(RES.getRes("烧杯"));

      self.addChild(liquid, level, bottle);

      self.set({
        liquid: liquid,
        label: label,
        level: level,
        shape: shape
      });
      //this.store('volume', 5);
      self.storeChanged('volume');
    },
    /**
     * @override
     */
    refresh: function() {
      var self = this, ratio = Math.sin(self.rotation / 180 * Math.PI);

      self.shape.rotation = -self.rotation;
      self.shape.x = 50 + 36 * ratio;
    },
    /**
     * @override
     */
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
              self.level.visible = true;
            }
            self.level.y = shape.y = 100 - value * 100 /100 - 0;
          }

          label.store('num', value);
          label.y = shape.y - 10;
          break;
        case 'color':
          self.liquid = LiquidContainer.createLiquid("烧杯液体", value, shape);
          self.removeChildAt(0);
          self.addChildAt(self.liquid, 0);
          break;
      }
    },
    /**
     * Have to fix.
     *
     * @method fix
     */
    fix: function() {
      var self = this;
      self.fixing = true;
      self.level.visible = false;
      self.shape.scaleX = 2;
      //this.shape.x = 100;
      self.regX = 100;
    },
    /**
     *
     * @method unfix
     */
    unfix: function() {
      var self = this;
      self.fixing = false;
      self.level.visible = true;
      self.shape.scaleX = 1;
      //this.shape.x = 50;
      self.regX = 0;
    }
  });
})();

//##############################################################################
// src/elements/Cylinder.js
//##############################################################################
ENJ.Cylinder = (function() {
  var LiquidContainer = ENJ.LiquidContainer,
    Shape = CRE.Shape,
    Bitmap = CRE.Bitmap,
    Graphics = CRE.Graphics;

  return ENJ.defineClass({
    /**
     *
     * @class Cylinder
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: function Cylinder(store) {
      LiquidContainer.call(this, store);
    }, extend: LiquidContainer,
    /**
     * @override
     */
    ready: function() {
      var self = this, graphics, shape, liquid, barrel;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-300, 0, 600, 400);

      shape = new Shape(graphics);
      shape.x = 35;

      liquid = LiquidContainer.createLiquid("量筒液体", self.store('color'), shape);
      barrel = new Bitmap(RES.getRes("量筒"));

      self.addChild(liquid, barrel);

      //this.label = label;
      self.shape = shape;

      //this.store('volume', 5);
      self.storeChanged('volume');
    },
    /**
     * @override
     */
    storeChanged: function(key) {
      var value = this.store(key);
      switch (key) {
        case 'volume':
          this.shape.y = 290 - value * 2.15 - 25;
          //label.num = value;
          //label.y = shape.y - 10;
          break;
      }
    }
  });
})();
//##############################################################################
// src/elements/WaterBottle.js
//##############################################################################
ENJ.WaterBottle = (function() {
  return ENJ.defineClass({
    constructor: function WaterBottle() {
      ENJ.Element.apply(this, arguments);
    }, extend: ENJ.Element,

    ready: function() {
      var bottle, flow;
     // var pth;
      var self=this;
    // bottle = new CRE.Bitmap(RES.getRes("蒸馏水瓶"));
        bottle = new CRE.Bitmap(RES.getRes(self.store('pth')));
      var data = {
        images: [RES.getRes("水流")],
        frames: { width: 200, height: 200 }
      };
      var sheet = new CRE.SpriteSheet(data);

      this.flow = flow = new CRE.Sprite(sheet);
      flow.set({y: 25, scaleX: -0.5, scaleY: 0.5, visible: false});
      flow.framerate = 30;
      //flow.gotoAndPlay(0);

      this.addChild(bottle, flow);
    },

    dump: function(flag, rotation) {
      var flow = this.flow;
      if (flag) {
        flow.visible = true;
        flow.rotation = rotation;
        flow.gotoAndPlay(0);
      } else {
        flow.visible = false;
        flow.rotation = 0;
        flow.gotoAndStop(0);
      }
    }
  })
})();

///##############################################################################
// src/elements/VolumetricFlask.js
//##############################################################################
ENJ.VolumetricFlask = (function() {
  var LiquidContainer = ENJ.LiquidContainer,
    Tween = CRE.Tween,
    Shape = CRE.Shape,
    Bitmap = CRE.Bitmap,

    Graphics = CRE.Graphics;
  
  var base = LiquidContainer.prototype;

  return ENJ.defineClass({
    /**
     *
     * @class VolumetricFlask
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: function VolumetricFlask(store) {
      LiquidContainer.call(this, store);
    }, extend: LiquidContainer,
    /**
     * @override
     */
    ready: function() {
      var self = this, graphics, shape, label, liquid, bottle,icon,cap;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-200, 0, 400, 400);

      shape = new Shape(graphics);
      shape.x = 63;
      //shape.y = 50;

      label = new ENJ.NumLabel({ unit: 'ml' });
      label.visible = false;
      label.x = 75;

      liquid = LiquidContainer.createLiquid("容量瓶液�?", self.store('color'), shape);

      bottle = new Bitmap(RES.getRes("容量�?"));

      cap = new Bitmap(RES.getRes("容量瓶盖"));
      cap.set({ x: 45, y: -40 });
      icon=new Bitmap(RES.getRes(self.store("icon")));
      icon.set({ x: 25, y: 190 });

      var container = new CRE.Container();
      container.addChild(bottle, icon);
      var bounds = bottle.getBounds();
      container.cache(0, 0, bounds.width, bounds.height);
      //console.log(bounds);
     // console.log( self.getBounds());
      self.addChild(liquid, container, cap, label);
     // self.addChild(liquid, container, cap, label,shape);

      self.set({
        cap: cap,
        label: label,
        shape: shape
      });
      //this.store('volume', 5);
      self.storeChanged('volume');
     // self.setBounds(0,0,90,169);
    },

    /**
     * @override
     */
    storeChanged: function(key) {
      var value = this.store(key), label = this.label, shape = this.shape;
      switch (key) {
        case 'volume':
          if (value < 80) {
            shape.y = 256 - value * value / 6400 * 100;
          } else {
            shape.y = 156 - (value - 80) * 60 / 20;
          }
          //shape.y = 260 - value * 260 / 250;

          label.store('num', value);
          label.y = shape.y - 10;
          break;
      }
    },

    /**
     * @override
     */
    start: function() {
      base.start.call(this);
      Tween.get(this.cap).to({
        x: 0, y: -60, rotation: -30, alpha: 0
      }, 250);
    },

    /**
     * @override
     */
    stop: function() {
      base.stop.call(this);
      Tween.get(this.cap).to({
        x: 45, y: -40, rotation: 0, alpha: 1.0
      }, 250);
    },

    /**
     * @override
     */
    refresh: function() {
      var volume = this.store('volume'), shape = this.shape;

      shape.rotation = -this.rotation;
      if (this.rotation > 90) {
        shape.y = 180;
      } else {
        this.storeChanged('volume');
        //shape.y = 156 - (volume - 80) * 60 / 20;
      }
    }
  });
})();

///##############################################################################
// src/elements/SoySauce.js
//###############################################################################
ENJ.SoySauce = (function() {
  var LiquidContainer = ENJ.LiquidContainer,
    Tween = CRE.Tween,
    Shape = CRE.Shape,
    Bitmap = CRE.Bitmap,
    Graphics = CRE.Graphics;

  return ENJ.defineClass({
    /**
     *
     * @class SoySauce
     * @extends LiquidContainer
     *
     * @constructor
     */
    constructor: function SoySauce(store) {
      LiquidContainer.call(this, store);
    }, extend: LiquidContainer,
    /**
     * @override
     */
    ready: function() {
      var self = this, graphics, shape, label, liquid, bottle, cap;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-200, 0, 400, 400);

      shape = new Shape(graphics);
      shape.x = 63;
      //shape.y = 50;

      //label = new ENJ.NumLabel({ unit: 'ml' });
      //label.x = 75;

      liquid = LiquidContainer.createLiquid("酱油", self.store('color'), shape);

      bottle = new Bitmap(RES.getRes("酱油�?"));

      cap = new Bitmap(RES.getRes("酱油瓶盖"));
      cap.set({ x: 26, y: -15 });


      self.addChild(liquid, bottle, cap);
      //this.addChild(label);

      self.cap = cap;
      //self.label = label;
      self.shape = shape;

      //this.store('volume', 5);
      self.storeChanged('volume');
    },

    /**
     * @override
     */
    storeChanged: function(key) {
      var value = this.store(key);//, label = this.label, shape = this.shape;
      switch (key) {
        case 'volume':
          this.shape.y = 260 - value * 260 / 250;
          //label.store('num', value);
          //label.y = shape.y - 10;
          break;
      }
    },

    /**
     * @override
     */
    start: function() {
      LiquidContainer.prototype.start.call(this);
      Tween.get(this.cap).to({
        x: 0, y: -50, rotation: -30, alpha: 0
      }, 300);
    },

    /**
     * @override
     */
    stop: function() {
      LiquidContainer.prototype.stop.call(this);
      Tween.get(this.cap).to({
        x: 26, y: -15, rotation: 0, alpha: 1.0
      }, 300);
    }
  });
})();

//##############################################################################
// src/elements/ReagenBottle.js
//##############################################################################
ENJ.ReagenBottle = (function() {
  var LiquidContainer = ENJ.LiquidContainer,
    Tween = CRE.Tween,
    Shape = CRE.Shape,
    Bitmap = CRE.Bitmap,
    Graphics = CRE.Graphics;

  var base = LiquidContainer.prototype;

  return ENJ.defineClass({
    /**
     *
     * @class ReagenBottle
     * @extends LiquidContainer
     *
     * @constructor
     * @param {Object} store
     */
    constructor: function ReagenBottle(store) {
      LiquidContainer.apply(this, arguments);
    }, extend: LiquidContainer,
    /**
     * @override
     */
    ready: function() {
      var self = this, label, shape, liquid, bottle, icon, cap, graphics;

      //label = new ENJ.NumLabel({ unit: 'ml' });
      //label.x = 90;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-100, 0, 300, 300);

      shape = new Shape(graphics);
      shape.x = 50;
      //shape.y = 50;
     // var pth;
      liquid = LiquidContainer.createLiquid("试剂瓶液�?", self.store('color'), shape);

      bottle = new Bitmap(RES.getRes(self.store('pt')));

      icon = new Bitmap(RES.getRes(self.store('icon')));
      icon.set({ x: 10, y: 80 });

      cap = new Bitmap(RES.getRes(self.store('cap')));
      cap.set({ x: 18, y: 8 });

      var container = new CRE.Container();
      var bounds = bottle.getBounds();
      container.addChild(bottle, icon);
      container.cache(0, 0, bounds.width, bounds.height);

      //
      self.addChild(liquid, cap, container/*, label*/);
      //this.addChild(icon);


      //self.label = label;
      self.shape = shape;
      self.cap = cap;
     // self.bottle=bottle;
      //this.liquid = liquid;

      //this.shape =
      //this.store('volume', 50);
      self.storeChanged('volume');

      self.setBounds(0,0,90,169)
    },

    /**
     * @override
     */
    storeChanged: function(key) {
      var value = this.store(key), label = this.label, shape = this.shape;
      switch (key) {
        case 'volume':
          shape.y = 120 - value * 120 / 500 + 49;

          //label.store('num', value);
          //label.y = shape.y - 10;
          break;
      }

    },

    start: function() {
      base.start.call(this);
      Tween.get(this.cap).to({
        x: 0, y: -60, rotation: -30, alpha: 0
      }, 250);//alpha透明�?
    },

    stop: function() {

      Tween.get(this.cap).to({
        x: 20, y: 2, rotation: 0, alpha: 1.0
      }, 250);
      base.stop.call(this);
    }
  });
})();


//##############################################################################
// src/elements/PHElectrode.js
//##############################################################################
ENJ.PHElectrode = (function() {
  var Element = ENJ.Element,
    Tween = CRE.Tween,
    Bitmap = CRE.Bitmap;

  return ENJ.defineClass({
    /**
     *
     * @class PHElectrode
     * @extends Element
     *
     * @constructor
     */
    constructor: function PHElectrode() {
      Element.apply(this, arguments);
    }, extend: Element,
    /**
     * @override
     */
    ready: function() {
      var electrode, cap;

      cap = new Bitmap(RES.getRes("PH电极�?"));
      cap.x = -2.5;
      cap.y = 150;
      electrode = new Bitmap(RES.getRes("PH电极"));

      this.addChild(electrode, cap);

      this.cap = cap;
    },

    /**
     * @override
     */
    start: function() {
      Element.prototype.start.call(this);
      Tween.get(this.cap).to({
        x:10, y: 250, rotation: -30, alpha: 0.0
      }, 250);
    },

    /**
     * @override
     */
    stop: function() {
      Element.prototype.stop.call(this);
      Tween.get(this.cap).to({
        x:0, y: 150, rotation: 0, alpha: 1.0
      }, 250);
    }
  });
})();

//##############################################################################
// src/elements/PHInstrument.js
//##############################################################################
ENJ.PHInstrument = (function() {
  var Element = ENJ.Element,
    Tween = CRE.Tween,
    Text = CRE.Text,
    Bitmap = CRE.Bitmap,
    Shape = CRE.Shape;

  return ENJ.defineClass({
    /**
     *
     * @class PHElectrode
     * @extends Element
     *
     * @constructor
     */
    constructor: function PHInstrument() {
      Element.apply(this, arguments);
    }, extend: Element,
    /**
     * @override
     */
    ready: function() {
      var instrument, plane, label, btn1, btn2;

      instrument = new Bitmap(RES.getRes ("PH�?"));

      plane = new Bitmap(RES.getRes ("PH仪面�?"));
      plane.set({
        x: 160, y: 160, visible: false,
        regX: 80, regY: 80
      });

      label = new Text();
      //label.setBounds(0,0,100,30);
      label.set({
        x: 100, y: 50, visible: false, color: "#fff", font: "bold 24px Arial"
      });



      btn1 = new Shape();
      btn1.graphics
        .beginFill('#000')
        .drawCircle(0,0,20);
      btn1.set({
        x: 210, y: 115, alpha: 0.01
      });

      btn2 = new Shape();
      btn2.graphics
        .beginFill('#000')
        .drawCircle(0,0,23);
      btn2.set({
        x: 163, y: 135, alpha: 0.01
      });


      this.addChild(instrument, plane, label, btn1, btn2);

      this.plane = plane;
      this.label = label;
      this.btn1 = btn1;
      this.btn2 = btn2;


      btn1.cursor = 'pointer';
      btn2.cursor = 'pointer';
      //this.addEventListener('click',this.start.bind(this));

      //this.store('number',100000000);

    },

    /**
     * @override
     */
    start: function() {
      Element.prototype.start.call(this);
      var self = this, plane = this.plane;

      plane.set({
        visible: true,
        scaleX: 0.6,
        scaleY: 0.1,
        alpha: 0.5
      });

      Tween.get(plane).to({
        scaleX: 1.0, scaleY: 1.0, x: 160, y: 80, alpha: 1.0
      }, 500).call(function() {
        self.label.visible = true;
      });
      //this.willCorrect();
    },

    /**
     * @override
     */
    stop: function() {
      var self = this;
      self.label.visible = false;
      Tween.get(self.plane).to({
        alpha: 0.0
      }, 500).call(function() {
        self.plane.visible= true;
      });
      Element.prototype.stop.call(self);
    },

    willCorrect: function() {
      if (!this.active) {return;}
      this.btn1.addEventListener('click', this.onCorrect.bind(this));
    },

    willRead: function() {
      if (!this.active) {return;}
      this.btn2.addEventListener('click', this.onRead.bind(this));

    },

    onCorrect: function () {
      this.btn1.removeAllEventListeners();
      this.dispatchEvent('correct');
//      console.log('correct')
    },

    onRead: function() {
      this.btn2.removeAllEventListeners();
      this.dispatchEvent('read');
    },

    /**
     * @override
     * @param key
     */
    storeChanged: function(key) {
      switch (key) {
        case 'number':
            this.label.text = ''+ this.store(key);
          break;
      }
    }
  });
})();
///##############################################################################
// src/elements/MagneticStirrer.js
//###############################################################################
ENJ.MagneticStirrer = (function() {
  var Element = ENJ.Element,
    Tween = CRE.Tween,
    Bitmap = CRE.Bitmap;

  return ENJ.defineClass({
    /**
     *
     * @class MagneticStirrer
     * @extends Element
     *
     * @constructor
     */
    constructor: function MagneticStirrer() {
      Element.apply(this, arguments);
    }, extend: Element,
    /**
     * @override
     */
    ready: function () {
      var stirrer, button;

      stirrer = new Bitmap(RES.getRes("磁力搅拌�?"));
      button = new Bitmap(RES.getRes("磁力搅拌器旋�?"));
      button.set({ x: 98.5, y: 109, regX: 12.5, regY: 13 });

      this.addChild(stirrer, button);

      this.button = button;
    },

    /**
     * @override
     */
    start: function () {
      Element.prototype.start.call(this);
      Tween.get(this.button).to({ rotation: 120 }, 250);

    },

    /**
     * @override
     */
    stop: function () {
      Tween.get(this.button).to({ rotation: 0 }, 250);
      Element.prototype.stop.call(this);
    }
  });
})();

///##############################################################################
// src/elements/TitrationStand.js
//###############################################################################
ENJ.TitrationStand = (function() {
  var Element = ENJ.Element,
    Bitmap = CRE.Bitmap,
    Sprite = CRE.Sprite;

  var base = Element.prototype;

  return ENJ.defineClass({
    /**
     *
     * @class TitrationStand
     * @extends Element
     *
     * @constructor
     */
    constructor: function TitrationStand() {
      Element.apply(this, arguments);
    }, extend: Element,
    /**
     * @override
     */
    ready: function() {
      var stand, clip, data;

      stand = new Bitmap(RES.getRes("滴定�?"));

      data = {
        images: [ RES.getRes("蝴蝶�?") ],
        frames: { width: 82, height: 111 }/*,
         animations: { open: 0, close: 1 }*/
      };

      clip = new Sprite(new CRE.SpriteSheet(data));
      clip.set({ x: 5, y: 20 });
      clip.gotoAndStop(0);

      this.addChild(clip, stand);


      this.clip = clip;
      this.regX = 131;
    },

    /**
     * @override
     */
    start: function() {
      base.start.call(this);
      this.clip.gotoAndStop(0);
    },

    /**
     * @override
     */
    stop: function() {
      this.clip.gotoAndStop(1);
      base.stop.call(this);
    }
  });
})();

//##############################################################################
// src/elements/Pipet.js
//##############################################################################
ENJ.Pipet = (function() {
  var LiquidContainer = ENJ.LiquidContainer,
    Shape = CRE.Shape,
    Bitmap = CRE.Bitmap,
    Graphics = CRE.Graphics;

  return ENJ.defineClass({
    /**
     *
     * @class Pipet
     * @extends LiquidContainer
     *
     * @constructor
     * @param {Object} store
     */
    constructor: function Pipet(store) {
      LiquidContainer.apply(this, arguments);
    }, extend: LiquidContainer,
    /**
     * @override
     */
    ready: function() {
      var self = this, graphics, shape, label, liquid, pipe;

      graphics = new Graphics();
      graphics.beginFill('#0f0').drawRect(-200, 0, 400, 240);

      shape = new Shape(graphics);
      shape.x = 8;

      label = new ENJ.NumLabel({ unit: 'ml' });
      label.visible = false;
      label.x = 10;

      liquid = LiquidContainer.createLiquid("移液管液�?", self.store('color'), shape);

      pipe = new Bitmap(RES.getRes("移液�?"));

      self.addChild(liquid, pipe, label);

      self.set({
        label: label,
        shape: shape,
        rotation: -90,
        ratio: this.store('ratio') || 1
      });

      //this.store('volume', 5);
      self.storeChanged('volume');
    },

    /**
     * @override
     */
    storeChanged: function(key) {
      var value = this.store(key), label = this.label, shape = this.shape;
      switch (key) {
        case 'volume':
          //this.shape.y = 240 - value * 240 / 8 + 16;
          shape.set({
            y: 240 - value * 240 / 8 + 60,
            scaleY: value / 8
          });

          label.store('num', value * this.ratio);
          label.y = shape.y - 10;
          break;
      }
    }
  });
})();


//##############################################################################
// src/elements/ResultTable_3.js
//##############################################################################
ENJ.ResultTable_3 = (function() {
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
    constructor: function ResultTable_3(store) {
      Element.call(this, store);
    }, extend: Element,
    /**
     * @override
     */
    ready: function() {
      var self = this, bg, btn, label, i, names = ['v0_1', 'v0_2', 'v1_1', 'v1_2', 'v2_1', 'v2_2', 'v1_m', 'v2_m', 'xx'];

      bg = new Bitmap(RES.getRes("结果报告3"));

      btn = new Bitmap(RES.getRes("关闭按钮"));
      btn.set({ regX: 24, regY: 24, cursor: 'pointer' });
      btn.set({ x: 700, y: 10 });

      self.btn = btn;

      self.addChild(bg, btn);

      for (i = 0; i < names.length; ++i) {
        label = new Text('');
        label.set({
          color: "#000", font: "bold 18px Arial", textAlign: 'center'
        });
        self[names[i]] = label;
        self.addChild(label);
      }

      self.v0_1.set({ x: 620 , y: 125  });
      self.v0_2.set({ x: 620 , y: 155  });
      self.v1_1.set({ x: 270 , y: 125  });
      self.v1_2.set({ x: 385 , y: 125  });
      self.v2_1.set({ x: 270 , y: 155  });
      self.v2_2.set({ x: 385 , y: 155  });
      self.v1_m.set({ x: 500 , y: 125  });
      self.v2_m.set({ x: 500 , y: 155  });

      self.xx.set({ x: 435 , y: 185 });

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
       tube = new Bitmap(RES.getRes("试管�?"));
       cap = new Bitmap(RES.getRes("试管�?"));
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
//##############################################################################
// src/scenes/Scene.js
//##############################################################################
ENJ.Scene = (function() {
  var Container = CRE.Container;

  return ENJ.defineClass({
    /**
     * Scene that contains elements.
     *
     * @class Scene
     * @extends Container
     *
     * @constructor
     */
    constructor: function Scene() {
      Container.apply(this, arguments);
      this.register();
      this.ready();//this.addEventListener('added', this.ready.bind(this));//
    }, extend: Container,
    /**
     * Register somethings.
     *
     * @abstract
     */
    register: function() {},

//    onadded = function() {
//        this.ready();
//        this._initialized = true;
//    };


    /**
     * @abstract
     */
    ready: function() {},

    /**
     * Place child at given location and index
     *
     * @param {DisplayObject} child
     * @param {Point} location
     * @param {Number} index
     */
    place: function(child, location,index) {
      if (location) {
        //this.x = location.x;
        //this.y = location.y;
        child.set(location);
        child.location = location;
      } else {
        child.location = new Point(child.x, child.y);
      }

      if (index === undefined) {
        child.index = this.getChildIndex(child);
      } else {
        child.index = index;
        if (index !== this.getChildIndex(child)) {
          this.setChildIndex(child, index);
        }
      }
    },

    /**
     * Set child to top.
     *
     * @param {DisplayObject} child
     * @param {number} top
     */
    setToTop: function(child, top) {
      top = top || 1;
      this.setChildIndex(child, this.numChildren - top);
    },

    getLocalMouse: function() {
      return this.globalToLocal(this.stage.mouseX, this.stage.mouseY);
    }
  });
})();

//##############################################################################
// src/scenes/Scene_3.js
//##############################################################################
ENJ.Scene_8 = (function() {
    var Scene = ENJ.Scene,
        Bitmap = CRE.Bitmap,
        Point = CRE.Point;

    return ENJ.defineClass({
        /**
         * @class Scene_3
         * @extends Scene
         * @constructor
         */
        constructor: function Scene_8() {
            Scene.apply(this, arguments);
        }, extend: Scene,
        /**
         * @override
         */

        ready: function() {
            var self = this, bg, paper, curve, data, sheet, drop, tip, board, table,
                rotor, hand, beaker, i,
                pipetStand, waterBottle, volumetricFlask, drainageBar, bigBeaker,
                beakers = [], volumetricFlasks = [], rotors = [],
                cylinder, stirrer, phInstrument, buret, titrationStand,
                phElectrode, reagenBottle, formaldehyde,
                suckBall, soySauce, pipet, pipet2, tubeholder,pool,bigPipet,tube,tube1,tube2,tube3,tube4,tube5,tube6,arrow;

            // @todo CSS background maybe better.
            bg = new Bitmap(RES.getRes("背景"));

            paper = new Bitmap(RES.getRes("纸巾"));
            paper.visible = false;

           // drainageBar = new Bitmap(RES.getRes("引流�?"));

            curve = new ENJ.Curve();//new CRE.Shape(new CRE.Graphics());

            drop = new Bitmap(RES.getRes("水滴"));
            drop.visible = false;

//      data = {
//        images: [RES.getRes("剪刀")],
//        frames: { width: 133, height: 73 },
//        animations: { close: 1, open: 0 }
//      };
//      sheet = new CRE.SpriteSheet(data);

            data = {
                images: [RES.getRes("�?")],
                frames: { width: 100, height: 129 },
                animations: { up: 0, down: 1 }
            };
            sheet = new CRE.SpriteSheet(data);

            hand = new CRE.Sprite(sheet);
            hand.gotoAndStop('up');
            hand.visible = false;


            data = {
                images: [RES.getRes("转子")],
                frames: { width: 40, height: 19 }
            };
            sheet = new CRE.SpriteSheet(data);
/*
            for (i = 0; i < 2; ++ i) {
                rotor = new CRE.Sprite(sheet);
                rotor.gotoAndStop(0);
                //rotor.set({ x: 600 + 20 * i, y: 470 + 10 * i });
                //this.place(rotor,{ x: 600 + 20 * i, y: 470 + 10 * i });
                rotors.push(rotor);
            }*/

            //beaker = new Bitmap(RES.getRes("烧杯"));
            //beaker.set({ x: 200, y: 500 });

            //stirrer = new ENJ.MagneticStirrer();

            waterBottle = new ENJ.WaterBottle({pth:"蒸馏水瓶"});
           // waterBottle = new ENJ.WaterBottle(RES.getRes("蒸馏水瓶"));
            //cap = new Bitmap(RES.getRes("盖子�?"));
           //volume: 100, color: 0x22ffffff,
        reagenBottle = new ENJ.ReagenBottle({volume: 400,color: 0x66330000, pt: "对氨基苯磺酸",cap:"对氨基苯磺酸瓶盖" } );
            formaldehyde = new ENJ.ReagenBottle({ volume: 400, color: 0x66330000, pt: "盐酸萘乙二胺", cap: "盐酸萘乙二胺�?" } );


            pipetStand = new Bitmap(RES.getRes("移液管架"));
            tubeholder = new Bitmap(RES.getRes("试管�?"));
            pool = new Bitmap(RES.getRes("水池"));



            titrationStand = new ENJ.TitrationStand();//滴定管架
            titrationStand.scaleX = -1;
            arrow= new ENJ.Arrow();
            //buret = new ENJ.Buret({ volume: 0, color: 0x22ffffff });
            //buret.scaleX = -1;


            suckBall = new ENJ.SuckBall();
            //soySauce = new ENJ.SoySauce({ volume: 180, color: 0xdd330000 });

            pipet = new ENJ.Pipet({ volume: 0, color: 0x990000ff });
            pipet2 = new ENJ.Pipet({ volume: 0, color: 0x66330000 });
            bigPipet = new ENJ.Pipet({ volume: 0, color: 0x66330000, ratio: 5 });

            pipet.rotation = -90;
            pipet2.rotation = -90;
            bigPipet.set({ rotation: -90, scaleY: 1.20});
            //drainageBar.rotation = -90;

            //phElectrode = new ENJ.PHElectrode();

            //phInstrument = new ENJ.PHInstrument();//new Bitmap(RES.getRes ("PH�?"));

            //cylinder = new ENJ.Cylinder({ volume: 0, color: 0x22ffffff });

            volumetricFlask = new ENJ.VolumetricFlask({ volume: 40, color: 0x990000ff,icon:"亚硝酸钠标准液标�?",cap:"容量瓶盖" });
            tube = new ENJ.Tube();
            tube1 = new ENJ.Tube({volume:0,color:0x990000ff});
            tube2 = new ENJ.Tube({volume:0,color:0x990000ff});
            tube3 = new ENJ.Tube({volume:0,color:0x990000ff});
            tube4 = new ENJ.Tube({volume:0,color:0x990000ff});
            tube5 = new ENJ.Tube({volume:0,color:0x990000ff});
            tube6= new ENJ.Tube({volume:0,color:0x990000ff});

            var colors = [0x22ffffff,0x66330000,0x22ffffff];
           /* for (i = 0; i < 3; ++ i) {
                volumetricFlask = new ENJ.VolumetricFlask({ volume: 100, color: colors[i] });
                //this.place(volumetricFlask, new Point(130 + 50 * i, 200 + i * 10));
                volumetricFlasks.push(volumetricFlask);
            }
*/
           /* for (i = 0; i < 4; ++ i) {
                beaker = new ENJ.Beaker({ volume: 0, color: 0x22ffffff });
                this.place(beaker, new Point(100 - 30 * i,450 + 20 * i));
                beakers.push(beaker);
            }*/

            //bigBeaker = new ENJ.Beaker({ volume: 10, color: 0x66330000 });
           // bigBeaker.set({ scaleX: 1.25, scaleY: 1.25 });

            table = new ENJ.ResultTable_3();
            table.set({regX: 360, regY: 200});
            table.set({x: 480, y: 320, visible: false});

            tip = new CRE.Text();
            tip.set({x: 50, y: 50, color: "#fff", font: "bold 18px Arial"});

            board = new ENJ.Board(/*{title:"校准PH�?"}*/);
            board.visible = false;


            self.addChild(
                bg,
                pipetStand,

                //cap,

                //stirrer,




               // cylinder,
                waterBottle, //如果水壶在pipet下面，则用pipet的时�? 会被水壶挡住�?部分
                pool,
                pipet,
                pipet2,
                bigPipet,



                suckBall,


                titrationStand,
                tubeholder,
                tube,
                tube1,
                tube2,tube3,tube4,tube5,tube6,

                drainageBar,

              /*  rotors[0],
                rotors[1],*/

                curve,

                //phInstrument,

                volumetricFlask,
                reagenBottle,// reagenBottle要放在容量瓶下面�?
                formaldehyde,
             // arrow,
            /*  volumetricFlasks[0],
               volumetricFlasks[1],
                volumetricFlasks[2],*/

                //powder,

               // soySauce,



               // phElectrode,

                //buret,

               /* beakers[0],
                beakers[1],
                beakers[2],
                beakers[3],*/

               // bigBeaker,


                paper,
                hand,
                drop,

                table,

                tip,
                board
            );

          /*  for (i = 0; i < 3; ++ i) {
                self.place(volumetricFlasks[i], new Point(130 + 50 * i, 200 + i * 10));
            }
            volumetricFlasks[1].visible = false;*/

            /*for (i = 0; i < 4; ++ i) {
                self.place(beakers[i], new Point(100 - 30 * i,450 + 20 * i));
            }*/
            //TODO
            //beakers[1].visible = false;

             //beakers[3].visible = false;

           /* for (i = 0; i < 2; ++ i) {
                self.place(rotors[i],{ x: 600 + 20 * i, y: 470 + 10 * i });
            }*/

            //self.place(bigBeaker, new Point(100, 1000));

            bg.set({regX: 600, regY: 320, scaleX: 1.2});
            self.place(bg, new Point(480, 320));

            self.place(waterBottle, new Point(173, 440));
            self.place(pipetStand, new Point(700, 270));
            self.place( volumetricFlask,new Point(-50,375));

//    this.place(titrationStand, new Point(520,160));
//    this.place(buret, new Point(650,100));
            self.place(titrationStand, new Point(520,1000));
            self.place(tubeholder,new Point(304,270));
            self.place(tube,new Point(345,270));
            self.place(tube1,new Point(378,270));
            self.place(tube2,new Point(410,270));
            self.place(tube3,new Point(445,270));
            self.place(tube4,new Point(480,270));
            self.place(tube5,new Point(515,270));
            self.place(tube6,new Point(549,270));
            self.place(pool,new Point(689,475));
           self.place(arrow,new Point(525,278));
           // self.place(buret, new Point(650,1000));

            //self.place(phInstrument, new Point(680, 380));
           // self.place(drainageBar, new Point(680, 375));

           // self.place(stirrer, new Point(600, 500));

            //self.place(cap, new Point(592,290));
            self.place(reagenBottle, new Point(80, 450));
            self.place(formaldehyde, new Point(60, 280));
            self.place(pipet, new Point(700, 290));
            self.place(pipet2, new Point(700, 320));
            self.place(bigPipet, new Point(650, 350));

            self.place(suckBall, new Point(315, 577));
           //self.place(cylinder, new Point(310, 180));
           // self.place(soySauce, new Point(40, 210));

            //self.place(phElectrode, new Point(690, 330));

            //curve.update(phElectrode, new CRE.Point(800,480));
            //beakers[0].set({x:625,y:450});
            self.set({
                curve: curve,
                hand: hand,
               // stirrer: stirrer,
                //drainageBar: drainageBar,
                titrationStand: titrationStand,
                tubeholder:tubeholder,
                tube: tube,
                tube1:tube1,
                tube2:tube2,
                tube3:tube3,
                tube4:tube4,
                tube5:tube5,
                tube6:tube6,
                pool: pool,
                // phElectrode : phElectrode,
                //phInstrument: phInstrument,
                //bigBeaker: bigBeaker,
              //  beaker: beakers[3],
                pipet: pipet,
                pipet2: pipet2,
                bigPipet: bigPipet,
                waterBottle: waterBottle,
               // soySauce: soySauce,
                suckBall: suckBall,
                //powder: powder,
                paper: paper,
               volumetricFlask: volumetricFlask,
                arrow:arrow,
               // cylinder: cylinder,
             //   beakers: beakers,
               // rotors: rotors,
               /* volumetricFlasks: volumetricFlasks,
                volumetricFlask: volumetricFlasks[1],*/
                reagenBottle: reagenBottle,
                formaldehyde: formaldehyde,
                //cap: cap,
                drop: drop,
               // buret: buret,
                tip: tip,
                board: board,

                table: table
            });

            /*stirrer.addEventListener('click', function() {
             if(stirrer.active) {
             stirrer.stop();
             //phElectrode.close();
             }else{
             stirrer.start();
             //phElectrode.open();
             }
             });*/


            // CRE.Tween.get(hand,{loop:true}).to({x:100},500).to({x:0},500);

            //this.addEventListener('tick', this.refresh.bind(this));

            /*var shape = new CRE.Shape();
             var g = shape.graphics;
             g.beginFill('#f00').drawRect(0,0,100,100).drawCircle(0,0,50);
             this.addChild(shape);
             shape.x=200;shape.y=200;*/


        }
    });
})();

//##############################################################################
// src/steps/Step.js
//##############################################################################
ENJ.Step = (function() {
  var EventDispatcher = CRE.EventDispatcher;

  return ENJ.defineClass({
    /**
     *
     * @class Step
     * @extends EventDispatcher
     *
     * @param {Object} paras
     * @constructor
     */
    constructor: function Step(paras) {
      EventDispatcher.apply(this, arguments);
      //this.register();

      this.scene = paras.scene;
      this.store = paras.store;

      //this.ready();
    }, extend: EventDispatcher,
    /**
     * @property active
     * @type {Boolean}
     */
    get active() {
      return this._active;
    },
    /**
     * @method update
     */
    update: function() {},

    /**
     * Start interacting.
     *
     * @method start
     */
    start: function() {
      this._active = true;
      //this.dispatchEvent('stepstart');
    },

    /**
     * Stop interacting.
     *
     * @method stop
     */
    stop: function() {
      this._active = false;
      this.dispatchEvent('complete');
    }
  });
})();

//##############################################################################
// src/steps/Step_CutBag.js
//##############################################################################
ENJ.Step_CutBag = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 剪开袋子
     * �?用：剪刀、袋�?
     *
     * @constructor
     */
    constructor: function Step_CutBag() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);

      var store = this.store, scene = this.scene, bag, scissors,
        handlers = this.handlers = [];//, pipet, bottle, suckBall;
      // @todo 精简
      bag = this.bag = scene.bags[store['bag']];
      scissors = this.scissors = scene.scissors;

      bag.cursor = 'pointer';
      scissors.cursor = 'pointer';
      scissors.visible = false;
      /*scene.setToTop(this.suckBall);
       scene.setToTop(this.pipet);
       scene.setToTop(this.bottle);

       this.suckBall.cursor = 'pointer';
       this.pipet.cursor = 'pointer';
       this.bottle.cursor = 'pointer';*/

      this.flags = [];

      handlers[0] = this.onClickBag.bind(this);
      handlers[1] = this.onMouseScissors.bind(this);

      scene.setChildIndex(bag, scene.getChildIndex(scissors) - 1);

      //this.bag.addEventListener('click', handlers[0]);
      Tween.get(bag).wait(1000).to({
        x: 320, y: 450, scaleY: 1.0, skewX: 0, rotation: -45
      }, 500).call(function() {
        scissors.visible = true;
        scissors.gotoAndStop('open');
        scissors.addEventListener('mousedown', handlers[1]);
        scissors.addEventListener('pressup', handlers[1]);
        //stage.addEventListener('stagemousemove', handlers[2]);
      });
    },

    stop: function() {
      base.stop.call(this);

      var handlers = this.handlers, bag = this.bag, scissors = this.scissors;

      bag.cursor = 'auto';
      scissors.cursor = 'auto';

      //this.scene.setChildIndex(bag, bag.index);
      //handlers[0] = this.onClickBag.bind(this);

      //this.bag.removeEventListener('click', handlers[0]);
      scissors.removeEventListener('pressup', handlers[1]);
      scissors.removeEventListener('mousedown', handlers[1]);
      //this.scene.stage.removeEventListener('stagemousemove', handlers[2]);
      handlers.splice(0);

    },

    onClickBag: function() {
      var bag = this.bag, scissors = this.scissors, handlers = this.handlers;// stage = this.scene.stage;
      if (this.flags[0]) { return; }
      //bag.start();
      this.flags[0] = true;
      Tween.get(bag).to({
        x: 320, y: 450, scaleY: 1.0, skewX: 0, rotation: -45
      }, 500).call(function() {
        scissors.visible = true;
        scissors.gotoAndStop('open');
        scissors.addEventListener('mousedown', handlers[1]);
        scissors.addEventListener('pressup', handlers[1]);
        //stage.addEventListener('stagemousemove', handlers[2]);
      });
    },

    onMouseScissors: function(event) {
      var bag = this.bag, scissors = this.scissors;
      switch (event.type) {
        case 'mousedown':
          this.flags[1] = true;
          scissors.gotoAndStop('close');
          break;
        case 'pressup':
          scissors.gotoAndStop('open');
          if (this.flags[1]
            && scissors.x > bag.x + 20 && scissors.x < bag.x + 80
            && scissors.y > bag.y - 50 && scissors.y < bag.y) {
            scissors.visible = false;
            bag.gotoAndStop('open');
            this.stop();
          }
          this.flags[1] = false;
          break;
      }
    },

    /*onStageMouseMove = function(event) {
     this.scissors.set({ x: event.stageX, y: event.stageY });
     };*/

    update: function() {
      this.scissors.set(this.scene.getLocalMouse());
    }
  });
})();

//##############################################################################
// src/steps/Step_WashBag.js
//##############################################################################
ENJ.Step_WashBag = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 清洗袋子内部残留粉末
     * �?用：蒸馏水�?�袋子�?�烧杯�?�粉�?
     *
     * @constructor
     */
    constructor: function Step_WashBag() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);

      var store = this.store, scene = this.scene,
        handlers = this.handlers = [], bottle;

      this.time = 0;
      this.flags = [];

      this.bag = scene.bags[store.bag];
      this.beaker = scene.beakers[store.beaker];
      this.powder = scene.powder;
      bottle = this.bottle = scene.waterBottle;

      bottle.cursor = 'pointer';

      if(!bottle.active/*this.store.remain*/) {
        bottle.start();
        //bottle.active = true;
        Tween.get(bottle).to({
          x: 400, y: 400
        }, 250);
      }

      handlers[0] = this.onClickBottle.bind(this);
      bottle.addEventListener('click', handlers[0]);
    },

    stop: function() {
      var handlers = this.handlers;

      if(!this.store.remain) {
        Tween.get(this.bag).to({
          alpha: 0.0
        }, 250);
      } else {
        Tween.get(this.bag).to({
          rotation: 30
        }, 250);
      }

      /*if(!this.store.remain) {
       //this.bottle.stop();
       this.bottle.active = false;
       }*/

      this.bottle.cursor = 'auto';
      this.bottle.removeEventListener('click', handlers[0]);

      base.stop.call(this);
    },

    onClickBottle: function() {
      var self = this, bag = this.bag, beaker = this.beaker, bottle =  this.bottle;
      if (this.flags[0]) { return; }
      this.flags[0] = true;
      Tween.get(bottle).to({
        rotation: -30, x: 320, y: 430
      }, 250).call(function() {
        self.flags[1] = true;

        //var onComplete;


        Tween.get(bottle).wait(1000).to({
          rotation: 0, x: 400, y: 400
        }, 250);
        Tween.get(bag).wait(1000).to({
          rotation: 120
        }, 1000);//.call(onComplete);
      });
    },

    update: function(event) {
      var powder = this.powder, beaker = this.beaker, time, volume;
      if (this.flags[1]) {
        time = this.time += event.delta;
        volume = beaker.store('volume');
        if (volume >= this.store.volume) {
          //volume = this.store.volume;
          beaker.store('volume', this.store.volume);
          //this.flags[1] = false;
          this.stop();
        }

        if (time > 1000) {
          //volume += event.delta / 1000;
          beaker.store('volume', volume + event.delta / 200);
          if (powder.alpha > 0) {
            powder.alpha -= event.delta / 2000;
          } else {
            powder.visible = false;
          }
        }
      }
    }
  });
})();

//##############################################################################
// src/steps/Step_DumpPowder.js
//##############################################################################
ENJ.Step_DumpPowder = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 将袋中粉末�?�入烧杯�?
     * �?用：袋子、粉末（动画）�?�烧�?
     *
     * @constructor
     */
    constructor: function Step_DumpPowder() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);

      var store = this.store, scene = this.scene,
        handlers = this.handlers = [], flags = this.flags = [],
        bag, beaker;//, pipet, bottle, suckBall;
      // @todo 精简
      bag = this.bag = scene.bags[store.bag];
      beaker = this.beaker = scene.beakers[store.beaker];
      this.powder = scene.powder;

      bag.cursor = 'pointer';
      //this.beaker.cursor = 'pointer';

      var g = new CRE.Graphics();
      g.beginFill('#0f0').drawEllipse(0, 0, 80, 40);

      this.rect = new CRE.Shape(g);


      Tween.get(beaker).to({
        x: 300, y: 500
      }, 500);

      Tween.get(bag).to({
        rotation: 30
      }, 500).call(function() {
        flags[0] = true;
      });

      handlers[0] = this.onClickBag.bind(this);
      bag.addEventListener('click', handlers[0]);
      bag.cursor = 'pointer';
    },

    stop: function() {
      var handlers = this.handlers;

      this.bag.removeEventListener('click', handlers[0]);
      this.bag.cursor = 'auto';
      base.stop.call(this);
    },

    onClickBag: function() {
      if (!this.flags[0] || this.flags[1]) { return; }
      //bag.start();
      this.flags[1] = true;

      var powder = this.powder, beaker = this.beaker, bag = this.bag, rect = this.rect, self = this;
      //powder.visible = true;
      powder.set({ alpha: 1.0, visible: true, x: beaker.x + 15, y: beaker.y + 75 });

      rect.x = powder.x - 10;
      rect.y = powder.y - 12;
      powder.mask = rect;

      powder.y += 20;

      //bag.rotation = 30;
      Tween.get(bag)
        .to({ rotation: 120 }, 250)
        .wait(1500)
        .to({ rotation: 30 }, 250)
        .call(function() {
          //bag.rotation = 30;
          /*Tween.get(bag).wait(1500).to({
           rotation: 30
           }, 250);*/
          self.stop();
        });

      Tween.get(powder).to({
        y: beaker.y + 75
      }, 2000);
    }
  });
})();

//##############################################################################
// src/steps/Step_DumpWater.js
//##############################################################################
ENJ.Step_DumpWater = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 将蒸馏水倒入烧杯，（清洗引流棒）
     * �?用：蒸馏水�?�烧杯�?�（引流棒）、水流动�?
     *
     * @constructor
     */
    constructor: function Step_DumpWater () {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, handlers = this.handlers = [], bottle;

      bottle = this.bottle = scene.waterBottle;
      this.beaker = scene.beakers[this.store.beaker];

      this.flags =[];

      if(!bottle.active/*this.store.keeping*/) {
        //bottle.active = true;
        bottle.start();
        Tween.get(bottle).to({
          x: 400, y: 400
        }, 250);
      }

      handlers[0] = this.onClickBottle.bind(this);
      bottle.addEventListener('click', handlers[0]);
      bottle.cursor = 'pointer';
    },

    stop: function() {

      this.bottle.removeEventListener('click', this.handlers[0]);
      this.bottle.cursor = 'auto';
      //this.bottle.active = false;
      this.bottle.stop();


      base.stop.call(this);
    },

    update: function(event) {
      var beaker = this.beaker, volume;
      if (this.flags[1]) {
        volume = beaker.store('volume');

        if (volume > this.store.volume) {
          this.stop();
        }

        beaker.store('volume', volume + event.delta / 100);
      }
    },

    onClickBottle: function() {
      var bottle = this.bottle, self = this, ratio;
      if (!this.flags[0]) {
        this.flags[0] = true;
        //ratio = (this.store.volume - this.beaker.store('volume')) / 10;

        if(this.store.washing) {
          Tween.get(bottle)
            .to({ rotation: -30, x: 360, y: 450 }, 250)
            .call(function() {
              self.flags[1] = true;
              bottle.dump(true, 0);
            })
            .to({ x: 370, y: 400 }, 500)
            .to({ x: 360, y: 450 }, 500)
            .to({ x: 370, y: 400 }, 500)
            .to({ x: 360, y: 450 }, 500)
            .call(function() {
              bottle.dump(false, 0);
            })
            //.wait(1000 * ratio)
            .to({ rotation: 0, x: bottle.location.x, y: bottle.location.y }, 250);
        } else {
          Tween.get(bottle)
            .to({ rotation: -30, x: 340, y: 430 }, 250)
            .call(function() {
              self.flags[1] = true;
              bottle.dump(true, 0);
            })
            .wait(1000)
            .call(function() {
              bottle.dump(false, 0);
            })
            .to({ rotation: 0, x: bottle.location.x, y: bottle.location.y }, 250);
        }
        /*Tween.get(bottle)
         .to({ rotation: -30, x: 340, y: 430 }, 250)
         .call(function() {
         self.flags[1] = true;
         })
         .wait(1000 * ratio)
         .to({ rotation: 0, x: bottle.location.x, y: bottle.location.y }, 250);*/
      }
      /*var bottle = this.bottle;
       if (bottle.active) {

       } else {

       }*/
    }
  });
})();

//##############################################################################
// src/steps/Step_BlowLiquid.js
//##############################################################################
ENJ.Step_BlowLiquid = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;
  
  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 将移液管中液体慢慢注入容�?
     * �?用：手�?�移液管、容�?
     *
     * @constructor
     */
    constructor: function Step_BlowLiquid() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, store = this.store, point,self = this,
        handlers = this.handlers = [], hand, pipet, bottle;


      this.scale = store.scale || 1;
      this.flags = [];

      hand = this.hand = scene.hand;
      pipet = this.pipet = store.pipet ?  scene[store.pipet] : scene.pipet;




      if ('bottle' in store) {
        bottle = this.bottle = scene[store.bottle];
      } else if ('beaker' in store){
        bottle = this.bottle = scene.beakers[store.beaker];
        bottle.fix();
      }
      bottle.start();


      scene.setChildIndex(pipet, scene.getChildIndex(bottle) - 1);

      handlers[0] = this.onClick.bind(this);
      hand.addEventListener('click', handlers[0]);

      this.flags[0] = store.rightNow;


      bottle.visible = true;
      hand.set({visible:true, y:pipet.y - 20, x: pipet.x - 10});

      var self = this,
        change = function() {
          self.flags[2] = true;
          if(store.rightNow){
            hand.gotoAndStop('up');
            console.log("upupuupupupuupp");
          }
        };
      if (store.rotation) {
        if (store.point) {
          point = store.point;
        } else {
          point = {x: 305, y: 400};
        }

        var offsetX = store.offsetX || 0, offsetY = store.offsetY || 0;

        Tween.get(bottle).to({
          x: point.x + offsetX,
          y: point.y + offsetY,
          rotation: store.rotation
        }, 500).call(change).call(function(){
          if(!store.act){
            self.onClick();}
        });

        Tween.get(hand).to({y:point.y-210},500);
        Tween.get(pipet).to({y:point.y-190},500);
      } else {
        point = {x: 300, y: 500};
        Tween.get(bottle).to({
          x: point.x,
          y: point.y
        }, 500).call(change).call(function(){
          if(!store.act){
          self.onClick();}
        });

        Tween.get(hand).to({y:point.y-270},500);
        Tween.get(pipet).to({y:point.y-250},500);
      }
     /* var volume, delta,  hand = this.hand, bottle = this.bottle, pipet = this.pipet,
          target = this.store.volume, remain = this.store.remain, showLabel = this.store.showLabel;*/
      /*if(!store.act){
        this.flags[0] = true;
        this.hand.gotoAndStop('up');
        Tween.get(hand).to({
          x:hand.x,y:hand.y
        }).call(function(event){


          bottle.refresh();

            volume = pipet.store('volume');
            delta = event.delta / 1000;
            if (volume <= target) {
              volume = target;
              this.flags[1] = true;
              hand.gotoAndStop('down');

//                if (remain) {

              if (remain > 1) {
                this.stop();
              } else {

                Tween.get(bottle)
                    .wait(1000)
                    .to({ x: bottle.location.x, y: bottle.location.y, rotation: 0 }, 500)
                    .call(function(){
                      if ('beaker' in self.store) {
                        bottle.unfix();
                      }
                      self.scene.setChildIndex(bottle, bottle.index);
                      self.stop();
                    });
              }

              if (showLabel) {
                pipet.hideLabel();
              }
              if (volume<=0) {
                // pipet.stop();
                Tween.get(pipet)
                    .to({
                      x: pipet.location.x,
                      y: pipet.location.y,
                      rotation: -90
                    },500);
                console.log("mmmmmm"+new Date().getSeconds());
                console.log( pipet.active);
                console.log("pppppppppppp");

              }

            } else {
              volume -= delta;
            }
            if (showLabel) {
              pipet.showLabel();
            }
            pipet.store('volume', volume);
            bottle.store('volume', bottle.store('volume') + delta * this.scale);

        });
      }*/
    },

    stop: function() {
      var bottle = this.bottle, hand = this.hand;
      var store = this.store;
      var pipet = this.pipet;
      if(store.top)
      {
        Tween.get(bottle)

            .to({ x: bottle.location.x, y: bottle.location.y, rotation: 0 }, 500);
       /* Tween.get(pipet)
            .to({x:pipet.location.x,y: pipet.location.y},500);*/
             console.log("qqqqqqqqqqmmmmmmmmmmmmm");

        bottle.stop();}
      hand.visible = false;
      hand.gotoAndStop('down');
      this.scene.setChildIndex(bottle, bottle.index);
      hand.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    update: function(event) {
      var volume, delta, self = this, hand = this.hand, bottle = this.bottle, pipet = this.pipet,
        target = this.store.volume, remain = this.store.remain, showLabel = this.store.showLabel;

      bottle.refresh();
      if (this.flags[0] && !this.flags[1] && this.flags[2]) {
        volume = pipet.store('volume');
        delta = event.delta / 1000;
        if (volume <= target) {
          volume = target;
          this.flags[1] = true;
          hand.gotoAndStop('down');

//                if (remain) {

          if (remain > 1) {
            this.stop();
          } else {

            Tween.get(bottle)
              .wait(1000)
              .to({ x: bottle.location.x, y: bottle.location.y, rotation: 0 }, 500)
              .call(function(){
                if ('beaker' in self.store) {
                  bottle.unfix();
                }
                self.scene.setChildIndex(bottle, bottle.index);
                self.stop();
              });
          }

          if (showLabel) {
            pipet.hideLabel();
          }
          if (volume<=0) {
           // pipet.stop();
            Tween.get(pipet)
              .to({
                x: pipet.location.x,
                y: pipet.location.y,
                rotation: -90
              },500);
            console.log("mmmmmm"+new Date().getSeconds());
            console.log( pipet.active);
            console.log("pppppppppppp");

          }

        } else {
          volume -= delta;
        }
        if (showLabel) {
          pipet.showLabel();
        }
        pipet.store('volume', volume);
        bottle.store('volume', bottle.store('volume') + delta * this.scale);
      }
    },

    onClick: function() {
      if (!this.flags[2] || this.flags[0] ) { return; }
      this.flags[0] = true;
      this.hand.gotoAndStop('up');
    }
  });
})();

//##############################################################################
// src/steps/Step_SuckLiquid.js
//##############################################################################
ENJ.Step_SuckLiquid = (function() {
  var Step = ENJ.Step,
    Ease = CRE.Ease,
    Tween = CRE.Tween;

  var base = Step.prototype;

  
  return ENJ.defineClass({
    /**
     * 吸取液体
     * �?用：移液管�?�吸球�?�试剂瓶
     *
     * @constructor
     */
    constructor: function Step_SuckLiquid() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var store = this.store, scene = this.scene,  volume,delta,
        handlers = this.handlers = [], self = this,
        hand, pipet, bottle, suckBall;//, pipet, bottle, suckBall;
      // @todo 精简
      hand = this.hand = scene.hand;
      pipet = this.pipet = store.pipet ?  scene[store.pipet] : scene.pipet;
      bottle = this.bottle = scene[store.bottle];
      suckBall = this.suckBall = scene.suckBall;

      pipet.cursor = 'pointer';
      suckBall.cursor = 'pointer';

      handlers[0] = this.onClickPipet.bind(this);
      handlers[1] = this.onClickHand.bind(this);
      handlers[2] = this.onClickSuckBall.bind(this);

      this.flags = [];


      [/*suckBall, */pipet, bottle]
        .forEach(function(element) {
          //scene.setToTop(element, 7);
          element.cursor = 'pointer';
        });
//      scene.setChildIndex(pipet, scene.getChildIndex(bottle)-1);

      bottle.start();

      if (!store.still) {
        console.log("kkkkkkkkkkkk");
        Tween.get(bottle).to({
          //rotation: 30,

          x: 300,
          y: 400
          /* x:bottle.x,
           y:bottle.y*/

        }, 500, Ease.sineInOut).call(function(){
          if (pipet.active) {
            self.insertPipet();
          }
        });

      } else {
        if (pipet.active) {
          if(store.ins){
          console.log("222222222222"+pipet.active);
          self.insertPipet();
          }else{
            pipet.stop();
            console.log("mmmmmm1"+new Date().getSeconds());//为什么这�?步会抢在volume�?0的前面执行？
          }
        }
      }



      hand.visible = false;
     /* if(!store.act){
       var localMouse = this.scene.getLocalMouse();
        var  ball = this.suckBall;
        Tween.get(suckBall).to({
          x: pipet.x + 8, y: pipet.y+ 30, rotation: 180
        }, 500, Ease.sineInOut);
        suckBall.start();
        scene.setChildIndex(suckBall, scene.getChildIndex(this.pipet)-1);
        suckBall.scale();
       // suckBall.suck();
        hand.set({visible:true, y:ball.y - 380, x: ball.x + 25 });
        hand.gotoAndStop('down');
        ball.stop();
        this.scene.setChildIndex(ball, ball.index);
        Tween.get(hand).wait(500).to({
        x:hand.x,y:hand.y
        },500).call(function(){
          hand.gotoAndPlay('up');
          suckBall.suck();
        }).wait(500).call(function(){
          Tween.get(ball).to({
            x: ball.location.x, y: ball.location.y, rotation: 0
          }, 500, Ease.sineInOut)
              .wait(500).call(function(){
                Tween.get(hand).to({y:bottle.y-220},500);
                Tween.get(pipet).to({y:bottle.y-200},500);
                hand.gotoAndStop('down');
              })

        }).call(function(event){
          volume = pipet.store('volume');
          delta = event.delta / 200;
          if (volume >= store.volume) {
            volume = store.volume;
            //this.stop();

            hand.visible = true;
            hand.gotoAndPlay('up');
            /!*Tween.get(bottle)
             .to({rotation:0})
             .call(function() {

             });*!/
          } else {
            volume += delta;
          }

          pipet.store('volume', volume);
          bottle.store('volume', bottle.store('volume') - delta);
          self.stop();
        });
*/




        //hand.set({x: localMouse.x -50, y: localMouse.y - 50 });

        /*Tween.get(ball).to({
          x: ball.location.x, y: ball.location.y, rotation: 0
        }, 500, Ease.sineInOut)
            .wait(500)
            .call(this.stop.bind(this));*/




      pipet.addEventListener('click', handlers[0]);
      hand.addEventListener('mousedown', handlers[1]);
      hand.addEventListener('pressup', handlers[1]);
      suckBall.addEventListener('mousedown', handlers[2]);
      suckBall.addEventListener('pressup', handlers[2]);
    },

    stop: function() {
      var /*i, n, element, */elements = [], handlers = this.handlers, scene = this.scene,
        hand = this.hand, pipet = this.pipet, bottle = this.bottle, suckBall = this.suckBall;

      pipet.cursor = 'auto';
      suckBall.cursor = 'auto';

      if (!this.store.remain) {
        elements.push(pipet);
        elements.push(bottle);
        bottle.stop();
      }


//      elements.sort(function(a, b) {
//        return a.index - b.index;
//      });


      elements.forEach(function(element) {
        element.cursor = 'auto';
        //scene.setChildIndex(element, element.index);
      });

      pipet.removeEventListener('click', handlers[0]);
      hand.removeEventListener('click', handlers[1]);
      suckBall.removeEventListener('mousedown', handlers[2]);
      suckBall.removeEventListener('pressup', handlers[2]);

      base.stop.call(this);
    },

    update: function(event) {
      var volume, delta, store = this.store, localMouse = this.scene.getLocalMouse(),
        hand = this.hand, pipet = this.pipet, bottle = this.bottle;

      bottle.refresh();
      if (!this.flags[2]){
        if(store.act) {
          hand.set({x: localMouse.x - 50, y: localMouse.y - 50});
        }
      }
      if (this.flags[0] && !this.flags[1]) {
        volume = pipet.store('volume');
        delta = event.delta / 200;
        if (volume >= store.volume) {
          volume = store.volume;
          //this.stop();
          this.flags[1] = true;
          hand.visible = true;
          hand.gotoAndPlay('up');
          console.log("ssssssssssssss");
          /*Tween.get(bottle)
           .to({rotation:0})
           .call(function() {

           });*/
        } else {
          volume += delta;
        }

        pipet.store('volume', volume);
        bottle.store('volume', bottle.store('volume') - delta);
      }

    },

    onClickPipet: function() {

      var pipet = this.pipet, bottle = this.bottle;//, rect = bottle.getBounds();
      if (pipet.active) {
        pipet.stop();
        console.log("11111111111111111111"+pipet.active);
        Tween.get(pipet).to({
          x: pipet.location.x,
          y: pipet.location.y,
          rotation: -90
        }, 500, Ease.sineInOut);
      } else {
        console.log(pipet.active);
        this.insertPipet();
//            Tween.get(pipet)
//                .to({
//                    x: bottle.x + rect.width * 0.5 - 5,
//                    y: bottle.y - 300,
//                    rotation: 0
//                }, 500, Ease.sineInOut)
//                .to({
//                    y: bottle.y - 150
//                }, 500, Ease.sineInOut)
//                .call(function() {
//                    pipet.start();
//                });
      }
    },

    insertPipet: function() {
      var store = this.store;
      var self = this, pipet = this.pipet, bottle = this.bottle,
        rect = bottle.getBounds();
      Tween.get(pipet)
        .to({
          x: bottle.x + rect.width * 0.5 - 5,
          y: bottle.y - 300,
          rotation: 0
        }, 500, Ease.sineInOut)
        .to({
          y: bottle.y - 150
        }, 500, Ease.sineInOut)
        .call(function() {
          self.flags[3] = true;
          pipet.start();
        }).call(function(){
            if(!store.act){
              self.autoBall();

            }
          }).wait(2000).call(function(){
               if(!store.act){
                 self.autoHand();
               }
          });
    },

    autoHand : function(){
      var hand = this.hand, ball = this.suckBall,
          bottle = this.bottle, pipet = this.pipet;
      hand.set({visible:true, y:pipet.y - 20 , x : pipet.x - 20  });
      if (!hand.visible || this.flags[2]) { return; }

      hand.gotoAndStop('down');
      console.log("ddddddddddddddd");
      if (hand.x > pipet.x - 40 && hand.x < pipet.x + 20 &&
          hand.y > pipet.y - 40 && hand.y < pipet.y + 20) {
        this.flags[2] = true;
        hand.set({x: pipet.x - 10, y: pipet.y - 20});
        //this.stop();
        if (!this.store.remain) {
          Tween.get(bottle).wait(500).to({
            //rotation: 0,
            x: bottle.location.x,
            y: bottle.location.y
          }, 500, Ease.sineInOut).call(function() {
            bottle.stop();
          });
        }

        ball.stop();
        this.scene.setChildIndex(ball, ball.index);
        Tween.get(ball).to({
          x: ball.location.x, y: ball.location.y, rotation: 0
        }, 500, Ease.sineInOut)
            .wait(500)
            .call(this.stop.bind(this));

        Tween.get(hand).to({y:bottle.y-320},500);

        Tween.get(pipet).to({y:bottle.y-300},500);
      }


    },

    onClickHand: function(event) {
      var hand = this.hand, ball = this.suckBall,
        bottle = this.bottle, pipet = this.pipet;

      if (!hand.visible || this.flags[2]) { return; }

      switch (event.type) {
        case 'mousedown':
          hand.gotoAndStop('down');
          console.log("downdowndowndown");
          if (hand.x > pipet.x - 40 && hand.x < pipet.x + 20 &&
            hand.y > pipet.y - 40 && hand.y < pipet.y + 20) {
            this.flags[2] = true;
            hand.set({x: pipet.x - 10, y: pipet.y - 20});
            //this.stop();
            if (!this.store.remain) {
              Tween.get(bottle).wait(500).to({
                //rotation: 0,
                x: bottle.location.x,
                y: bottle.location.y
              }, 500, Ease.sineInOut).call(function() {
                bottle.stop();
              });
            }

            ball.stop();
            this.scene.setChildIndex(ball, ball.index);
            Tween.get(ball).to({
              x: ball.location.x, y: ball.location.y, rotation: 0
            }, 500, Ease.sineInOut)
              .wait(500)
              .call(this.stop.bind(this));

            Tween.get(hand).to({y:bottle.y-320},500);

            Tween.get(pipet).to({y:bottle.y-300},500);
          }
          break;
        case 'pressup':
          hand.gotoAndStop('up');
            console.log("yqyqyqyqyqyqqy");
          break;
      }
    },
     autoBall:function(){
       var suckBall = this.suckBall, pipet = this.pipet;

       if(!this.flags[3]){ return; }
       suckBall.start();
       var scene = this.scene;
       scene.setChildIndex(suckBall, scene.getChildIndex(this.pipet)-1);
       Tween.get(suckBall).to({
         x: pipet.x + 8, y: pipet.y, rotation: 180
       }, 500, Ease.sineInOut);

         suckBall.scale();


         suckBall.suck();


           this.flags[0] =true;


     },

    onClickSuckBall: function(event) {
      var suckBall = this.suckBall, pipet = this.pipet;
      if(!this.flags[3]){ return; }
      switch (event.type) {
        case 'mousedown':
          if (suckBall.active) {
            suckBall.scale();
          }
          break;
        case 'pressup':
          if (suckBall.active) {
            suckBall.suck();

            if (this.bottle.active && pipet.active) {
              this.flags[0] =true;
            }
          } else if (pipet.active) {
            suckBall.start();
            var scene = this.scene;
            scene.setChildIndex(suckBall, scene.getChildIndex(this.pipet)-1);
            Tween.get(suckBall).to({
              x: pipet.x + 8, y: pipet.y, rotation: 180
            }, 500, Ease.sineInOut);
          }

          break;
      }
    }
  });
})();

//##############################################################################
// src/steps/Step_StirLiquid.js
//##############################################################################
ENJ.Step_StirLiquid = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 搅拌烧杯中的液体
     * �?用：烧杯、引流棒
     *
     * @constructor
     */
    constructor: function Step_StirLiquid() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var store = this.store, scene = this.scene,
        handlers = this.handlers = [], bar;//, pipet, bottle, suckBall;

      this.flags = [];
      this.time = 0;

      this.beaker = scene.beakers[store.beaker];
      bar = this.bar = scene.drainageBar;
      bar.cursor = 'pointer';

      if(this.store.remain) {
        Tween.get(bar).to({
          x: 410, y: 300, rotation: 10
        }, 500);
      }

      handlers[0] = this.onClickDrainageBar.bind(this);
      bar.addEventListener('click', handlers[0]);
    },

    stop: function() {
      //var handles = this.handles;
      this.bar.cursor = 'auto';
      this.bar.removeEventListener('click', this.handlers[0]);

      base.stop.call(this);
    },

    update: function(event) {
      if (this.flags[0]) {
        this.time += event.delta;
        if (this.time > 5000) {
          this.tween.loop = false;
          this.stop();
        }
      }
    },

    onClickDrainageBar: function() {
      if (this.flags[0]) { return; }
      this.flags[0] = true;

      this.tween = Tween.get(this.bar, { loop: true }).to({
        x: 360
      }, 250).to({
        x: 410
      }, 250);
    }
  });
})();

//##############################################################################
// src/steps/Step_TransferLiquid.js
//##############################################################################
ENJ.Step_TransferLiquid = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 将烧杯中的液体转移到容量瓶中
     * �?用：容量瓶�?�烧杯�?�引流棒
     *
     * @constructor
     */
    constructor: function Step_TransferLiquid() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store,
        handlers = this.handlers = [], bar, beaker, flask;

      this.flags = [];

      bar = this.bar = scene.drainageBar;
      beaker = this.beaker = scene.beakers[store.beaker];
      flask = this.flask = scene.volumetricFlasks[store.flask];

      beaker.cursor = 'pointer';

      flask.start();
      Tween.get(flask).to({
        x: 250, y: 300
      }, 250);

      Tween.get(bar).to({
        x: 350, y: 100
      }, 250);

      beaker.fix();
      //this.beaker.regX = 100;
      //this.beaker.scaleX = -1;
      Tween.get(beaker).to({
        x: 330, y: 250, rotation: 30
      }, 250);

      handlers[0] = this.onClickBeaker.bind(this);
      beaker.addEventListener('click', handlers[0]);
    },

    stop: function() {
      var beaker = this.beaker;

      /*beaker.unfix();
       //this.beaker.regX = 0;
       Tween.get(beaker).to({
       x: 300, y: 500, rotation: 0
       }, 250);

       Tween.get(this.bar).to({
       x: 410, y: 300*//*, rotation: 10*//*
       }, 500);*/

      beaker.cursor = 'auto';
      beaker.removeEventListener('click', this.handlers[0]);

      base.stop.call(this);
    },

    update: function(event) {
      var bar = this.bar, beaker = this.beaker, flask = this.flask, volume, delta;

      beaker.refresh();
      if(this.flags[0]) {
        delta = event.delta / 5000 * 20;
        volume = beaker.store('volume') - delta;
        if (volume <= 0) {
          this.flags[0] = false;
          volume = 0;
          //this.stop();

          beaker.unfix();

          if (this.store.remain) {
            //this.beaker.regX = 0;
            Tween.get(beaker).to({
              x: 300, y: 500, rotation: 0
            }, 250);

            Tween.get(bar).to({
              x: 410, y: 300/*, rotation: 10*/
            }, 500).call(this.stop.bind(this));
          } else {
            //this.beaker.regX = 0;
            Tween.get(beaker).to({
              x: -500, y: 0, rotation: 0
            }, 250).call(function() {
              beaker.visible = false;
            });

            Tween.get(bar).to({
              x: bar.location.x, y: bar.location.y, rotation: -90
            }, 500).call(this.stop.bind(this));
          }

        }

        beaker.store('volume',  volume);
        flask.store('volume', flask.store('volume')+delta);
      }
    },

    onClickBeaker: function() {
      if(!this.flags[0]) {
        this.flags[0] = true;
        Tween.get(this.beaker)
          .to({ rotation: 75 }, 1000)
          .to({ rotation: 85 }, 4000);
      }
    }
  });
})();

//##############################################################################
// src/steps/Step_ConstantVolume.js
//##############################################################################
ENJ.Step_ConstantVolume = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 定容
     * �?用：蒸馏水�?�容量瓶
     *
     * @constructor
     */
    constructor: function Step_ConstantVolume() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store,
        handlers = this.handlers = [], bottle, flask;

      flask = this.flask = scene[store.flask];
      bottle = this.bottle = scene.waterBottle;
        var self = this;

      this.flags = [];

      if (!flask.active) {
        flask.start();
        console.log("TTTTTTTTTTT");
      }

      console.log("TTTTTTTTTTT222222");

      Tween.get(flask).to({
       //regX: 62, regY: 120, x: 300, y: 400, rotation: 30   //rotation: 30为什么没有反应？ 为什么flask.start()放在外面执行不行�?
          x: 310, y: 100, rotation: 0
       }, 250).call(function(){
        flask.start();
      });

      if (!bottle.active/*this.store.keeping*/) {
        //bottle.active = true;
        bottle.start();
        Tween.get(bottle).to({
          x: flask.x + 20, y: flask.y - 200
        }, 250).call(function(){
            if(!store.act){
                self.onClickBottle();
            }
        })
      }


      handlers[0] = this.onClickBottle.bind(this);
      bottle.addEventListener('click', handlers[0]);

      bottle.cursor = 'pointer';
    },

    stop: function() {
      var store = this.store;
      var scene = this.scene;
     var bottle = this.bottle = scene.waterBottle;
     var flask = this.flask = scene[store.flask];
     var offsetX = store.offsetX || 0, offsetY = store.offsetY || 0;

     //bottle.active = false;
     /* Tween.get(bottle).to(
        {x:bottle.location.x,y:bottle.location.y,rotation:0}
        , 250);*/
      Tween.get(bottle).to({
        x:bottle.location.x,y:bottle.location.y,rotation:0
      },250).call(function(){

        bottle.stop();


      });

        Tween.get(flask).to({
            x:flask.location.x ,y:flask.location.y ,rotation:0
        },250).call(function(){
            flask.stop();
        });
      bottle.cursor = 'auto';
      bottle.removeEventListener('click', this.handlers[0]);

      base.stop.call(this);
    },

   /* update: function(event) {
      var volume, flask = this.flask, bottle = this.bottle;
      if (/!*this.active && *!/this.flags[0] && !this.flags[1]) {
        volume = flask.store('volume') + event.delta/100;
        if (volume >= this.store.volume) {
          volume = this.store.volume;
          this.flags[1] = true;

          flask.stop();
          bottle.stop();
          //bottle.active = false;
          Tween.get(bottle).to(
            {x:bottle.location.x,y:bottle.location.y,rotation:0}
            , 250).call(this.stop.bind(this));
        }
        flask.store('volume', volume);
      }
    },*/
    update: function() {
      this.flask.refresh();
    },

    onClickBottle: function() {
      var self=this;
      if (!this.flags[0]) {
        this.flags[0] = true;
        Tween.get(this.bottle).to({x:this.flask.x ,y: this.flask.y - 80,rotation:-30},250)
            .wait(1000)
            .call(function(){

                self.stop();
        });

      }
    }
  });
})();

//##############################################################################
// src/steps/Step_ShakeUp.js
//##############################################################################
ENJ.Step_ShakeUp = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 摇匀
     * �?用：容量�?
     *
     * @constructor
     */
    constructor: function Step_ShakeUp() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var flask, flags = this.flags = [], handlers = this.handlers = [];
      var scene = this.scene;
      var store = this.store;
      var self  = this;
      //flask = this.flask = this.scene.volumetricFlasks[this.store.flask];
      flask = this.flask = scene[store.flask];
      flask.cursor = 'pointer';

      handlers[0] = this.onClickFlask.bind(this);
      console.log("rrrrrrrrrrrr");
      Tween.get(flask).to({
        regX: 62, regY: 120, x: 300, y: 400, rotation: 30   //rotation: 30为什么没有反应？
      }, 250).call(function() {
        flags[0] = true;
      }).call(function(){
        if(!store.act){
          self.onClickFlask();
        }
      });
      console.log("rrrrrrrrrrrrqqqqq");
      flask.addEventListener('click', handlers[0]);
    },

    stop: function() {
      var flask = this.flask;

      flask.cursor = 'auto';
      //regX: 0, regY: 0
      Tween.get(flask).to({
        x: flask.location.x, y: flask.location.y,regX: 0, regY: 0  //如果这边加一个rotation �?�? 元素还是没有角度�?
      }, 250).call(function() {
        flask.rotation = 0;
        flask.refresh();
      });

      flask.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    update: function() {
      this.flask.refresh();
    },

    onClickFlask: function() {
      if (!this.flags[0]) { return; }
      var self=this;
      var flask = this.flask, stop = this.stop.bind(this);
      Tween.get(flask)
        .to({x:300,y:200,regX:0,regY:100},500)
        .to({ rotation: 30 }, 150)
        .to({ rotation: -30 }, 150)
        .to({ rotation: 30 }, 150)
        .to({ rotation: -30 }, 150)
        .to({x:335,y:200,regX:0,regY:0,rotation:0},500)
          .call(function() {
         //self.stop();//stop.bind(this)是什么意思？
          stop();
        });
    }
  });
})();

//##############################################################################
// src/steps/Step_WashElectrode.js
//##############################################################################
ENJ.Step_WashElectrode = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 清洗电极
     * �?用：蒸馏水�?�烧杯�?�电�?
     *
     * @constructor
     */
    constructor: function Step_WashElectrode() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, electrode, beaker, bottle;

      this.flags = [];

      this.curve = scene.curve;
      bottle =this.bottle = scene.waterBottle;
      beaker = this.beaker = scene.bigBeaker;
      electrode = this.electrode = scene.phElectrode;

      bottle.cursor = 'pointer';
      electrode.cursor = 'pointer';

      Tween.get(beaker).to({ x: 420, y: 500 }, 250);
      Tween.get(electrode).to({ x: 520,y: 300, rotation: 30 }, 250);

      var handlers = this.handlers = [];

      handlers[0] = this.onClickElectrode.bind(this);
      handlers[1] = this.onClickBottle.bind(this);
      electrode.addEventListener('click', handlers[0]);
      bottle.addEventListener('click', handlers[1]);
    },

    stop: function() {
      var electrode = this.electrode, beaker = this.beaker, bottle = this.bottle;

      bottle.cursor = 'auto';
      electrode.cursor = 'auto';

      this.curve.update(electrode, new CRE.Point(800,480));
      //Tween.get(beaker).to({ x: beaker.location.x, y: beaker.location.y }, 250);
      //Tween.get(bottle).to({ x: bottle.location.x, y: bottle.location.y, rotation: 0 }, 250);
      //Tween.get(electrode).to({ x: electrode.location.x, y: electrode.location.y, rotation: 0 }, 500);

      electrode.removeEventListener('click', this.handlers[0]);
      bottle.removeEventListener('click', this.handlers[1]);

      base.stop.call(this);
    },

    onClickElectrode: function() {
      var electrode = this.electrode;
      if (this.flags[0]) { return; }
      this.flags[0] = true;
      electrode.start();
      Tween.get(electrode).to({ y: 350, rotation: 15 }, 250);
    },

    onClickBottle: function() {
      var electrode = this.electrode, beaker = this.beaker, bottle = this.bottle;
      if (this.flags[0] && !this.flags[1]) {
        this.flags[1] = true;
        var stop = this.stop.bind(this);

        bottle.scaleX = -1;
        Tween.get(bottle)
          .to({ x: 500, y: 450, rotation: 30 }, 250)
          .call(function() {
            bottle.dump(true, 0);
          })
          .to({ x: 480, y: 500 }, 800)
          .to({ x: 500, y: 450 }, 800)
          .to({ x: 480, y: 500 }, 800)
          //.to({ x: 400, y: 300 }, 500)
          .call(function() {
            Tween.get(beaker)
              .to({ x: beaker.location.x, y: beaker.location.y }, 300);
            bottle.scaleX = 1;
            bottle.dump(false, 0);
            Tween.get(bottle)
              .to({ x: bottle.location.x, y: bottle.location.y, rotation: 0 }, 500)
              .call(stop);
            /*Tween.get(electrode)
             .to({ x: electrode.location.x, y: electrode.location.y, rotation: 0 }, 500)
             .call(stop);*/
          });
      }
    },

    update: function(event) {

      this.curve.update(this.electrode, new CRE.Point(800,480));
//      var p = [], dist;
//
//      p[0] = this.electrode;
//      p[6] = new CRE.Point(800,480);
//
//      //angle = 90;// - Math.atan2((p[4].x-p[0].x), (p[4].y-p[0].y)) * 180 / Math.PI;
//      dist = Math.sqrt(
//          (p[6].x-p[0].x) * (p[6].x-p[0].x) + (p[6].y-p[0].y) * (p[6].y-p[0].y)
//      );
//
//      p[1] = new CRE.Point(2/12 * dist, -100);
//      p[2] = new CRE.Point(4/12 * dist, 0);
//      p[3] = new CRE.Point(6/12 * dist, 100);
//      p[4] = new CRE.Point(8/12 * dist, 50);
//      p[5] = new CRE.Point(10/12 * dist, 0);
//      p[6].x = p[6].x - p[0].x;
//      p[6].y = p[6].y - p[0].y;
//
//      this.curve.graphics
//        .clear()
//        .setStrokeStyle(4,1,1)
//        .beginStroke('#000')
//        .moveTo(0,0)
//        .quadraticCurveTo(p[1].x,p[1].y,p[2].x,p[2].y)
//        .quadraticCurveTo(p[3].x,p[3].y,p[4].x,p[4].y)
//        .quadraticCurveTo(p[5].x,p[5].y,p[6].x,p[6].y)
//        .endStroke();
//
//      this.curve.set(
//        { x: p[0].x+9, y: p[0].y+5}
//      );




    }
  });
})();

//##############################################################################
// src/steps/Step_WipeUpElectrode.js
//##############################################################################
ENJ.Step_WipeUpElectrode = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 擦干电极
     * �?用：纸巾、电�?
     *
     * @constructor
     */
    constructor: function Step_WipeUpElectrode() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, paper, electrode;

      paper = this.paper = scene.paper;
      electrode = this.electrode = scene.phElectrode;
      this.curve = scene.curve;

      Tween.get(electrode)
        .to({ rotation: 0 }, 500);

      this.flags = [];
      var handlers = this.handlers = [];
      handlers[0] = this.onClick.bind(this);

      paper.visible = true;
      paper.cursor = 'pointer';
      paper.addEventListener('click', handlers[0]);
    },

    stop: function() {
      var electrode = this.electrode, paper = this.paper;

      this.curve.update(electrode, new CRE.Point(800,480));

      paper.visible = false;
      paper.cursor = 'auto';
      paper.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    update: function() {
      var localMouse = this.scene.getLocalMouse();

      if (!this.flags[0]) {
        this.paper.set({ x: localMouse.x - 60, y: localMouse.y - 28 });
      }

      this.curve.update(this.electrode, new CRE.Point(800,480));

//      var p = [], dist;
//
//      p[0] = this.electrode;
//      p[6] = new CRE.Point(800,480);
//
//      //angle = 90;// - Math.atan2((p[4].x-p[0].x), (p[4].y-p[0].y)) * 180 / Math.PI;
//      dist = Math.sqrt(
//          (p[6].x-p[0].x) * (p[6].x-p[0].x) + (p[6].y-p[0].y) * (p[6].y-p[0].y)
//      );
//
//      p[1] = new CRE.Point(2/12 * dist, -100);
//      p[2] = new CRE.Point(4/12 * dist, 0);
//      p[3] = new CRE.Point(6/12 * dist, 100);
//      p[4] = new CRE.Point(8/12 * dist, 50);
//      p[5] = new CRE.Point(10/12 * dist, 0);
//      p[6].x = p[6].x - p[0].x;
//      p[6].y = p[6].y - p[0].y;
//
//      this.curve.graphics
//        .clear()
//        .setStrokeStyle(4,1,1)
//        .beginStroke('#000')
//        .moveTo(0,0)
//        .quadraticCurveTo(p[1].x,p[1].y,p[2].x,p[2].y)
//        .quadraticCurveTo(p[3].x,p[3].y,p[4].x,p[4].y)
//        .quadraticCurveTo(p[5].x,p[5].y,p[6].x,p[6].y)
//        .endStroke();
//
//      this.curve.set(
//        { x: p[0].x+9, y: p[0].y+5}
//      );
    },

    onClick: function() {
      if (this.flags[0]) { return; }

      var paper = this.paper, electrode = this.electrode, self = this;
      if (paper.x > electrode.x - 50 && paper.x < electrode.x + 50 &&
        paper.y > electrode.y + 60 && paper.y < electrode.y + 200) {
        this.flags[0] = true;

        //scene.setChildIndex(paper, scene.getChildIndex(electrode) + 1);
        paper.set({ x: electrode.x - 60, y: electrode.y + 100 });
        Tween.get(paper)
          .to({ y: electrode.y + 200 }, 500)
          .to({ y: electrode.y + 100 }, 500)
          /*.call(function() {
           scene.setChildIndex(paper, scene.getChildIndex(electrode) - 1);
           })*/
          .to({ y: electrode.y + 200 }, 500)
          .to({ y: electrode.y + 100 }, 500)
          .call(function(){
            Tween.get(electrode)
              .to({ x: electrode.location.x, y: electrode.location.y/*, rotation: 0*/ }, 500)
              .call(self.stop.bind(self));
          });

      }
    }
  });
})();

//##############################################################################
// src/steps/Step_DumpFromFlask.js
//##############################################################################
ENJ.Step_DumpFromFlask = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 将容量瓶中液体�?�入烧杯
     * �?用：容量瓶�?�烧�?
     *
     * @constructor
     */
    constructor: function Step_DumpFromFlask() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store,
        handlers = this.handlers = [], flask, beaker;

      flask = this.flask = scene.volumetricFlasks[store.flask];
      beaker = this.beaker = scene.beakers[store.beaker];

      this.flags = [];

      handlers[0] = this.onClickFlask.bind(this);
      flask.addEventListener('click', handlers[0]);
      flask.cursor = 'pointer';

      flask.start();
      Tween.get(flask).to({
        x: 350, y: 530, rotation: -60
      }, 250);

      beaker.start();
      Tween.get(beaker).to({
        x: 300, y: 500
      }, 250);
    },

    stop: function() {
      var flask =this.flask;
      flask.cursor = 'auto';
      flask.refresh();
      flask.stop();
      this.scene.setChildIndex(flask, 1);
      flask.removeEventListener('click', this.handlers[0]);

      base.stop.call(this);
    },

    update: function(event) {
      var volume, delta, beaker = this.beaker, flask = this.flask;
      flask.refresh();
      if (this.flags[0] && !this.flags[1]) {
        delta = event.delta / 100;
        volume = beaker.store('volume');

        if (volume >= this.store.volume) {
          this.flags[1] = true;
          volume = this.store.volume;
        } else {
          volume += delta;
        }

        flask.store('volume', flask.store('volume') - delta);
        beaker.store('volume', volume);
      }
    },

    onClickFlask: function() {
      if (this.flags[0]) { return; }
      var flask = this.flask;
      this.flags[0] = true;
      flask.rotation = -75;
      Tween.get(flask)
        .to({ rotation: -85 }, 3000)
        .to({
          x: flask.location.x, y: flask.location.y - 30, rotation: 0
        }, 250).call(
        this.stop.bind(this)
      );
    }
  });
})();

//##############################################################################
// src/steps/Step_AddRotor.js
//##############################################################################
ENJ.Step_AddRotor = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    /**
     * 加入转子
     * �?用：烧杯、转�?
     *
     * @constructor
     */
    constructor: function Step_AddRotor() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);

      var scene = this.scene, store = this.store,
        handlers = this.handlers = [], rotor;

      rotor =  this.rotor = scene.rotors[store.rotor];
      this.beaker = scene.beakers[store.beaker];

      Tween.get(rotor).to({
        x: 450, y: 550
      }, 250);

      handlers[0] = this.onClickRotor.bind(this);
      rotor.addEventListener('click', handlers[0]);
      rotor.cursor = 'pointer';
    },

    stop: function() {
      this.rotor.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    onClickRotor: function() {
      var rotor = this.rotor, beaker = this.beaker,
        stop = this.stop.bind(this);

      rotor.cursor = 'auto';
      Tween.get(rotor)
        .to({x: beaker.x + 10, y: beaker.y - 50}, 250)
        .call(function(){
          rotor.set({x:10,y:-50});
          beaker.addChild(rotor);
          beaker.setChildIndex(rotor, 0);

          Tween.get(rotor)
            .to({y: 80 }, 500)
            .call(stop)
        });
    }
  });
})();

//##############################################################################
// src/steps/Step_AddFormaldehyde.js
//##############################################################################
ENJ.Step_AddFormaldehyde = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    /**
     * 添加甲醛
     * �?用：甲醛、烧杯�?�手、移液管
     *
     * @constructor
     */
    constructor: function Step_AddFormaldehyde() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, store = this.store,
        handlers = this.handlers = [], hand, pipet, bottle;

      this.flags = [];

      hand = this.hand = scene.hand;
      pipet = this.pipet = store.pipet ?  scene[store.pipet] : scene.pipet;

      bottle = this.bottle = scene.beakers[store.beaker];
      //bottle.fix();
      bottle.start();


      //scene.setChildIndex(pipet, scene.getChildIndex(bottle) - 1);

      handlers[0] = this.onClick.bind(this);
      hand.addEventListener('click', handlers[0]);

      //this.flags[0] = store.rightNow;


      bottle.visible = true;
      hand.set({visible:true, y:pipet.y - 20});


      Tween.get(hand).to({y:bottle.y-270, x: bottle.x},500);
      Tween.get(pipet).to({y:bottle.y-250, x: bottle.x+10},500);
    },

    stop: function() {
      var bottle = this.bottle, hand = this.hand;
      bottle.stop();
      hand.visible = false;
      hand.gotoAndStop('down');
      //this.scene.setChildIndex(bottle, bottle.index);
      hand.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    update: function(event) {
      var volume, delta, hand = this.hand, bottle = this.bottle, pipet = this.pipet,
        target = 0, showLabel = this.store.showLabel;

      bottle.refresh();
      if (this.flags[0] && !this.flags[1]) {
        volume = pipet.store('volume');
        delta = event.delta / 1000;
        if (volume <= target) {
          volume = target;
          this.flags[1] = true;
          hand.gotoAndStop('down');

//                if (remain) {



          if (showLabel) {
            pipet.hideLabel();
          }
          //if (volume<=0) {
//          Tween.get(bottle)
//            .to({
//              x: bottle.location.x,
//              y: bottle.location.y
//            },500);

            Tween.get(pipet)
              .to({
                x: pipet.location.x,
                y: pipet.location.y,
                rotation: -90
              },500).call(this.stop.bind(this));
          //}

        } else {
          volume -= delta;
        }
        if (showLabel) {
          pipet.showLabel();
        }
        pipet.store('volume', volume);
        bottle.store('volume', bottle.store('volume') + delta );
      }
    },

    onClick: function() {
      if (this.flags[0] ) { return; }
      this.flags[0] = true;
      this.hand.gotoAndStop('up');
    }
  });
})();

//##############################################################################
// src/steps/Step_StartStirrer.js
//##############################################################################
ENJ.Step_StartStirrer = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * �?启磁力搅拌器
     * �?用：烧杯、电极�?�转子�?�磁力搅拌器
     *
     * @constructor
     */
    constructor: function Step_StartStirrer() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var self = this, scene = self.scene, store = self.store,
        handlers = self.handlers = [], stirrer, beaker, electrode;

      stirrer = this.stirrer = scene.stirrer;
      electrode = this.electrode = scene.phElectrode;
      beaker = this.beaker = scene.beakers[store.beaker];
      this.rotor = scene.rotors[store.rotor];
      this.curve = scene.curve;

      this.flag = false;

      handlers[0] = this.onClickStirrer.bind(this);
      stirrer.addEventListener('click', handlers[0]);

      stirrer.cursor = 'pointer';

      Tween.get(beaker)
        .to({x:630,y:450},500)
        .call(function() {
          self.flag = true;
        });
      Tween.get(electrode)
        .to({y:electrode.location.y-150},500)
        .to({y:electrode.location.y},500);
    },

    stop: function() {
      this.curve.update(this.electrode, new CRE.Point(800,480));
      this.stirrer.cursor = 'auto';
      this.stirrer.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    update: function() {
      this.curve.update(this.electrode, new CRE.Point(800,480));
    },

    onClickStirrer: function() {
      if (!this.flag) { return; }
      this.stirrer.start();
      this.rotor.gotoAndPlay(0);
      this.stop();
    }
  });
})();

//##############################################################################
// src/steps/Step_StopStirrer.js
//##############################################################################
ENJ.Step_StopStirrer = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 关闭磁力搅拌�?
     * �?用：烧杯、电极�?�转子�?�磁力搅拌器
     *
     * @constructor
     */
    constructor: function Step_StopStirrer() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, store = this.store,
        handlers = this.handlers = [];

      this.stirrer = scene.stirrer;
      this.phElectrode = scene.phElectrode;
      this.beaker = scene.beakers[store.beaker];
      this.rotor = scene.rotors[store.rotor];
      this.curve = scene.curve;

      this.stirrer.cursor = 'pointer';

      this.flag = false;


      handlers[0] = this.onClickStirrer.bind(this);
      this.stirrer.addEventListener('click', handlers[0]);
    },

    stop: function() {
      this.curve.update(this.phElectrode, new CRE.Point(800,480));
      this.stirrer.cursor = 'auto';
      this.stirrer.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    update: function() {
      this.curve.update(this.phElectrode, new CRE.Point(800,480));
    },

    onClickStirrer: function() {
      if (this.flag) { return; }

      this.flag = true;
      this.stirrer.stop();
      this.rotor.gotoAndStop(0);

      var beaker = this.beaker;

      Tween.get(this.phElectrode)
        .to({y:this.phElectrode.location.y-150},500)
        .call(function(){
          Tween.get(beaker)
            .to({x:400,y:1000},500)
            .call(function(){
              beaker.visible = false;
              //@todo remove this beaker from scene
            });
        })
        .wait(500)
        .to({y:this.phElectrode.location.y},500)
        .call(this.stop.bind(this));
    }
  });
})();

//##############################################################################
// src/steps/Step_CorrectPHInstrument.js
//##############################################################################
ENJ.Step_CorrectPHInstrument = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 校准PH�?
     * �?用：PH�?
     *
     * @constructor
     */
    constructor: function Step_CorrectPHInstrument() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, store = this.store, handlers = this.handlers = [];

      var phInstrument = this.phInstrument = scene.phInstrument;

      handlers[0] = this.onCorrect.bind(this);
      phInstrument.addEventListener('correct', handlers[0]);
      phInstrument.start();
      phInstrument.willCorrect();
    },

    stop: function() {
      var phInstrument = this.phInstrument;
      phInstrument.removeEventListener('correct', this.handlers[0]);
      phInstrument.stop();
      base.stop.call(this);
    },

    onCorrect: function() {
      var phInstrument = this.phInstrument;
      phInstrument.store('number','CAXXXX');
      Tween.get(phInstrument)
        .wait(2000)
        .call(this.stop.bind(this));
      //this.stop();
    }
  });
})();

//##############################################################################
// src/steps/Step_WashPipe.js
//##############################################################################
ENJ.Step_WashPipe = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 润洗移液�?
     * �?用：移液管�?�手
     *
     * @constructor
     */
    constructor: function Step_WashPipe() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, store = this.store,
      //handlers = this.handlers = [],
        pipe, hand;//, ball, beaker;

      pipe = this.pipe = scene[store.pipe];
      hand = this.hand = scene.hand;
      //ball = this.ball = scene.suckBall;
      //beaker = this.beaker = scene.bigBeaker;

      //scene.setChildIndex(ball, scene.getChildIndex(pipe) - 1);

      this.flags = [];

      //handlers[0] = this.onClickBall.bind(this);
      //ball.addEventListener('mousedown', handlers[0]);
      //ball.addEventListener('pressup', handlers[0]);

      /*Tween.get(hand)
       .to({x:0,y:0,rotation:90},500)
       .call(function(){hand.visible=false;});*/

      hand.visible=false;

      Tween.get(pipe)
        .to({x:400,y:500,regX:7,regY:150,rotation:90},500)
        .to({rotation:95},300)
        .to({rotation:85},300)
        .to({rotation:95},300)
        .to({rotation:85},300)
        .to({x:335,y:200,regX:0,regY:0,rotation:0},500)
        .call(this.stop.bind(this));

      /*Tween.get(beaker)
       .wait(2000)
       .to({x:300,y:500}, 500);*/


    },

    stop: function() {
      //var ball = this.ball, handlers = this.handlers;

      //this.scene.setChildIndex(ball, ball.index);
      //ball.removeEventListener('mousedown', handlers[0]);
      //ball.removeEventListener('pressup', handlers[0]);

      base.stop.call(this);
    },

    update: function(event) {
      //var pipe = this.pipe, beaker = this.beaker, volume, stop;
      this.pipe.refresh();
//        if (this.flags[0]) {
//            volume = pipe.store('volume');
//            if (volume <= 0) {
//                volume = 0;
//                //stop = this.stop.bind(this);
//                Tween.get(beaker)
//                    .wait(500)
//                    .to({ x: beaker.location.x, y: beaker.location.y }, 500)
//                    .call(this.stop.bind(this));
//
//            } else {
//                volume -= event.delta/200;
//            }
//            pipe.store('volume', volume);
//        }
    }
  });
//    onClickBall = function(event) {
//        var ball = this.ball;
//        if (!ball.active) { return; }
//        switch (event.type) {
//            case 'mousedown':
//                ball.scale();
//                this.flags[0] = true;
//                break;
//            case 'pressup':
//                ball.stop();
//                ball.suck();
//                Tween.get(ball)
//                    .to({x:ball.location.x, y:ball.location.y, rotation:0},500);
//                /*if (ball.active) {
//                    ball.suck();
//                    flags[1] = true;
//                } else if (pipe.active) {
//                    ball.start();
//                    Tween.get(ball).to({
//                        x: pipe.x + 8, y: pipe.y, rotation: 180
//                    }, 500, Ease.sineInOut);
//                }*/
//
//                break;
//        }
//    };

  //return Step_WashPipe;
})();

//##############################################################################
// src/steps/Step_EmptyPipet.js
//##############################################################################
ENJ.Step_EmptyPipet = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    /**
     * 排空移液�?
     * �?用：移液管�?�吸球�?�大烧杯
     *
     * @constructor
     */
    constructor: function Step_EmptyPipet() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, store = this.store,
        handlers = this.handlers = [],
        pipet, hand, ball, beaker;

//      pipet = this.pipet = scene.pipet;
      pipet = this.pipet = store.pipet ?  scene[store.pipet] : scene.pipet;
      //hand = this.hand = scene.hand;
      ball = this.ball = scene.suckBall;
      beaker = this.beaker = scene.bigBeaker;

      scene.setChildIndex(ball, scene.getChildIndex(pipet) - 1);

      this.flags = [];

      handlers[0] = this.onClickBall.bind(this);
      ball.addEventListener('mousedown', handlers[0]);
      ball.addEventListener('pressup', handlers[0]);
      ball.cursor = 'pointer';
      /*Tween.get(hand)
       .to({x:0,y:0,rotation:90},500)
       .call(function(){hand.visible=false;});*/

      //hand.visible = false;

      /*Tween.get(pipet)
       .to({x:400,y:400,regX:7,regY:150,rotation:90},500)
       .to({rotation:95},300)
       .to({rotation:85},300)
       .to({rotation:95},300)
       .to({rotation:85},300)
       .to({x:335,y:200,regX:0,regY:0,rotation:0},500)
       .call(function() {
       ball.start();
       Tween.get(ball)
       .wait(200)
       .to({x:pipet.x+7,y:pipet.y,rotation:180},500);
       });*/


      Tween.get(ball)
        .wait(200)
        .to({x:pipet.x+7,y:pipet.y,rotation:180},500)
        .call(function() {
          ball.start();
        });

      Tween.get(beaker)
        .to({x:300,y:500}, 500);


    },

    stop: function() {
      var ball = this.ball, handlers = this.handlers;

      this.scene.setChildIndex(ball, ball.index);
      ball.removeEventListener('mousedown', handlers[0]);
      ball.removeEventListener('pressup', handlers[0]);
      ball.cursor = 'auto';
      console.log("1111111111");
      base.stop.call(this);
    },

    update: function(event) {
      var pipet = this.pipet, beaker = this.beaker, volume, stop;
      pipet.refresh();
      if (this.flags[0] && !this.flags[1]) {
        volume = pipet.store('volume');
        if (volume <= 0) {
          volume = 0;
          this.flags[1] = true;
          //stop = this.stop.bind(this);
          if (this.store.remain) {
            //Tween.get(hand).wait(500).to({y:bottle.y-320},500);
            Tween.get(pipet).wait(500)
              .to({y:beaker.y-400},500);
          } else {
            Tween.get(pipet)
              .to({
                x: pipet.location.x,
                y: pipet.location.y,
                rotation: -90
              },500);
          }

          Tween.get(beaker)
            .wait(500)
            .to({ x: beaker.location.x, y: beaker.location.y }, 500)
            .call(this.stop.bind(this));

        } else {
          volume -= event.delta/200;
        }
        pipet.store('volume', volume);
      }
    },

    onClickBall: function(event) {
      var ball = this.ball;
      if (!ball.active) { return; }
      switch (event.type) {
        case 'mousedown':
          ball.scale();
          this.flags[0] = true;
          break;
        case 'pressup':
          ball.stop();
          ball.suck();
          Tween.get(ball)
            .to({x:ball.location.x, y:ball.location.y, rotation:0},500);
          /*if (ball.active) {
           ball.suck();
           flags[1] = true;
           } else if (pipet.active) {
           ball.start();
           Tween.get(ball).to({
           x: pipet.x + 8, y: pipet.y, rotation: 180
           }, 500, Ease.sineInOut);
           }*/

          break;
      }
    }
  });
})();

/**
 * Created by asus-rain on 2016/8/10 0010.
 */
//##############################################################################
// src/steps/Step_EmptyPipet.js
//##############################################################################
ENJ.Step_EmptyPipet8 = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    /**
     * �ſ���Һ��
     * ���ã���Һ�ܡ����򡢴��ձ�
     *
     * @constructor
     */
    constructor: function Step_EmptyPipet() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var scene = this.scene, store = this.store,
        handlers = this.handlers = [],
        pipet, hand, ball, beaker;

//      pipet = this.pipet = scene.pipet;
      pipet = this.pipet = store.pipet ?  scene[store.pipet] : scene.pipet;
      //hand = this.hand = scene.hand;
      ball = this.ball = scene.suckBall;
      beaker = this.beaker = scene.bigBeaker;

      scene.setChildIndex(ball, scene.getChildIndex(pipet) - 1);

      this.flags = [];

      handlers[0] = this.onClickBall.bind(this);
      ball.addEventListener('mousedown', handlers[0]);
      ball.addEventListener('pressup', handlers[0]);
      ball.cursor = 'pointer';
      /*Tween.get(hand)
       .to({x:0,y:0,rotation:90},500)
       .call(function(){hand.visible=false;});*/

      //hand.visible = false;

      /*Tween.get(pipet)
       .to({x:400,y:400,regX:7,regY:150,rotation:90},500)
       .to({rotation:95},300)
       .to({rotation:85},300)
       .to({rotation:95},300)
       .to({rotation:85},300)
       .to({x:335,y:200,regX:0,regY:0,rotation:0},500)
       .call(function() {
       ball.start();
       Tween.get(ball)
       .wait(200)
       .to({x:pipet.x+7,y:pipet.y,rotation:180},500);
       });*/


      Tween.get(ball)
        .wait(200)
        .to({x:pipet.x+7,y:pipet.y,rotation:180},500)
        .call(function() {
          ball.start();
        });

      /*Tween.get(beaker)
       .to({x:300,y:500}, 500); */


    },

    stop: function() {
      var ball = this.ball, handlers = this.handlers;

      this.scene.setChildIndex(ball, ball.index);
      ball.removeEventListener('mousedown', handlers[0]);
      ball.removeEventListener('pressup', handlers[0]);
      ball.cursor = 'auto';
      console.log("1111111111");
      base.stop.call(this);
    },

    update: function(event) {
      var pipet = this.pipet, beaker = this.beaker, volume, stop;
      var self=this;
      pipet.refresh();
      if (this.flags[0] && !this.flags[1]) {
        volume = pipet.store('volume');
        if (volume <= 0) {
          volume = 0;
          this.flags[1] = true;
          //stop = this.stop.bind(this);
          if (this.store.remain) {
            //Tween.get(hand).wait(500).to({y:bottle.y-320},500);
            Tween.get(pipet).wait(500)
              .to({x:335,y:200},500).call(function(){self.stop()});
          } else {
            Tween.get(pipet)
              .to({
                x: pipet.location.x,
                y: pipet.location.y,
                rotation: -90
              },500);
          }

          /*Tween.get(beaker)
           .wait(500)
           .to({ x: beaker.location.x, y: beaker.location.y }, 500)
           .call(this.stop.bind(this));*/

        } else {
          volume -= event.delta/200;
        }
        pipet.store('volume', volume);
      }
    },

    onClickBall: function(event) {
      var ball = this.ball;
      if (!ball.active) { return; }
      switch (event.type) {
        case 'mousedown':
          ball.scale();
          this.flags[0] = true;
          break;
        case 'pressup':
          ball.stop();
          ball.suck();
          Tween.get(ball)
            .to({x:ball.location.x, y:ball.location.y, rotation:0},500);
          /*if (ball.active) {
           ball.suck();
           flags[1] = true;
           } else if (pipet.active) {
           ball.start();
           Tween.get(ball).to({
           x: pipet.x + 8, y: pipet.y, rotation: 180
           }, 500, Ease.sineInOut);
           }*/

          break;
      }
    }
  });
})();

//##############################################################################
// src/steps/Step_DumpToCylinder.js
//##############################################################################
ENJ.Step_DumpToCylinder = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 向量筒中加水
     * �?用：蒸馏水�?�量�?
     *
     * @constructor
     */
    constructor: function Step_DumpToCylinder() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var self = this, scene = self.scene,
        handlers = self.handlers = [];

      self.cylinder = scene.cylinder;
      self.bottle = scene.waterBottle;

      self.flags = [];

      handlers[0] = self.onClick.bind(self);
      self.bottle.addEventListener('click', handlers[0]);
      self.bottle.cursor = 'pointer';

      scene.setChildIndex(self.cylinder, scene.getChildIndex(self.bottle) + 1);

      Tween.get(self.bottle)
        .to({x: 400, y: 360}, 500);
      Tween.get(self.cylinder)
        .to({x: 300, y: 300}, 500)
        .call(function() {
          self.cylinder.start();
        });
    },

    stop: function() {
      var self = this;
      self.bottle.stop();
      self.bottle.cursor = 'auto';
      self.bottle.removeEventListener('click', self.handlers[0]);
      base.stop.call(this);
    },

    update: function(event) {
      var self = this, cylinder = self.cylinder, bottle = self.bottle,
        target = self.store.volume, volume;
      if (self.flags[0] && !self.flags[1]) {
        volume = cylinder.store('volume');
        if (volume >= target) {
          self.flags[1] = true;
          volume = target;
          Tween.get(bottle)
            .to({
              x: bottle.location.x,
              y: bottle.location.y,
              rotation: 0
            }, 500)
            .call(function() {
              self.stop();
            });
        } else {
          volume += event.delta/100;
        }
        cylinder.store('volume', volume);
      }
    },

    onClick: function() {
      var self = this;//, cylinder = self.cylinder;
      if (!self.cylinder.active || self.bottle.active) {return;}

      self.bottle.start();
      Tween.get(self.bottle)
        .to({x: 340, y: 270, rotation: -30}, 500)
        .call(function() {
          self.flags[0] = true;
        })
        .wait(2000);
    }
  });
})();

//##############################################################################
// src/steps/Step_DumpFromCylinder.js
//##############################################################################
ENJ.Step_DumpFromCylinder = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
    
  return ENJ.defineClass({
    /**
     * 倒出量筒中液�?
     * �?用：量筒、烧�?
     * 
     * @constructor
     */
    constructor: function Step_DumpFromCylinder() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var self = this, scene = self.scene, store = self.store,
        handlers = this.handlers = [];

      var cylinder = self.cylinder = scene.cylinder;
      var beaker = self.beaker = scene.beakers[store.beaker];


      Tween.get(beaker)
        .to({x: 200, y: 500}, 500)
        .call(function() {
          beaker.start();
        });

//    Tween.get(cylinder)
//      .to({x: 240, y: 450}, 500);

      this.flags = [];
      handlers[0] = self.onClick.bind(self);
      cylinder.addEventListener('click', handlers[0]);

      cylinder.cursor = 'pointer';
    },

    stop: function() {
      var self = this, cylinder = self.cylinder;

      //self.beaker.stop();
      cylinder.stop();
      cylinder.removeEventListener('click', self.handlers[0]);
      cylinder.cursor = 'auto';
      self.scene.setChildIndex(cylinder, cylinder.index);

      base.stop.call(this);
    },

    update: function(event) {
      var self = this, cylinder = self.cylinder, beaker = self.beaker, volume, delta;
      cylinder.refresh();
      if (self.flags[0] && !self.flags[1]) {
        delta = event.delta / 50;
        volume = cylinder.store('volume');
        if (volume<=0){
          volume = 0;
          self.flags[1] = true;
          Tween.get(cylinder)
            .to({
              x: cylinder.location.x,
              y: cylinder.location.y,
              rotation: 0
            }, 500)
            .call(function() {
              self.stop();
            });

        } else {
          volume -= delta;
        }
        cylinder.store('volume', volume);
        beaker.store('volume', beaker.store('volume') + delta);
      }
    },

    onClick: function() {
      var self = this;
      if (!self.beaker.active) { return; }
      Tween.get(self.cylinder)
        .to({x: 240, y: 500, rotation: -85}, 500)
        .call(function() {
          self.flags[0] = true;
        })
        .to({rotation: -90}, 1000);

    }
  });
})();

//##############################################################################
// src/steps/Step_DumpToBuret.js
//##############################################################################
ENJ.Step_DumpToBuret = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  return ENJ.defineClass({
    /**
     * 向滴定管中注入试�?
     * �?用：滴定管�?�试剂瓶、盖�?
     *
     * @constructor
     */
    constructor: function Step_DumpToBuret() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      Step.prototype.start.call(this);
      var self = this, scene = self.scene;

      //self.cap = scene.cap;
      self.buret = scene.buret;
      self.bottle = scene.reagenBottle;

      scene.setChildIndex(self.bottle, scene.getChildIndex(self.buret) - 1);

      self.flags = [];
      self.handlers = [];
      self.handlers[0] = self.onClick.bind(self);
      self.bottle.addEventListener('click', self.handlers[0]);
      self.bottle.cursor = 'pointer';

//      Tween.get(self.cap)
//        .to({rotation: -90}, 500)
//        .to({x: 650, y: 450, rotation: -180}, 500);

      Tween.get(self.buret)
        .to({x: 400, y: 400, rotation: 30}, 500);

      self.bottle.start();
      Tween.get(self.bottle)
        .to({x: 400, y: 415, rotation: -30}, 500)
        /*.call(function() {
          self.bottle.start();
        })*/;
    },
    stop: function() {
      var self = this, scene = self.scene, bottle = self.bottle;
      scene.setChildIndex(bottle, bottle.index);
      bottle.removeEventListener('click', self.handlers[0]);
      bottle.cursor = 'auto';
      bottle.refresh();
      bottle.stop();

      Step.prototype.stop.call(this);
    },
    update: function(event) {
      var self = this,
        buret = self.buret, bottle = self.bottle,
        target = self.store.volume, volume, delta;
      buret.refresh();
      bottle.refresh();
      if (self.flags[0] && !self.flags[1]) {
        delta = event.delta / 100;
        volume = buret.store('volume');

        if (volume >= target) {
          volume = target;
          self.flags[1] = true;
          Tween.get(bottle)
            .to({
              x: bottle.location.x,
              y: bottle.location.y,
              rotation: 0
            }, 500)
            .call(function() {
              self.stop();
            });
//          Tween.get(cap)
//            .to({
//              x: cap.location.x,
//              y: cap.location.y,
//              rotation: -90
//            }, 500)
//            .to({rotation: 0}, 500);
        } else {
          volume += delta;
        }
        bottle.store('volume', bottle.store('volume') - delta);
        buret.store('volume', volume);
      }
    },
    onClick: function() {
      var self = this;
      if (self.flags[0]) { return; }
      self.flags[0] = true;
      Tween.get(self.bottle)
        .to({rotation: -45}, 250)
        .to({rotation: -56}, 600);
    }
  });
})();

//##############################################################################
// src/steps/Step_BlowBuret.js
//##############################################################################
ENJ.Step_BlowBuret = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;
  
  return ENJ.defineClass({
    /**
     * 将移液管中液体慢慢注入容�?
     * �?用：手�?�移液管、容�?
     *
     * @constructor
     */
    constructor: function Step_BlowBuret() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var self = this, scene = self.scene, store = self.store, drop,
        handlers = self.handlers = [], hand, buret, bottle;

      self.flags = [];

      hand = self.hand = scene.hand;
      buret = self.buret = scene.buret;
      bottle = self.bottle = scene[store.bottle];

      //scene.setChildIndex(buret, scene.getChildIndex(bottle) - 1);

      handlers[0] = self.onClick.bind(self);
      hand.addEventListener('mousedown', handlers[0]);
      hand.addEventListener('pressup', handlers[0]);

      Tween.get(buret)
        .to({x: 335, y: 10, rotation: 0}, 500);

      if ( !store.remain ) {
        Tween.get(bottle)
          .to({
            x: 335 ,
            y: 10 + 500
          }, 500);
      }

      hand.set({
        visible: true,
        scaleX: -1,
        x: 335 + 30,
        y: 10 + 400
      });
      hand.gotoAndStop('up');
    },

    stop: function() {
      var self = this, bottle = self.bottle, hand = self.hand;
      bottle.stop();
      hand.set({visible: false, scaleX: 1});

      hand.removeEventListener('mousedown', self.handlers[0]);
      hand.removeEventListener('pressup', self.handlers[0]);
      //hand.gotoAndStop('down');
      //this.scene.setChildIndex(bottle, bottle.index);
      //hand.removeEventListener('click', this.handlers[0]);
      base.stop.call(this);
    },

    update: function(event) {
      var self = this, volume, delta,
        bottle = self.bottle, buret = self.buret,
        target = self.store.volume;

      buret.refresh();
      if (this.flags[0] && !this.flags[1]) {
        volume = buret.store('volume');
        delta = event.delta / 100;
        if (volume <= target) {
          volume = target;
          this.flags[1] = true;
          if (!self.store.remain){
            Tween.get(bottle)
              .to({
                x: bottle.location.x,
                y: bottle.location.y
              }, 500)
              .call(function() {
                self.stop();
              });
          } else {
            self.stop();
          }

        } else {
          volume -= delta;
        }

        buret.store('volume', volume);
        if (!self.store.remain){
          bottle.store('volume', bottle.store('volume') + delta * 0.1);
        } else {
          //TODO
        }

      }
    },

    onClick: function(event) {
      var self = this, hand = self.hand;
      switch (event.type) {
        case 'mousedown':
          self.flags[0] = true;
          hand.gotoAndStop('down');
          break;
        case 'pressup':
          self.flags[0] = false;
          hand.gotoAndStop('up');
          break;
      }
    }
  });
})();
//##############################################################################
// src/steps/Step_InstallBuret.js
//##############################################################################
ENJ.Step_InstallBuret = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  return ENJ.defineClass({
    constructor: function Step_InstallBuret() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      Step.prototype.start.call(this);
      var self = this, scene = self.scene, store = self.store;

      var stand = scene.titrationStand;
      var buret = scene.buret;

      Tween.get(stand)
        .to({x: 518, y: 50}, 500)
        /*.call(function() {
          stand.start();
        })*/;

      Tween.get(buret)
        .wait(500)
        .to({x: 600, y: -50}, 500)
        .call(function() {
          stand.start();
          self.stop();
        });
    }/*,

    stop: function() {

      Step.prototype.stop.call(this);
    }*/
  });
})();

//##############################################################################
// src/steps/Step_DropFromBuret.js
//##############################################################################
ENJ.Step_DropFromBuret = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  function Step_DropFromBuret() {
    Step.apply(this, arguments);
  }

  var base = Step.prototype,
    pt = Step_DropFromBuret.prototype = Object.create(base);

  pt.constructor = Step_DropFromBuret;

  pt.start = function() {
    base.start.call(this);
    var self = this, scene = self.scene;

    self.stand = scene.titrationStand;
    var buret = self.buret = scene.buret;
    var hand = self.hand = scene.hand;
    //var stand = self.stand = scene.titrationStand;
    var drop = self.drop = scene.drop;
    var phInstrument = self.phInstrument = scene.phInstrument;

    drop.set({x: buret.x + 40, y: buret.y + 500});
    scene.setChildIndex(drop, scene.getChildIndex(scene.beaker)-1);
    self.tween = Tween.get(drop, { loop: true, paused: true }).to({y: drop.y + 80}, 500);
    //self.tween.pause();

    self.flags = [];
    var handlers = self.handlers = [];
    handlers[0] = self.onClick.bind(self);
    hand.addEventListener('mousedown', handlers[0]);
    hand.addEventListener('pressup', handlers[0]);

    hand.set({
      visible: true,
      scaleX: -1,
      x: buret.x + 30,
      y: buret.y + 400
    });

    //handlers[0] = this.onCorrect.bind(this);
    //phInstrument.addEventListener('read', handlers[0]);
    phInstrument.start();
    //phInstrument.willRead();

    this.originVolume = buret.store('volume');
  };

  pt.stop = function() {
    var hand = this.hand, handlers = this.handlers;
    hand.removeEventListener('mousedown', handlers[0]);
    hand.removeEventListener('pressup', handlers[0]);
    //this.phInstrument.stop();
    this.drop.visible = false;
    this.tween.setPaused(true);

    base.stop.call(this);
  };

  pt.update = function(event) {
    var self = this, buret = self.buret, stand = self.stand,
      target = self.store.volume, pHs = self.store.pHs, volume, delta;
    buret.refresh();
    if (self.drop.visible && !self.flags[1]) {
      delta = event.delta / 1000;
      volume = buret.store('volume');

      var num =  (this.originVolume - volume) / (this.originVolume - target);// * 100;

//      self.phInstrument.store('number', '' + num.toFixed(2) + '%');
      self.phInstrument.store('number', (pHs[0] + num * (pHs[1] - pHs[0])).toFixed(1));

      if (volume <= target){
        volume = target;
        self.flags[1] = true;
        self.drop.visible = false;
        self.hand.set({
          visible: false,
          scaleX: 1
        });

        if (!self.store.remain) {
          Tween.get(buret)
            .to({
              x: buret.location.x,
              y: buret.location.y,
              rotation: 0
            }, 500)
            .call(function() {
              self.phInstrument.stop();
              self.stop();
            });
          Tween.get(stand)
            .to({
              x: stand.location.x,
              y: stand.location.y,
            }, 500)
        } else {
          self.phInstrument.store('number', pHs[1].toFixed(1));
          self.stop();
        }

      } else {
        volume -= delta;
      }
      buret.store('volume', volume);
      //beaker.store('volume', beaker.store('volume') + delta);
    }

    /*if (self.flags[0]) {
      if (!self.drop.visible) {
        self.drop.visible = true;
        self.tween.setPaused(false);
        self.tween.setPosition(0);
      }
    } else {
      if (self.tween.position<200) {
        self.drop.visible = false;
        self.tween.setPaused(true);
      }
    }*/
  };

  pt.onClick = function(event) {
    var self = this, hand = self.hand;
    switch (event.type) {
      case 'mousedown':
        hand.gotoAndStop('down');
        //self.flags[0] = true;
        self.drop.visible = true;
        self.tween.setPaused(false);
        break;
      case 'pressup':
        hand.gotoAndStop('up');
        //self.flags[0] = false;
        self.drop.visible = false;
        self.tween.setPaused(true);
        break;
    }
  };

  return Step_DropFromBuret;
})();

//##############################################################################
// src/steps/Step_Interlude_1.js
//##############################################################################
ENJ.Step_Interlude_1 = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    /**
     * 过场
     * �?用：
     *
     * @constructor
     */
    constructor: function Step_Interlude_1() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var self = this, scene = this.scene, store = this.store, board = scene.board;

      board.store('title', store.title);
      board.visible = true;
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

//##############################################################################
// src/steps/Step_Interlude_2.js
//##############################################################################
ENJ.Step_Interlude_2 = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    /**
     * 过场
     * �?用：
     *
     * @constructor
     */
    constructor: function Step_Interlude_2() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var self = this, scene = this.scene, rotors = scene.rotors, beakers = scene.beakers,
        store = this.store, board = scene.board;

      board.store('title', store.title);
      board.visible = true;
      Tween.get(board)
        .to({ alpha: 1.0 }, 500)
        .call( function() {
          scene.addChild(rotors[0]);
          scene.addChild(rotors[1]);
          scene.setChildIndex(rotors[0], rotors[0].index);
          scene.setChildIndex(rotors[1], rotors[1].index);

          rotors[0].set(rotors[0].location);
          rotors[1].set(rotors[1].location);

          var i, beaker;
          for (i = 0; i < beakers.length; i += 2) {
            beaker = beakers[i];
            beaker.visible = true;
            beaker.set(beaker.location);
            beaker.store('volume',0);
          }
        })
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

//##############################################################################
// src/steps/Step_Interlude_3.js
//##############################################################################
ENJ.Step_Interlude_3 = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    /**
     * 过场
     * �?用：
     *
     * @constructor
     */
    constructor: function Step_Interlude_3() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var self = this, scene = this.scene, store = this.store,
        rotors = scene.rotors, beakers = scene.beakers, board = scene.board, flasks = scene.volumetricFlasks;

      board.store('title', store.title);
      board.visible = true;
      Tween.get(board)
        .to({ alpha: 1.0 }, 500)
        .call( function() {
          scene.addChild(rotors[0]);
          scene.addChild(rotors[1]);
          scene.setChildIndex(rotors[0], rotors[0].index);
          scene.setChildIndex(rotors[1], rotors[1].index);

          rotors[0].set(rotors[0].location);
          rotors[1].set(rotors[1].location);

          var i, beaker;
          for (i = 0; i < beakers.length; i += 2) {
            beaker = beakers[i];
            beaker.visible = true;
            beaker.set(beaker.location);
            beaker.store('color', 0x66330000);
            beaker.store('volume',0);
          }

          flasks[1].store('volume', 0);
          flasks[1].visible = true;
          flasks[0].visible = false;
          flasks[2].visible = false;
        })
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

//##############################################################################
// src/steps/Step_Record_2.js
//##############################################################################
ENJ.Step_Record_2 = (function() {
  var Step = ENJ.Step,
    Tween = CRE.Tween;

  var base = Step.prototype;

  return ENJ.defineClass({
    /**
     * 记录实验数据
     * �?用：结果报告
     *
     * @constructor
     */
    constructor: function Step_Record_2() {
      Step.apply(this, arguments);
    }, extend: Step,

    start: function() {
      base.start.call(this);
      var self = this, scene = this.scene, store = this.store, table = scene.table;


      if (!('canClose' in store) || store.canClose) {
        table.addEventListener('close', function() {
          table.removeAllEventListeners('close');
          table.visible = false;
          self.stop();
        })
      }

      delete store.canClose;

      table.store(store);
      table.visible = true;

    },

    stop: function() {
      base.stop.call(this);
    }
  })

})();

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
//##############################################################################
// src/scripts/Script.js
//##############################################################################
ENJ.Script = (function() {
  var EventDispatcher = CRE.EventDispatcher;

  return ENJ.defineClass({
    /**
     * @class Script
     * @extends EventDispatcher
     * @constructor
     */
    constructor: function Script() {
      EventDispatcher.apply(this, arguments);
      this.register();
      this.ready();
    }, extend: EventDispatcher,
    /**
     * @property numSteps
     * @type {Number}
     */
    get numSteps() {
      return this.currentIndex + 1;
    },
    /**
     * Register somethings.
     *
     * @method register
     */
    register: function() {
      this.scene = null;

      this.steps = null;
      this.stores = null;

      this.currentStep = null;
      this.currentIndex = 0;

      this.listener = null;
    },

    /**
     * @method ready
     * @abstract
     */
    ready: function() {},

    /**
     * @method update
     * @param event
     */
    update: function(event) {
      if (this.currentStep && this.currentStep.active) {
        this.currentStep.update(event);
      }
    },

    /**
     * @method start
     */
    start: function() {
      this.listener = this.update.bind(this);

      this.step(0);
      this.scene.addEventListener('tick', this.listener);
    },

    /**
     * @method stop
     */
    stop: function() {
      this.scene.removeEventListener('tick', this.listener);
      this.steps.splice(0);
    },

    /**
     * @method step
     * @param {Number} offset
     */
    step: function(offset) {
      var currentIndex = this.currentIndex, currentStep = this.currentStep;
      //console.log(currentIndex);
      if (currentIndex + offset < 0 || currentIndex + offset > this.steps.length - 1) {
        return;
      }

      if (currentStep) {
        currentStep.removeAllEventListeners();
        if (currentStep.active) {
          currentStep.stop();
        }
      }

      currentIndex = currentIndex + offset;
      //console.log(currentIndex);
      var StepClass = this.steps[currentIndex];
      currentStep = new StepClass({
        scene: this.scene,
        store: this.stores[currentIndex]
      });

      var tip = this.tips[currentIndex];
      if (tip) {
        this.scene.tip.text = '提示�?' + tip;
      } else {
        this.scene.tip.text = '';
      }

      currentStep.addEventListener('complete', this.onStepComplete.bind(this));
      currentStep.start();


      this.currentIndex = currentIndex;
      this.currentStep = currentStep;
    },

    /**
     * Go to the next step.
     *
     * @method next
     */
    next: function() {
      if (this.currentIndex < this.steps.length -1) {
        this.step(1);
      }
    },

    /**
     * Go to the previous step.
     *
     * @method prev
     */
    prev: function() {
      if (this.currentIndex > 0) {
        this.step(-1);
      }
    },

    /**
     * Restart from the first step
     * @method restart
     */
    restart: function() {
      //this.scene.addEventListener('tick', this.refresh.bind(this));
      this.skip(0);
    },

    /**
     * Skip to the step at index.
     *
     * @method skip
     * @param {Number} index
     */
    skip: function(index) {
      this.step(index - this.currentIndex);
    },

    /**
     * Auto go to the next step.
     *
     * @method onStepComplete
     */
    onStepComplete: function() {
      this.next();
      this.dispatchEvent('stepComplete');
    }
  });
})();

//##############################################################################
// src/scripts/Script_3.js
//##############################################################################
ENJ.Script_8 = (function() {
    var Script = ENJ.Script;

    return ENJ.defineClass({
        /**
         * @class Script_3
         * @extends Script
         *
         * @constructor
         */
        constructor: function Script_8() {
            Script.apply( this, arguments );
        }, extend: Script,
        /**
         * @override
         */
        ready: function() {
            var i, n, config, configs, steps = [], stores = [], tips = [];

            configs  = [
                [ENJ.Step_Interlude_1, { title: "亚硝酸盐含量的测�?" }, ''],
               // [ENJ.Step_Test, { title: "亚硝酸盐含量的测�?" }, ''],


                // 润洗
                /*  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 2, remain: false, still: true,ins:true }, "用移液管吸取少量亚硝酸钠标准液样�?"],
                  [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗�?下移液管"],
                  [ENJ.Step_BlowPool, {remain: 2}, "排入废液�?"],
                  [ENJ.Step_EmptyPipet8, { remain: true }, "排入废液�?"],*/
                //取液�?2支试�?
                 // [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true}, "吸取足量亚硝酸钠标准�?"],
                 // [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true }, "留下4ml亚硝酸钠标准�?"],
                  //[ENJ.Step_BlowLiquid, { bottle: 'tube1', volume: 3.5, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true, top:true }, "向干�?的容量瓶中加�?0.5ml的亚硝酸钠标准液样品"],
                 // [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 1.5, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false }, "多余的样品，排入废液�?"],
                /*//取液第三支试�?
                  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true}, "吸取足量亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true }, "留下4ml亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube2', volume: 3, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true }, "向干�?的容量瓶中加�?1ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 1.5, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false }, "多余的样品，排入废液�?"],
                //取液第四支试�?
                  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true}, "吸取足量亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true }, "留下4ml亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube3', volume: 2.5, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true }, "向干�?的容量瓶中加�?1.5ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 1.5, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false }, "多余的样品，排入废液�?"],
                //取液第五支试�?
                  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true}, "吸取足量亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true }, "留下4ml亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube4', volume: 2, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 1, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false }, "多余的样品，排入废液�?"],
                //取液第六支试�?
                  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true}, "吸取足量亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true }, "留下4ml亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube5', volume: 1.5, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true }, "向干�?的容量瓶中加�?2.5ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 0.8, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false }, "多余的样品，排入废液�?"],*/
                //取液第七支试�?
                /* [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true}, "吸取足量亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true }, "留下4ml亚硝酸钠标准�?"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube6', volume: 1, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true }, "向干�?的容量瓶中加�?3ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 0, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:true }, "多余的样品，排入废液�?"],
*/
                //润洗
               /* [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 2, remain: false, still: true,ins:false,act:true }, "用移液管吸取少量对氨基苯磺酸溶液样品"],
                [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗�?下移液管"],
                [ENJ.Step_BlowPool, {remain: 2}, "排入废液�?"],
                [ENJ.Step_EmptyPipet8, { remain: true }, "排入废液�?"],*/

                //取液第一支比色管
               /* [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:true}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:true }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube',act:true},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.8, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false,act:true }, "多余的样品，排入废液�?"],
*/
               /* //取液第二支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube1', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube1',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],


                //取液第三支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube2', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube2',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],


                //取液第四支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube3', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube3',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],
                //取液第五支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube4', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube4',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],

                //取液第六支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube5', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube5',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],*/

              /*  //取液�?7支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube6', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube6',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:true ,act:true}, "多余的样品，排入废液�?"],
*/
               /* //润洗
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 2, remain: false, still: true,ins:false,act:true }, "用移液管吸取少量对氨基苯磺酸溶液样品"],
                [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗�?下移液管"],
                [ENJ.Step_BlowPool, {remain: 2}, "排入废液�?"],
                [ENJ.Step_EmptyPipet8, { remain: true }, "排入废液�?"],*/

                //取液第一支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:true}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:true }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube', volume: 50,act:true }, "补加蒸馏水，定容�?100ml"],//上一步的stop影响了这�?步的start,rotation却没有影�?
                [ENJ.Step_ShakeUp,{flask:'tube',act:true},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.8, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false,act:true }, "多余的样品，排入废液�?"],

               /* //取液第二支比色管
                 [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                 [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                 [ENJ.Step_BlowLiquid, { bottle: 'tube1', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                 [ENJ.Step_ConstantVolume, { flask: 'tube1', volume: 50 ,act:false}, "补加蒸馏水，定容�?100ml"],
                 [ENJ.Step_ShakeUp,{flask:'tube1',act:false},"摇匀比色�?"],
                 [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],

                 //取液第三支比色管
                 [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                 [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                 [ENJ.Step_BlowLiquid, { bottle: 'tube2', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                 [ENJ.Step_ConstantVolume, { flask: 'tube2', volume: 50 ,act:false}, "补加蒸馏水，定容�?100ml"],
                 [ENJ.Step_ShakeUp,{flask:'tube2',act:false},"摇匀比色�?"],
                 [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],


                //取液第四支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube3', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube3', volume: 50 ,act:false}, "补加蒸馏水，定容�?100ml"],
                [ENJ.Step_ShakeUp,{flask:'tube3',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],

                //取液第五支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube4', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube4', volume: 50 ,act:false}, "补加蒸馏水，定容�?100ml"],
                [ENJ.Step_ShakeUp,{flask:'tube4',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],

                //取液第六支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube5', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube5', volume: 50 ,act:false}, "补加蒸馏水，定容�?100ml"],
                [ENJ.Step_ShakeUp,{flask:'tube5',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液�?"],
*/
                //取液第七支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube6', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干�?的容量瓶中加�?2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube6', volume: 50 ,act:false}, "补加蒸馏水，定容�?100ml"],
                [ENJ.Step_ShakeUp,{flask:'tube6',act:false},"摇匀比色�?"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:true ,act:true}, "多余的样品，排入废液�?"]


                /*

               //取样1
               [ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 2, remain: false }, "用移液管吸取少量酱油样品"],
               [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗�?下移液管"],
               [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液�?"],
               [ENJ.Step_EmptyPipet, { remain: true }, "排入废液�?"],
               [ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 2, remain: false }, "再吸取少量酱油样�?"],
               [ENJ.Step_WashPipe, { pipe: 'pipet' }, "二次润洗�?下移液管"],
               [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液�?"],
               [ENJ.Step_EmptyPipet, { remain: true }, "排入废液�?"],
               [ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 6, remain: true }, "吸取足量酱油样品"],
    [ENJ.Step_BlowLiquid, { bottle: 'soySauce', volume: 4, remain: 1, rotation: 20, showLabel: true }, "留下4ml的酱油样�?"],
    [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 2, remain: 1, rotation: 15, offsetX: -20, offsetY: 20, showLabel: true}, "向干�?的容量瓶中加�?2ml的酱油样�?"],
               [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "多余的样品，排入废液�?"],
               [ENJ.Step_EmptyPipet, {}, "多余的样品，排入废液�?"],
               [ENJ.Step_ConstantVolume, { flask: 1, volume: 100 }, "补加蒸馏水，定容�?100ml"],
               [ENJ.Step_ShakeUp, { flask: 1 }, "摇匀"],

               [ENJ.Step_WashElectrode, {}, "清洗PH电极"],
               [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],

               [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 2, remain: false }, "用移液管吸取少量酱油样品"],
               [ENJ.Step_WashPipe, { pipe: 'bigPipet' }, "润洗�?下移液管"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液�?"],
               [ENJ.Step_EmptyPipet, { pipet: 'bigPipet',remain: true }, "排入废液�?"],
               [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 2, remain: false }, "再吸取少量酱油样�?"],
               [ENJ.Step_WashPipe, { pipe: 'bigPipet' }, "二次润洗�?下移液管"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液�?"],
               [ENJ.Step_EmptyPipet, { pipet: 'bigPipet', remain: true }, "排入废液�?"],
               [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 6, remain: true }, "吸取足量的酱油样�?"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 5, remain: 1, rotation: 15, offsetX: 10, offsetY: 60, showLabel: true }, "留下25ml的酱油样�?"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', beaker: 0, volume: 0, scale: 5, remain: 0, offsetX: 90, offsetY: 120, rotation:15 }, "向干�?烧杯中加�?25ml的酱油样�?"],

               //测定1
               [ENJ.Step_AddRotor, { beaker: 0, rotor: 1 }, "加入�?颗转�?"],
               [ENJ.Step_StartStirrer, { beaker: 0, rotor: 1 }, "打开电子搅拌器，�?始自动搅�?"],
               [ENJ.Step_DumpToBuret, {volume: 20}, "向滴定管中加入少量氢氧化钠溶�?"],
               [ENJ.Step_WashPipe, { pipe: 'buret' }, "润洗�?下滴定管"],
               [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 0 }, "排入废液�?"],
               [ENJ.Step_DumpToBuret, {volume: 20}, "再向滴定管中加入少量氢氧化钠溶液"],
               [ENJ.Step_WashPipe, { pipe: 'buret' }, "二次润洗�?下滴定管"],
               [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 0 }, "排入废液�?"],
               [ENJ.Step_DumpToBuret, {volume: 82}, "向滴定管中加入足量氢氧化钠溶�?"],
               [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 80 }, "滴定管中液面降至零刻度线"],
               [ENJ.Step_InstallBuret, {}, "夹好滴定�?"],
               [ENJ.Step_DropFromBuret, {volume: 70, remain: true, pHs: [6.2, 8.2]}, "滴定..."],

               [ENJ.Step_Record_2, { v1_1: 16.41 }, '记录第一次滴定体�?'],

               //加甲�?
               [ENJ.Step_SuckLiquid, { pipet: 'pipet2', bottle: 'formaldehyde', volume: 6, remain: false, showLabel: true }, "吸取足量的酱油样�?"],
               [ENJ.Step_AddFormaldehyde, { pipet: 'pipet2', beaker: 0, volume: 0}, "向干�?烧杯中加�?25ml的酱油样�?"],

               [ENJ.Step_DropFromBuret, {volume: 60, pHs: [8.2, 9.2]}, "滴定..."],
               [ENJ.Step_StopStirrer, { beaker: 0, rotor: 1 }, "关闭电子搅拌�?"],

               [ENJ.Step_Record_2, { v1_2: 16.41, v1_m: 0 }, '记录第一次滴定体�?'],


               [ENJ.Step_Interlude_1, {title: "第二次取样和测试"}, ''],
               //取样2
               [ENJ.Step_WashElectrode, {}, "清洗PH电极"],
               [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],

               [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 6, remain: true }, "吸取足量的酱油样�?"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 5, remain: 1, rotation: 15, offsetX: 10, offsetY: 60, showLabel: true }, "留下25ml的酱油样�?"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', beaker: 2, volume: 0, scale: 5, remain: 0, offsetX: 90, offsetY: 120, rotation:15 }, "向干�?烧杯中加�?25ml的酱油样�?"],


               //测定2
               [ENJ.Step_AddRotor, { beaker: 2, rotor: 0 }, "加入�?颗转�?"],
               [ENJ.Step_StartStirrer, { beaker: 2, rotor: 0 }, "打开电子搅拌器，�?始自动搅�?"],
               [ENJ.Step_DumpToBuret, {volume: 82}, "向滴定管中加入足量氢氧化钠溶�?"],
               [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 80 }, "滴定管中液面降至零刻度线"],
               [ENJ.Step_InstallBuret, {}, "夹好滴定�?"],
               [ENJ.Step_DropFromBuret, {volume: 70, remain: true, pHs: [6.2, 8.2]}, "滴定..."],

               [ENJ.Step_Record_2, { v2_1: 16.42 }, '记录第二次滴定体积，求出平均�?'],

               //加甲�?
               [ENJ.Step_SuckLiquid, { pipet: 'pipet2', bottle: 'formaldehyde', volume: 6, remain: false, showLabel: true }, "吸取足量的酱油样�?"],
               [ENJ.Step_AddFormaldehyde, { pipet: 'pipet2', beaker: 2, volume: 0}, "向干�?烧杯中加�?25ml的酱油样�?"],

               [ENJ.Step_DropFromBuret, {volume: 60, pHs: [8.2, 9.2]}, "滴定..."],
               [ENJ.Step_StopStirrer, { beaker: 2, rotor: 0 }, "关闭电子搅拌�?"],

               [ENJ.Step_Record_2, { v2_2: 16.42, v2_m: 16.42 }, '记录第二次滴定体积，求出平均�?'],


               [ENJ.Step_Interlude_2, {title: "空白实验"}, ''],

               //空白1
               [ENJ.Step_WashElectrode, {}, "清洗PH电极"],
               [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],
               [ENJ.Step_DumpToCylinder, {volume: 25}, "量取25ml的蒸馏水"],
               [ENJ.Step_DumpFromCylinder, {beaker: 0}, "加入到干�?的烧杯中"],
               [ENJ.Step_AddRotor, { beaker: 0, rotor: 1 }, "加入�?颗转�?"],
               [ENJ.Step_StartStirrer, { beaker: 0, rotor: 1 }, "打开电子搅拌器，�?始自动搅�?"],
               [ENJ.Step_DumpToBuret, {volume: 82}, "向滴定管中加入足量氢氧化钠溶�?"],
               [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 80 }, ""],
               [ENJ.Step_InstallBuret, {}, ""],
               [ENJ.Step_DropFromBuret, {volume: 70, remain: true, pHs: [7, 8.2]}, ""],

               [ENJ.Step_Record_2, { v0_1: 0.02 }, '记录空白滴定体积，计算酱油的氨基态氮含量'],

               //加甲�?
               [ENJ.Step_SuckLiquid, { pipet: 'pipet2', bottle: 'formaldehyde', volume: 6, remain: false, showLabel: true }, "吸取足量的酱油样�?"],
               [ENJ.Step_AddFormaldehyde, { pipet: 'pipet2', beaker: 0, volume: 0}, "向干�?烧杯中加�?25ml的酱油样�?"],

               [ENJ.Step_DropFromBuret, {volume: 60, pHs: [8.2, 9.2]}, "滴定..."],
               [ENJ.Step_StopStirrer, { beaker: 0, rotor: 1 }, "关闭电子搅拌�?"],

               [ENJ.Step_Record_2, { v0_2: 0.02, xx: 5.84, canClose: false }, '记录空白滴定体积，计算酱油的氨基态氮含量']*/
            ];

            for(i = 0, n = configs.length; i < n; ++i) {
                config = configs[i];
                steps.push(config[0]);
                stores.push(config[1]);
                tips.push( config[2] );
            }

            this.steps = steps;
            this.stores = stores;
            this.tips = tips;
        }
    });
})();

//##############################################################################
// src/expts/Experiment.js
//##############################################################################
ENJ.Experiment = ( function () {
  /**
   *
   * @class Experiment
   *
   * @param {Lab} lab
   * @param {Scene} scene
   * @param {Script} script
   * @constructor
   */
  function Experiment ( lab, scene, script ) {
    this.lab = lab;
    this.scene = scene;
    this.script = script;

    lab.put( scene );

    script.scene = scene;
    script.start();

//        lab.addEventListener( 'prev', this.onStepChange.bind( this ) );
//        lab.addEventListener( 'next', this.onStepChange.bind( this ) );
//        lab.addEventListener( 'skip', this.onStepChange.bind( this ) );
//        lab.addEventListener( 'restart', this.onStepChange.bind( this ) );
  }

  /*Experiment.prototype.onStepChange = function ( event ) {
   var script = this.script;
   switch ( event.type ) {
   case 'prev':
   script.prev();
   break;
   case 'next':
   script.next();
   break;
   case 'restart':
   script.restart();
   break;
   case 'skip':
   script.skip( event.body[ 'to' ] - 1 );
   break;
   }
   };*/

  return Experiment;
} )();



//##############################################################################
// src/Lab.js
//##############################################################################
ENJ.Lab = (function() {
  var Stage = CRE.Stage,
    Shape = CRE.Shape,
  //var Bitmap = CRE.Bitmap,
    Graphics = CRE.Graphics;

  /**
   * @class Lab
   * @extends Stage
   *
   * @param {String|HTMLCanvasElement} canvas
   * @constructor
   */
  function Lab(canvas) {
    Stage.apply(this,  arguments);
    this.register();
    this.ready();
  }

  var pt = Lab.prototype = Object.create(Stage.prototype);

  pt.constructor = Lab;

  /**
   * Register somethings.
   *
   * @method register
   */
  pt.register = function() {
    //this._renderers = [];
    this.progressBar = null;
  };

  /**
   * @method ready
   */
  pt.ready = function() {
    this.enableMouseOver();
    //var scene = new ENJ.Scene_4();
    //scene.app = this;
    //this.addChild(scene);
    var graphics = new Graphics();
    graphics.beginFill('#0f0').drawRect(0,  0,  600,  5);
    var progressBar = new Shape(graphics);

    graphics = new Graphics();
    graphics.beginFill('#0f0').drawRect(0,  0,  600,  1);
    var line = new Shape(graphics);

    this.addChild(line);
    line.set({ x:180,  y: 255 });
    this.addChild(progressBar);
    progressBar.set({ x:180,  y: 250 });

    this.progressBar = progressBar;
  };

  /**
   * Update the progressBar.
   *
   * @method progress
   * @param {Number} value - from 0 to 1.0
   */
  pt.progress = function(value) {
    this.progressBar.scaleX =  value;
  };

  /**
   * Put a new scene.
   *
   * @method method
   * @param {Scene} scene
   */
  pt.put = function(scene) {
    this.removeAllChildren();
    this.progressBar = null;

    /*scene.alpha = 0;
     CRE.Tween.get(scene).to({
     alpha: 1.0
     },  500);*/
    //scene.app = this;
    this.addChild(scene);
      this.scene = scene;
     var container = new CRE.Container();

     var text = new CRE.Text();
     text.set({ x:820,  y:20 });
     text.color='#fff';
     text.text = 'x: \n\ny: ';
     this.text = text;
     container.addChild(text);

     var self = this;
     //this.addEventListener('tick',  this.refresh.bind(this));
     this.addEventListener('stagemousemove',  function(evt){
     var mouse = self.scene.globalToLocal(evt.stageX, evt.stageY);
     self.text.text='x: '+ mouse.x + '\n\ny: ' + mouse.y;
     });

     var i,  g,  line;

     g = new Graphics();
     g.beginStroke('#ffffff').moveTo(0, 0).lineTo(0, 640);
     for(i = 0; i < 10; ++ i) {
     line = new Shape(g);
     line.x = i * 100;
     container.addChild(line);
     }

     g = new Graphics();
     g.beginStroke('#ffffff', 1).moveTo(0, 0).lineTo(960, 0);
     for(i = 0; i < 7; ++ i) {
     line = new Shape(g);
     line.y = i * 100;
     container.addChild(line);
     }

     this.addChild(container);

    /*g = new Graphics();
     g.beginFill('#0f0').drawRect(0, 0, 100, 100);
     var mask = new Shape(g);

     g = new Graphics();
     g.beginFill('#0f0').drawCircle(50, 50, 50);
     var circle = new Shape(g);

     circle.mask = mask;

     circle.y=100;
     CRE.Tween.get(circle).to({y:-50}, 2000);
     this.addChild(circle);*/

  };

  return Lab;
})();

//##############################################################################
// src/exit.js
//##############################################################################
//var stats = new Stats();
//
//stats.setMode(0); // 0: fps, 1: ms
//stats.domElement.style.position = 'absolute';
//stats.domElement.style.left = '0px';
//stats.domElement.style.top = '0px';
//
//document.body.appendChild(stats.domElement);


var lab = new ENJ.Lab('stage');
lab.active=true;

if (window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame) {
    CRE.Ticker.timingMode = 'raf';
}

CRE.Ticker.addEventListener('tick' , update);

function update(event) {
//    if (CRE.Tween.hasActiveTweens() || ENJ.invalid) {
//        lab.update();
//        ENJ.invalid = false;
//    }

    if (lab && lab.active) {
        lab.update(event);
    }

    //stats.update();
    //requestAnimationFrame(update);
}
//update();

RES.addEventListener('complete', function() {
    lab.progress(1.0);


//  var scene = new ENJ.Scene_2();
//  var script = new ENJ.Script_2();
    var scene = new ENJ.Scene_8();
    var script = new ENJ.Script_8();

    scene.set({
        x: 60, scaleX: ENJ.scaleY, scaleY: ENJ.scaleY
    });
    //ENJ.invalid = true;
    //update();
    /*var prevBtn =  new jQuick('#prev-btn');
     var nextBtn =  new jQuick('#next-btn');
     var gotoBtn =  new jQuick('#goto-btn');
     var editor = new jQuick('#editor');

     prevBtn.on('click',function(){
     script.prev();
     var val = parseInt(editor.val());
     editor.val(val - 1);
     });

     nextBtn.on('click',function(){
     script.next();
     var val = parseInt(editor.val());
     editor.val(val + 1);
     });

     gotoBtn.on('click',function(){
     var val = parseInt(editor.val());
     script.skip(val - 1);
     });

     script.addEventListener('stepComplete',function(){
     editor.val(script.currentIndex + 1);
     });*/

    new ENJ.Experiment(lab, scene, script);

});

RES.addEventListener('progress', function(evt) {
    //console.log(evt.progress);
    lab.progress(evt.progress);
    //bar.style.width = '' + evt.progress * 100 +'%';
});

RES.loadManifest({
    path: '../../assets/',
    manifest: [
        { id: "�?", src: "�?.png" },
        { id: "水滴", src: "水滴.png" },
        { id: "水流", src: "水流.png" },
        { id: "纸巾", src: "纸巾.png" },
        { id: "转子", src: "转子.png" },
        { id: "袋子", src: "袋子.png" },
        { id: "粉末", src: "粉末.png" },
        { id: "剪刀", src: "剪刀.png" },
        { id: "引流�?", src: "引流�?.png" },
        { id: "标签", src: "标签.png" },
        { id: "标签�?",src:"标签�?.png"},
        { id: "吸球", src: "吸球.png" },
        { id: "吸嘴", src: "吸嘴.png" },
        { id: "蝴蝶�?", src: "蝴蝶�?.png" },
        { id: "滴定�?", src: "滴定�?.png" },
        { id: "滴定�?", src: "滴定�?.png" },
        { id: "滴定管液�?", src: "滴定管液�?.png" },
        { id: "磁力搅拌�?", src: "磁力搅拌�?.png" },
        { id: "磁力搅拌器旋�?", src: "磁力搅拌器旋�?.png" },
        { id: "PH�?", src: "PH�?.png" },
        { id: "PH仪面�?", src: "PH仪面�?.png" },
        { id: "PH电极", src: "PH电极.png" },
        { id: "PH电极�?", src: "PH电极�?.png" },
        { id: "酱油�?", src: "酱油�?.png" },
        { id: "酱油瓶盖", src: "酱油瓶盖.png" },
        { id: "酱油", src: "酱油.png" },
        { id: "容量�?", src: "容量�?.png" },
        { id: "容量瓶盖", src: "容量瓶盖.png" },
        { id: "容量瓶液�?", src: "容量瓶液�?.png" },
        { id: "量筒", src: "量筒.png" },
        { id: "量筒液体", src: "量筒液体.png" },
        { id: "盖子�?", src: "盖子�?.png" },
        { id: "试剂�?", src: "试剂�?.png" },
        { id: "试剂瓶液�?", src: "试剂瓶液�?.png" },
        { id: "氢氧化钠标签", src: "氢氧化钠标签.png" },
        { id: "甲醛标签", src: "甲醛标签.png" },
        { id: "移液�?", src: "移液�?.png" },
        { id: "移液管液�?", src: "移液管液�?.png" },
        { id: "移液管架", src: "移液管架.png" },
        { id: "蒸馏水瓶", src: "蒸馏水瓶.png" },
        { id: "烧杯", src: "烧杯.png" },
        { id: "烧杯液体", src: "烧杯液体.png" },
        { id: "关闭按钮", src: "关闭按钮.png" },
        { id: "结果报告3", src: "结果报告3.png" },
        { id: "背景", src: "背景.png" },
         {id: "水池", src:"水池.png"},
        { id: "试管�?",src:"试管�?.png"   },
         {id: "箭头",src:"箭头.png"},
        {id: "试管�?",src:"试管�?.png"},
        {id: "试管�?",src:"试管�?.png"},
        {id: "试管液体",src:"试管液体.png"},

        {id: "对氨基苯磺酸",src:"对氨基苯磺酸.png"},
        {id: "�?",src:"�?.png"},

        {id:"对氨基苯磺酸瓶盖",src:"对氨基苯磺酸瓶盖.png"},

        {id:"盐酸萘乙二胺",src:"盐酸萘乙二胺.png"},

        {id:"盐酸萘乙二胺�?",src:"盐酸萘乙二胺�?.png"},

        {id: "亚硝酸钠标准液标�?", src:"亚硝酸钠标准液标�?.png"}

    ]
});

//var $ = jQuick






