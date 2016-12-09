//######################################################################################################################
// src/skins/SugarBallsContainer.js
//######################################################################################################################
(function() {
  var Tween = CreateJS.Tween;
  var Bitmap = CreateJS.Bitmap;
  var Container = CreateJS.Container;

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

  function SugarBallsContainer(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: SugarBallsContainer,
    extend: Skin,

    ready: function(props) {


      var world, shape, fixDef, bodyDef;

      world = new b2World(
        new b2Vec2(0, 10)    //gravity
        ,  true                 //allow sleep
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
      bodyDef.position.y = 120/30;

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

      shape.SetAsOrientedBox(5/30, 60/30, new b2Vec2(0, 60/30), 0);
      box.CreateFixture(fixDef);
      shape.SetAsOrientedBox(5/30, 60/30, new b2Vec2(80/30, 60/30), 0);
      box.CreateFixture(fixDef);
      shape.SetAsOrientedBox(40/30, 5/30, new b2Vec2(40/30, 0), 0);
      box.CreateFixture(fixDef);
      shape.SetAsOrientedBox(40/30, 5/30, new b2Vec2(40/30, 120/30), 0);
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
      joint2.localAnchorA = new b2Vec2(0,120/30);//anchor.GetWorldCenter();
      joint2.localAnchorB = new b2Vec2(0,0);
      world.CreateJoint(joint2);

      //
      shape = new b2CircleShape(8/30);
      fixDef.shape = shape;

      for (var i = 0; i < 20; ++i) {
        var skin = new Bitmap(RES.getRes('糖球'));
        skin.set({regX: 10, regY: 10});
        this.addChild(skin);

        bodyDef.position.x = (Math.random() * 60 + 10) / 30;
        bodyDef.position.y = (Math.random() * 90 + 10) / 30;
        bodyDef.userData = {type: 0, skin: skin};

        var ball = world.CreateBody(bodyDef);

        ball.CreateFixture(fixDef);
      }


      this.world = world;
      this.anchor2 = anchor2;

      if (props.context2d) {
        this.setupDebugDraw(props.context2d);
      }


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

    refresh:function() {
      //if (!this.active) { return; }

      var world = this.world;

      world.Step(
        1 / 60   //frame-rate
        ,  10       //velocity iterations
        ,  10       //position iterations
      );
      world.DrawDebugData();
      world.ClearForces();

      if (this.rotating && this.angle < this.targetAngle) {
        this.angle += 0.01;
        this.anchor2.SetPositionAndAngle(new b2Vec2((120*Math.cos(angle))/30,(100*Math.sin(angle))/30),0);
      } else {
        this.rotating = false;
      }


      for (var body = world.GetBodyList(); body; body = body.GetNext()) {
        var data = body.GetUserData();
        if (data && data.type === 0) {
          var pos = body.GetPosition();
          data.skin.set({x: pos.x * 30, y: pos.y * 30});
        }
      }
    },

    rotateTo: function(targetRotation) {
      this.rotating = true;
      this.angle = (this.rotation+90)/180*3.14;
      this.targetAngle = (targetRotation + 90)/180*3.14;
    },

    onChange: function(key, val, old) {
      if (key === 'temperature') {


      }
    }
  });

  ENJ.SugarBallsContainer = SugarBallsContainer;

})();
