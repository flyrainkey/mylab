//##############################################################################
// src/scripts/Script_3.js
//##############################################################################
ENJ.Script_3 = (function() {
  var Script = ENJ.Script;

  return ENJ.defineClass({
    /**
     * @class Script_3
     * @extends Script
     *
     * @constructor
     */
    constructor: function Script_3() {
      Script.apply( this, arguments );
    }, extend: Script,
    /**
     * @override
     */
    ready: function() {
      var i, n, config, configs, steps = [], stores = [], tips = [];

      configs  = [
        [ENJ.Step_Interlude_1, { title: "校准PH计" }, ''],
        // 校准1
        /*
        [ENJ.Step_CutBag, { bag: 1 }, "剪开一袋PH标准缓冲液（6.86）粉末"],
        [ENJ.Step_DumpPowder, { bag: 1, beaker: 3 }, "将粉末倒入干净的烧杯中"],
        [ENJ.Step_WashBag, { bag: 1, beaker: 3, remain: true, volume: 5 }, "用蒸馏水清洗粉末袋子"],
        [ENJ.Step_WashBag, { bag: 1, beaker: 3, remain: false, volume: 10 }, "用蒸馏水清洗粉末袋子"],
        [ENJ.Step_DumpWater, { beaker: 3, volume: 20 }, "加水稀释"],
        [ENJ.Step_StirLiquid, { beaker: 3, remain: true }, "用玻璃杯搅拌一下"],
        [ENJ.Step_TransferLiquid, { beaker: 3, flask: 2, remain: true }, "将稀释液移入容量瓶中"],
        [ENJ.Step_DumpWater, { beaker: 3, volume: 20, washing: true }, "加水清洗烧杯和玻璃杯"],
        [ENJ.Step_TransferLiquid, { beaker: 3, flask: 2, remain: true }, "将清洗液移入容量瓶中"],
        [ENJ.Step_DumpWater, { beaker: 3, volume: 20, washing: true }, "加水清洗烧杯和玻璃杯"],
        [ENJ.Step_TransferLiquid, { beaker: 3, flask: 2 }, "将清洗液移入容量瓶中"],
        [ENJ.Step_ConstantVolume, { flask: 2, volume: 100 }, "补加蒸馏水，定容至100ml"],
        [ENJ.Step_ShakeUp, { flask: 2 }, "摇匀"],
        */
        /*[ENJ.Step_WashElectrode, {}, "清洗PH电极"],
        [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],
        [ENJ.Step_DumpFromFlask, { beaker: 2, flask: 2, volume: 30 }, "倒一些PH标准缓冲液（6.86）至干净的烧杯中"],
        [ENJ.Step_AddRotor, { beaker: 2, rotor: 1 }, "加入一颗转子"],
        [ENJ.Step_StartStirrer, { beaker: 2, rotor: 1 }, "打开电子搅拌器，开始自动搅拌"],
        [ENJ.Step_CorrectPHInstrument, {}, "校准PH计"],
        [ENJ.Step_StopStirrer, { beaker: 2, rotor: 1 }, "关闭电子搅拌器"],*/

        // 校准2
        /*
        [ENJ.Step_CutBag, { bag: 0 }, "剪开一袋PH标准缓冲液（9.18）粉末"],
        [ENJ.Step_DumpPowder, { bag: 0, beaker: 1 }, "将粉末倒入干净的烧杯中"],
        [ENJ.Step_WashBag, { bag: 0, beaker: 1, remain: true, volume: 5 }, "用蒸馏水清洗粉末袋子"],
        [ENJ.Step_WashBag, { bag: 0, beaker: 1, remain: false, volume: 10 }, "用蒸馏水清洗粉末袋子"],
        [ENJ.Step_DumpWater, { beaker: 1, volume: 20 }, "加水稀释"],
        [ENJ.Step_StirLiquid, { beaker: 1, remain: true }, "用玻璃杯搅拌一下"],
        [ENJ.Step_TransferLiquid, { beaker: 1, flask: 0, remain: true }, "将稀释液移入容量瓶中"],
        [ENJ.Step_DumpWater, { beaker: 1, volume: 20, washing: true }, "加水清洗烧杯和玻璃杯"],
        [ENJ.Step_TransferLiquid, { beaker: 1, flask: 0, remain: true }, "将清洗液移入容量瓶中"],
        [ENJ.Step_DumpWater, { beaker: 1, volume: 20, washing: true }, "加水清洗烧杯和玻璃杯"],
        [ENJ.Step_TransferLiquid, { beaker: 1, flask: 0 }, "将清洗液移入容量瓶中"],
        [ENJ.Step_ConstantVolume, { flask: 0, volume: 100 }, "补加蒸馏水，定容至100ml"],
        [ENJ.Step_ShakeUp, { flask: 0 }, "摇匀"],
        */
        /*[ENJ.Step_WashElectrode, {}, "清洗PH电极"],
        [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],
        [ENJ.Step_DumpFromFlask, { beaker: 0, flask: 0, volume: 30 }, "倒一些PH标准缓冲液（9.18）至干净的烧杯中"],
        [ENJ.Step_AddRotor, { beaker: 0, rotor: 0 }, "加入一颗转子"],
        [ENJ.Step_StartStirrer, { beaker: 0, rotor: 0 }, "打开电子搅拌器，开始自动搅拌"],
        [ENJ.Step_CorrectPHInstrument, {}, "校准PH计"],
        [ENJ.Step_StopStirrer, { beaker: 0, rotor: 0 }, "关闭电子搅拌器"],*/

        //
       // [ENJ.Step_Interlude_3, {title: "第一次取样和测试"}, ''],


        //取样1
       /*[ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 2, remain: false }, "用移液管吸取少量酱油样品"],
      [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗一下移液管"],
        [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液缸"],
      [ENJ.Step_EmptyPipet, { remain: true }, "排入废液缸"],
       [ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 2, remain: false }, "再吸取少量酱油样品"],
        [ENJ.Step_WashPipe, { pipe: 'pipet' }, "二次润洗一下移液管"],
        [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液缸"],
        [ENJ.Step_EmptyPipet, { remain: true }, "排入废液缸"],*/
       /* [ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 6, remain: true }, "吸取足量酱油样品"],
        [ENJ.Step_BlowLiquid, { bottle: 'soySauce', volume: 4, remain: 1, rotation: 20, showLabel: true }, "留下4ml的酱油样品"],
        [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 2, remain: 1, rotation: 15, offsetX: -20, offsetY: 20, showLabel: true}, "向干净的容量瓶中加入2ml的酱油样品"],
        [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "多余的样品，排入废液缸"],
        [ENJ.Step_EmptyPipet, {}, "多余的样品，排入废液缸"],
        [ENJ.Step_ConstantVolume, { flask: 1, volume: 100 }, "补加蒸馏水，定容至100ml"],
        [ENJ.Step_ShakeUp, {flask: 1 }, "摇匀"],

        [ENJ.Step_WashElectrode, {}, "清洗PH电极"],
        [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],

        [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 2, remain: false }, "用移液管吸取少量酱油样品"],
        [ENJ.Step_WashPipe, { pipe: 'bigPipet' }, "润洗一下移液管"],
        [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液缸"],
        [ENJ.Step_EmptyPipet, { pipet: 'bigPipet',remain: true }, "排入废液缸"],
        [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 2, remain: false }, "再吸取少量酱油样品"],
        [ENJ.Step_WashPipe, {   pipe:  'bigPipet' }, "二次润洗一下移液管"],
        [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液缸"],
        [ENJ.Step_EmptyPipet, { pipet: 'bigPipet', remain: true }, "排入废液缸"],
        [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 6, remain: true }, "吸取足量的酱油样品"],
        [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 5, remain: 1, rotation: 15, offsetX: 10, offsetY: 60, showLabel: true }, "留下25ml的酱油样品"],
        [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', beaker: 0, volume: 0, scale: 5, remain: 0, offsetX: 90, offsetY: 120, rotation:15 }, "向干净烧杯中加入25ml的酱油样品"],
*/
        //测定1
        [ENJ.Step_AddRotor, { beaker: 0, rotor: 1 }, "加入一颗转子"],
        [ENJ.Step_StartStirrer, { beaker: 0, rotor: 1 }, "打开电子搅拌器，开始自动搅拌"],
        /*[ENJ.Step_DumpToBuret, {volume: 20}, "向滴定管中加入少量氢氧化钠溶液"],
        [ENJ.Step_WashPipe, { pipe: 'buret' }, "润洗一下滴定管"],
        [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 0 }, "排入废液缸"],
        [ENJ.Step_DumpToBuret, {volume: 20}, "再向滴定管中加入少量氢氧化钠溶液"],
        [ENJ.Step_WashPipe, { pipe: 'buret' }, "二次润洗一下滴定管"],
        [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 0 }, "排入废液缸"],
        [ENJ.Step_DumpToBuret, {volume: 82}, "向滴定管中加入足量氢氧化钠溶液"],
        [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 80 }, "滴定管中液面降至零刻度线"],
        [ENJ.Step_InstallBuret, {}, "夹好滴定管"],
        [ENJ.Step_DropFromBuret, {volume: 70, remain: true, pHs: [6.2, 8.2]}, "滴定..."],*/

        [ENJ.Step_Record_2, { v1_1: 16.41 }, '记录第一次滴定体积'],

        //加甲醛
        /*[ENJ.Step_SuckLiquid, { pipet: 'pipet2', bottle: 'formaldehyde', volume: 6, remain: false, showLabel: true }, "吸取足量的酱油样品"],
        [ENJ.Step_AddFormaldehyde, { pipet: 'pipet2', beaker: 0, volume: 0}, "向干净烧杯中加入25ml的酱油样品"],

        [ENJ.Step_DropFromBuret, {volume: 60, pHs: [8.2, 9.2]}, "滴定..."],
        [ENJ.Step_StopStirrer, { beaker: 0, rotor: 1 }, "关闭电子搅拌器"],*/

        [ENJ.Step_Record_2, { v1_2: 16.41, v1_m: 0 }, '记录第一次滴定体积'],


        [ENJ.Step_Interlude_1, {title: "第二次取样和测试"}, ''],
        //取样2
      /*  [ENJ.Step_WashElectrode, {}, "清洗PH电极"],
        [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],

        [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 6, remain: true }, "吸取足量的酱油样品"],
        [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 5, remain: 1, rotation: 15, offsetX: 10, offsetY: 60, showLabel: true }, "留下25ml的酱油样品"],
        [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', beaker: 2, volume: 0, scale: 5, remain: 0, offsetX: 90, offsetY: 120, rotation:15 }, "向干净烧杯中加入25ml的酱油样品"],


        //测定2
        [ENJ.Step_AddRotor, { beaker: 2, rotor: 0 }, "加入一颗转子"],
        [ENJ.Step_StartStirrer, { beaker: 2, rotor: 0 }, "打开电子搅拌器，开始自动搅拌"],
        [ENJ.Step_DumpToBuret, {volume: 82}, "向滴定管中加入足量氢氧化钠溶液"],
        [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 80 }, "滴定管中液面降至零刻度线"],
        [ENJ.Step_InstallBuret, {}, "夹好滴定管"],
        [ENJ.Step_DropFromBuret, {volume: 70, remain: true, pHs: [6.2, 8.2]}, "滴定..."],
*/
        [ENJ.Step_Record_2, { v2_1: 16.42 }, '记录第二次滴定体积，求出平均值'],

      /*  //加甲醛
        [ENJ.Step_SuckLiquid, { pipet: 'pipet2', bottle: 'formaldehyde', volume: 6, remain: false, showLabel: true }, "吸取足量的酱油样品"],
        [ENJ.Step_AddFormaldehyde, { pipet: 'pipet2', beaker: 2, volume: 0}, "向干净烧杯中加入25ml的酱油样品"],

        [ENJ.Step_DropFromBuret, {volume: 60, pHs: [8.2, 9.2]}, "滴定..."],
        [ENJ.Step_StopStirrer, { beaker: 2, rotor: 0 }, "关闭电子搅拌器"],
*/
        [ENJ.Step_Record_2, { v2_2: 16.42, v2_m: 16.42 }, '记录第二次滴定体积，求出平均值'],


        [ENJ.Step_Interlude_2, {title: "空白实验"}, ''],

        //空白1
        [ENJ.Step_WashElectrode, {}, "清洗PH电极"],
        [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],
        [ENJ.Step_DumpToCylinder, {volume: 25}, "量取25ml的蒸馏水"],
        [ENJ.Step_DumpFromCylinder, {beaker: 0}, "加入到干净的烧杯中"],
        [ENJ.Step_AddRotor, { beaker: 0, rotor: 1 }, "加入一颗转子"],
        [ENJ.Step_StartStirrer, { beaker: 0, rotor: 1 }, "打开电子搅拌器，开始自动搅拌"],
        [ENJ.Step_DumpToBuret, {volume: 82}, "向滴定管中加入足量氢氧化钠溶液"],
        [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 80 }, ""],
        [ENJ.Step_InstallBuret, {}, ""],
        [ENJ.Step_DropFromBuret, {volume: 70, remain: true, pHs: [7, 8.2]}, ""],

        [ENJ.Step_Record_2, { v0_1: 0.02 }, '记录空白滴定体积，计算酱油的氨基态氮含量'],

        //加甲醛
        [ENJ.Step_SuckLiquid, { pipet: 'pipet2', bottle: 'formaldehyde', volume: 6, remain: false, showLabel: true }, "吸取足量的酱油样品"],
        [ENJ.Step_AddFormaldehyde, { pipet: 'pipet2', beaker: 0, volume: 0}, "向干净烧杯中加入25ml的酱油样品"],

        [ENJ.Step_DropFromBuret, {volume: 60, pHs: [8.2, 9.2]}, "滴定..."],
        [ENJ.Step_StopStirrer, { beaker: 0, rotor: 1 }, "关闭电子搅拌器"],

        [ENJ.Step_Record_2, { v0_2: 0.02, xx: 5.84, canClose: false }, '记录空白滴定体积，计算酱油的氨基态氮含量']
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
