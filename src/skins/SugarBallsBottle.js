//######################################################################################################################
// src/skins/SugarBallsBottle.js
//######################################################################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Bitmap = CreateJS.Bitmap;
  var Container = CreateJS.Container;
  var ColorFilter = CreateJS.ColorFilter;

  var   b2Vec2 = Box2D.Common.Math.b2Vec2
    ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,	b2Body = Box2D.Dynamics.b2Body
    ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,	b2Fixture = Box2D.Dynamics.b2Fixture
    ,	b2World = Box2D.Dynamics.b2World
    , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
    ,	b2MassData = Box2D.Collision.Shapes.b2MassData
    ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  var Skin = ENJ.Skin;

  var base  = Skin.prototype;

  function SugarBallsBottle(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: SugarBallsBottle,
    extend: Skin,

    register: function() {
      this.angle = 3.14/2;
    },

    ready: function(props) {
      var world, shape, fixDef, bodyDef;

      world = new b2World(
        new b2Vec2(0, 10)    //gravity
        ,  false                 //allow sleep
      );

      bodyDef = new b2BodyDef();
      fixDef = new b2FixtureDef();

      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;

      //
      shape = new b2PolygonShape();
      shape.SetAsBox(10/30, 10/30);

      fixDef.shape = shape;

      bodyDef.type = b2Body.b2_staticBody;
      bodyDef.position.x = 0;
      bodyDef.position.y = 0;

      var anchor1 = world.CreateBody(bodyDef);
      anchor1.CreateFixture(fixDef);

      bodyDef.position.x = 0;
      bodyDef.position.y = 110/30;

      var anchor2 = world.CreateBody(bodyDef);
      anchor2.CreateFixture(fixDef);

      //
      shape = new b2PolygonShape();

      fixDef.shape = shape;

      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.position.x = 0;
      bodyDef.position.y = 0;
      //fixDef.shape = new b2PolygonShape();

      var box = world.CreateBody(bodyDef);

      shape.SetAsOrientedBox(6/30, 55/30, new b2Vec2(0, 55/30), 0);
      box.CreateFixture(fixDef);
      shape.SetAsOrientedBox(6/30, 55/30, new b2Vec2(64/30, 55/30), 0);
      box.CreateFixture(fixDef);
      shape.SetAsOrientedBox(32/30, 6/30, new b2Vec2(32/30, 20/30), 0);
      box.CreateFixture(fixDef);
      shape.SetAsOrientedBox(32/30, 6/30, new b2Vec2(32/30, 110/30), 0);
      box.CreateFixture(fixDef);

      //
      var joint1 = new b2RevoluteJointDef();
      joint1.bodyA = box;
      joint1.bodyB = anchor1;
      joint1.localAnchorA = new b2Vec2(0,0);//anchor.GetWorldCenter();
      joint1.localAnchorB = new b2Vec2(0,0);
      world.CreateJoint(joint1);

      var joint2 = new b2RevoluteJointDef();
      joint2.bodyA = box;
      joint2.bodyB = anchor2;
      joint2.localAnchorA = new b2Vec2(0,110/30);//anchor.GetWorldCenter();
      joint2.localAnchorB = new b2Vec2(0,0);
      world.CreateJoint(joint2);

      //
      shape = new b2CircleShape(5/30);
      fixDef.shape = shape;

      for (var i = 0; i < 30; ++i) {
        //var skin = new Bitmap(RES.getRes('糖球'));
        //skin.filters = [new ColorFilter(1, 1 ,0.6)];
        //skin.cache(0,0,12,12);
        //skin.set({regX: 8, regY: 8});
        var skin = new ENJ.SugarBall({factors: [1,0.6,1]});

        this.addChild(skin);

        bodyDef.position.x = (Math.random() * 45 + 5) / 30;
        bodyDef.position.y = (Math.random() * 70 + 20) / 30;
        bodyDef.userData = {type: 0, skin: skin};

        var ball = world.CreateBody(bodyDef);

        ball.CreateFixture(fixDef);
      }


      this.world = world;
      this.anchor2 = anchor2;

      if (props.context2d) {
        this.setupDebugDraw(props.context2d);
      }


      var cap = new Bitmap(RES.getRes('广口瓶瓶塞'));
      var body = new Bitmap(RES.getRes('广口瓶瓶身'));

      var location = {x: 9, y: -12};

      cap.set(location);
      cap.location = location;

      this.addChild(cap, body);

      this.cap = cap;
      this.body = body;
    },

    setupDebugDraw: function(context2d) {
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(context2d);
      debugDraw.SetDrawScale(30.0);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      this.world.SetDebugDraw(debugDraw);
    },

    release: function() {
      base.release.call(this);

      var world = this.world;

      for (var body = world.GetBodyList(); body; body = body.GetNext()) {
        world.DestroyBody(body);
      }

    },

    refresh:function() {
      //if (!this.active) { return; }

      var world = this.world;



      if (this.rotating && (this.wise ? this.angle < this.targetAngle : this.angle > this.targetAngle)) {
        this.angle += this.wise ? 0.015 : -0.015;
        this.anchor2.SetPositionAndAngle(new b2Vec2((110*Math.cos(this.angle))/30,(110*Math.sin(this.angle))/30),0);
        this.body.rotation = this.angle/3.14*180-90+1;
      } else {
        this.rotating = false;

      }

      world.Step(
        1 / 60   //frame-rate
        ,  10       //velocity iterations
        ,  10       //position iterations
      );
      world.DrawDebugData();
      world.ClearForces();


      for (var body = world.GetBodyList(); body; body = body.GetNext()) {
        var data = body.GetUserData();
        if (data && data.type === 0) {
          var pos = body.GetPosition();
          //pos = this.globalToLocal(pos.x * 30+this.x, pos.y * 30+this.y);
          data.skin.set({x: pos.x * 30, y: pos.y * 30});
        }
      }
    },

    start: function() {
      base.start.call(this);
      Tween.get(this.cap).to({
        x: -30, y: -30, alpha: 0, rotation: -60
      }, 1000);
    },

    stop: function() {
      var cap = this.cap;
      Tween.get(cap).to({
        x: cap.location.x, y: cap.location.y, alpha: 1.0, rotation: 0
      }, 1000);

      base.stop.call(this);
    },

    rotateTo: function(targetRotation) {
      this.rotating = true;
      //this.angle = (this.angle+90)/180*3.14;
      this.targetAngle = (targetRotation + 90)/180*3.14;

      this.wise = (this.targetAngle - this.angle) > 0;
    }
  });

  ENJ.SugarBallsBottle = SugarBallsBottle;

})();
