//##############################################################################
// src/scenes/Scene_3.js
//##############################################################################
ENJ.Scene_8 = (function() {
    var Scene = ENJ.Scene,
        Bitmap = CRE.Bitmap,
        Point = CRE.Point;
    var Shape = CreateJS.Shape;

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
                rotor, hand, beaker,  beakernew,i,spectrophotometer,
                pipetStand, waterBottle, volumetricFlask, drainageBar, bigBeaker,
                beakers = [], volumetricFlasks = [], rotors = [],
                cylinder, stirrer, phInstrument, buret, titrationStand,
                phElectrode, reagenBottle, formaldehyde,
                suckBall, soySauce, pipet, pipet2, tubeholder,pool,bigPipet,tube,tube1,tube2,tube3,tube4,tube5,tube6,arrow;

            // @todo CSS background maybe better.
            bg = new Bitmap(RES.getRes("背景"));
            var shape = new Shape();
            shape.alpha = 0.5;
           shape.graphics
                .beginFill('#0f0')
                .moveTo(0, 0)
                .lineTo(0, 960)
                .lineTo(630, 960)
                .lineTo(630, 400)
                .lineTo(1000, 400)
                .lineTo(1000, 0)
                .endFill();
           // paper = new Bitmap(RES.getRes("纸巾"));
           // paper.visible = false;
            var papers = new Bitmap(RES.getRes("一沓擦镜纸"));
            var paper = new Bitmap(RES.getRes("擦镜纸"));
             spectrophotometer = new ENJ.Spectrophotometer();
             beakernew = new ENJ.BeakerNew({volume:20,color: 0x66FF00FF});
        //catch(e){
            //    console.log("错误");
            //}

           // drainageBar = new Bitmap(RES.getRes("引流棒"));

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
                images: [RES.getRes("手")],
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
            //cap = new Bitmap(RES.getRes("盖子甲"));
           //volume: 100, color: 0x22ffffff,
        reagenBottle = new ENJ.ReagenBottle({volume: 400,color: 0x66330000, pt: "对氨基苯磺酸",cap:"对氨基苯磺酸瓶盖" } );
            formaldehyde = new ENJ.ReagenBottle({ volume: 400, color: 0x66330000, pt: "盐酸萘乙二胺", cap: "盐酸萘乙二胺盖" } );


            pipetStand = new Bitmap(RES.getRes("移液管架"));
            tubeholder = new Bitmap(RES.getRes("试管架"));
            pool = new Bitmap(RES.getRes("水池"));

            var cuvettes = [];
            for (i = 0; i < 7; ++i) {
                cuvettes[i] = new ENJ.Cuvette({volume: 0, color: i > 0 ? 0x55FF00FF : 0x55ffffff});
                cuvettes[i].mask = shape;
                this.place(cuvettes[i], {x: 235 - 26 * i, y: 465});
            }
            cuvettes[0].visible = false;
            cuvettes[1].visible = false;
            cuvettes[2].visible = false;
            cuvettes[3].visible = false;
            cuvettes[4].visible = false;
            cuvettes[5].visible = false;
            cuvettes[6].visible = false;



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

            //phInstrument = new ENJ.PHInstrument();//new Bitmap(RES.getRes ("PH仪"));

            //cylinder = new ENJ.Cylinder({ volume: 0, color: 0x22ffffff });

            volumetricFlask = new ENJ.VolumetricFlask({ volume: 40, color: 0x990000ff,icon:"亚硝酸钠标准液标签",cap:"容量瓶盖" });
            tube = new ENJ.Tube();
            tube1 = new ENJ.Tube({volume:0,color:0x55FF00FF});
            tube2 = new ENJ.Tube({volume:0,color:0x55FF00FF});
            tube3 = new ENJ.Tube({volume:0,color:0x55FF00FF});
            tube4 = new ENJ.Tube({volume:0,color:0x55FF00FF});
            tube5 = new ENJ.Tube({volume:0,color:0x55FF00FF});
            tube6= new ENJ.Tube({volume:0,color:0x55FF00FF});

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

            table = new ENJ.ResultTable_8();
            table.set({regX: 360, regY: 200});
            table.set({x: 620, y: 200, visible: false});

            tip = new CRE.Text();
            tip.set({x: 50, y: 50, color: "#fff", font: "bold 18px Arial"});

            board = new ENJ.Board(/*{title:"校准PH计"}*/);
            board.visible = false;


            self.addChild(
                bg,
                pipetStand,

                //cap,

                //stirrer,



                spectrophotometer,
               // cylinder,
                waterBottle, //如果水壶在pipet下面，则用pipet的时候 会被水壶挡住一部分
                pool,
                pipet,
                pipet2,
                bigPipet,


                cuvettes[6], cuvettes[5], cuvettes[4], cuvettes[3], cuvettes[2], cuvettes[1], cuvettes[0],
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
                reagenBottle,// reagenBottle要放在容量瓶下面？
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
                papers,
                hand,
                drop,

                table,

                tip,

                beakernew,
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
            self.place( volumetricFlask,new Point(-65,375));

            spectrophotometer.set({x: 700, y: 280});
            spectrophotometer.visible = false;
            self.place(beakernew, {x: 520, y: 470});
            beakernew.visible = false;
        self.place(paper,new Point(750,430));
            paper.visible = false;
            self.place(papers,new Point(760,520));
            papers.visible = false;
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
            self.place(reagenBottle, new Point(90, 450));
            self.place(formaldehyde, new Point(30, 280));
            self.place(pipet, new Point(700, 290));
            self.place(pipet2, new Point(700, 320));
            self.place(bigPipet, new Point(650, 350));

            self.place(suckBall, new Point(305, 577));
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
                cuvettes0 : cuvettes[0],
                cuvettes1 : cuvettes[1],
                cuvettes2 : cuvettes[2],
                cuvettes3 : cuvettes[3],
                cuvettes4 : cuvettes[4],
                cuvettes5 : cuvettes[5],
                cuvettes6 : cuvettes[6],


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
                papers:papers,
                cuvettes: cuvettes,
               volumetricFlask: volumetricFlask,
                arrow:arrow,
                pipetStand: pipetStand,
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
                spectrophotometer: spectrophotometer,
                beakernew: beakernew,
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
