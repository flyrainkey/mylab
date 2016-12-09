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
                [ENJ.Step_Interlude_1, { title: "亚硝酸盐含量的测定" }, ''],
               // [ENJ.Step_Test, { title: "亚硝酸盐含量的测定" }, ''],


               // 润洗
                 [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 2, remain: false, still: true,ins:true,act:true }, "用移液管吸取少量亚硝酸钠标准液样品"],
                  [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗一下移液管"],
                  [ENJ.Step_BlowPool, {remain: 2}, "排入废液缸"],
                  [ENJ.Step_EmptyPipet8, { remain: true }, "排入废液缸"],
                //取液第2支试管
                 [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准液"],
                 [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true,act:true }, "留下4ml亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube1', volume: 3.5, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true, top:true,act:true }, "向干净的容量瓶中加入0.5ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 1.5, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],
                //取液第三支试管
                  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true,act:true }, "留下4ml亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube2', volume: 3, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true ,act:true}, "向干净的容量瓶中加入1ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 1.5, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],
                //取液第四支试管
                  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true,act:true }, "留下4ml亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube3', volume: 2.5, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true ,act:true}, "向干净的容量瓶中加入1.5ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 1.5, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false,act:true }, "多余的样品，排入废液缸"],
                //取液第五支试管
                  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true,act:true }, "留下4ml亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube4', volume: 2, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true ,act:true}, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 1, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],
                //取液第六支试管
                  [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:true}, "留下4ml亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube5', volume: 1.5, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true ,act:true}, "向干净的容量瓶中加入2.5ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 0.8, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false,act:true }, "多余的样品，排入废液缸"],
                //取液第七支试管
                 [ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:true}, "留下4ml亚硝酸钠标准液"],
                  [ENJ.Step_BlowLiquid, { bottle: 'tube6', volume: 1, remain: 1, rotation: 35, offsetX: 55, offsetY: 85, showLabel: true,top:true,act:true }, "向干净的容量瓶中加入3ml的亚硝酸钠标准液样品"],
                  [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 0, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:true,act:true }, "多余的样品，排入废液缸"],

                //润洗
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 2, remain: false, still: true,ins:false,act:true }, "用移液管吸取少量对氨基苯磺酸溶液样品"],
                [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗一下移液管"],
                [ENJ.Step_BlowPool, {remain: 2}, "排入废液缸"],
                [ENJ.Step_EmptyPipet8, { remain: true }, "排入废液缸"],

                //取液第一支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:true}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:true }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube',act:true},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.8, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false,act:true }, "多余的样品，排入废液缸"],

                //取液第二支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube1', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube1',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],


                //取液第三支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube2', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube2',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],


                //取液第四支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube3', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube3',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],
                //取液第五支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube4', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube4',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],

                //取液第六支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube5', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube5',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],

                //取液第7支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'reagenBottle', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube6', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:true,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ShakeUp,{flask:'tube6',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'reagenBottle', volume: 0, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:true ,act:true}, "多余的样品，排入废液缸"],

                //润洗
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 2, remain: false, still: true,ins:false,act:true }, "用移液管吸取少量对氨基苯磺酸溶液样品"],
                [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗一下移液管"],
                [ENJ.Step_BlowPool, {remain: 2}, "排入废液缸"],
                [ENJ.Step_EmptyPipet8, { remain: true }, "排入废液缸"],

                //取液第一支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:true}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:true}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:true }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube', volume: 50,act:true }, "补加蒸馏水，定容至100ml"],//上一步的stop影响了这一步的start,rotation却没有影响
                [ENJ.Step_ShakeUp,{flask:'tube',act:true},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.8, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false,act:true }, "多余的样品，排入废液缸"],



                //取液第二支比色管
                 [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                 [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                 [ENJ.Step_BlowLiquid, { bottle: 'tube1', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                 [ENJ.Step_ConstantVolume, { flask: 'tube1', volume: 50 ,act:false}, "补加蒸馏水，定容至100ml"],
                 [ENJ.Step_ShakeUp,{flask:'tube1',act:false},"摇匀比色管"],
                 [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],

                 //取液第三支比色管
                 [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                 [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                 [ENJ.Step_BlowLiquid, { bottle: 'tube2', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                 [ENJ.Step_ConstantVolume, { flask: 'tube2', volume: 50 ,act:false}, "补加蒸馏水，定容至100ml"],
                 [ENJ.Step_ShakeUp,{flask:'tube2',act:false},"摇匀比色管"],
                 [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],


                //取液第四支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube3', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube3', volume: 50 ,act:false}, "补加蒸馏水，定容至100ml"],
                [ENJ.Step_ShakeUp,{flask:'tube3',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],

                //取液第五支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube4', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube4', volume: 50 ,act:false}, "补加蒸馏水，定容至100ml"],
                [ENJ.Step_ShakeUp,{flask:'tube4',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],

                //取液第六支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube5', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube5', volume: 50 ,act:false}, "补加蒸馏水，定容至100ml"],
                [ENJ.Step_ShakeUp,{flask:'tube5',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0.2, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:false ,act:true}, "多余的样品，排入废液缸"],

                //取液第七支比色管
                [ENJ.Step_SuckLiquid, { bottle: 'formaldehyde', volume: 6, remain: true ,still:false,ins:true,act:false}, "吸取足量亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 4, remain: 1, rotation: 8, showLabel: true,top:true ,act:false}, "留下4ml亚硝酸钠标准液"],
                [ENJ.Step_BlowLiquid, { bottle: 'tube6', volume: 2, remain: 1, rotation: 25, offsetX: 36, offsetY: 90, showLabel: true,top:false,act:false }, "向干净的容量瓶中加入2ml的亚硝酸钠标准液样品"],
                [ENJ.Step_ConstantVolume, { flask: 'tube6', volume: 50 ,act:false}, "补加蒸馏水，定容至100ml"],
                [ENJ.Step_ShakeUp,{flask:'tube6',act:false},"摇匀比色管"],
                [ENJ.Step_BlowLiquid, { bottle: 'formaldehyde', volume: 0, remain: 2,rightNow: true ,rotation: 1,offsetX: 0, offsetY: -40 ,top:true ,act:true}, "多余的样品，排入废液缸"],

                [ENJ.Step_Interlude_8,{title:"分光计测量"},''],
                [ENJ.Step_DumpToCuvette, { no: 0, targetVolume: 1,bottle:'tube' }, '在光波调整到538nm处之后，取0号比色管溶液，取少量倒入比色皿，摇晃'],
                [ENJ.Step_WashCuvette, { no: 0}, '润洗比色皿，溶液倒入烧杯'],
                [ENJ.Step_DumpToCuvette, { no: 0, targetVolume: 2,bottle:'tube' }, '加溶液至比色皿2/3'],
                [ENJ.Step_WipeCuvette, { no: 0}, '用擦镜纸擦干比色皿光面'],
                [ENJ.Step_InstallCuvette, { no: 0, ox: 0, oy: 0}, '放入第1个比色槽'],

                [ENJ.Step_DumpToCuvette, { no: 1, targetVolume: 1,bottle:'tube1', autoPlay: true }, '取1号比色管溶液，取少量倒入比色皿，摇晃'],
                [ENJ.Step_WashCuvette, { no: 1}, '润洗比色皿，溶液倒入烧杯'],
                [ENJ.Step_DumpToCuvette, { no: 1, targetVolume: 2,bottle:'tube1', autoPlay: true }, '加溶液至比色皿2/3'],
                [ENJ.Step_WipeCuvette, { no: 1}, '用擦镜纸擦干比色皿光面'],
                [ENJ.Step_InstallCuvette, { no: 1, ox: 1, oy: 5}, '放入第2个比色槽'],
                [ENJ.Step_DumpToCuvette, { no: 2, targetVolume: 1,bottle:'tube2', autoPlay: true }, '取2号比色管溶液，取少量倒入比色皿，摇晃'],
                [ENJ.Step_WashCuvette, { no: 2}, '润洗比色皿，溶液倒入烧杯'],
                [ENJ.Step_DumpToCuvette, { no: 2, targetVolume: 2, bottle:'tube2',autoPlay: true }, '加溶液至比色皿2/3'],
                [ENJ.Step_WipeCuvette, { no: 2},'用擦镜纸擦干比色皿光面'],
                [ENJ.Step_InstallCuvette, { no: 2, ox: 2, oy: 10},  '放入第3个比色槽'],
                [ENJ.Step_DumpToCuvette, { no: 3, targetVolume: 1,bottle:'tube3', autoPlay: true }, '取3号比色管溶液，取少量倒入比色皿，摇晃'],
                [ENJ.Step_WashCuvette, { no: 3}, '润洗比色皿，溶液倒入烧杯'],
                [ENJ.Step_DumpToCuvette, { no: 3, targetVolume: 2,bottle:'tube3', autoPlay: true }, '加溶液至比色皿2/3'],
                [ENJ.Step_WipeCuvette, { no: 3}, '用擦镜纸擦干比色皿光面'],
                [ENJ.Step_InstallCuvette, { no: 3, ox: 3, oy: 15}, '放入第4个比色槽'],
                [ENJ.Step_CorrectSpectrophotometer, {},  '调零'],
                [ENJ.Step_MeasureLuminosity, { luminosities: [0.230, 0.429, 0.643]}, '拉三次手柄'],
                [ENJ.Step_Record_8,{a_1:5,y_1:0.076,a_2:10,y_2:0.133,a_3:15,y_3:0.195},'记录三次吸光度值'],
                [ENJ.Step_ResetSpectrophotometer, {firthree:true}, '打开测量盖，取出1-3号比色皿'],

                [ENJ.Step_DumpToCuvette, { no: 4, targetVolume: 1,bottle:'tube4', autoPlay: true }, '取4号比色管溶液，取少量倒入比色皿，摇晃'],
                [ENJ.Step_WashCuvette, { no: 4}, '润洗比色皿，溶液倒入烧杯'],
                [ENJ.Step_DumpToCuvette, { no: 4, targetVolume: 2,bottle:'tube4', autoPlay: true }, '加溶液至比色皿2/3'],
                [ENJ.Step_WipeCuvette, { no: 4}, '用擦镜纸擦干比色皿光面'],
                [ENJ.Step_InstallCuvette, { no: 4, ox: 4, oy: 0}, '放入第2个比色槽'],
                [ENJ.Step_DumpToCuvette, { no: 5, targetVolume: 1, bottle:'tube5',autoPlay: true }, '取5号比色管溶液，取少量倒入比色皿，摇晃'],
                [ENJ.Step_WashCuvette, { no: 5}, '润洗比色皿，溶液倒入烧杯'],
                [ENJ.Step_DumpToCuvette, { no: 5, targetVolume: 2,bottle:'tube5', autoPlay: true },'加溶液至比色皿2/3'],
                [ENJ.Step_WipeCuvette, { no: 5}, '用擦镜纸擦干比色皿光面'],
                [ENJ.Step_InstallCuvette, { no: 5, ox: 5, oy: 0}, '放入第3个比色槽'],
                [ENJ.Step_DumpToCuvette, { no: 6, targetVolume: 1,bottle:'tube6', autoPlay: true }, '取6号比色管溶液，取少量倒入比色皿，摇晃'],
                [ENJ.Step_WashCuvette, { no: 6}, '润洗比色皿，溶液倒入烧杯'],
                [ENJ.Step_DumpToCuvette, { no: 6, targetVolume: 2,bottle:'tube6', autoPlay: true }, '加溶液至比色皿2/3'],
                [ENJ.Step_WipeCuvette, { no: 6}, '用擦镜纸擦干比色皿光面'],
                [ENJ.Step_InstallCuvette, { no: 6, ox: 6, oy: 0}, '放入第4个比色槽'],
                [ENJ.Step_CorrectSpectrophotometer, {}, '调零'],
                [ENJ.Step_MeasureLuminosity, { luminosities: [0.837, 1.050,1.250]}, '拉三次手柄'],
                [ENJ.Step_Record_8,{a_4:20,y_4:0.259,a_5:25,y_5:0.320,a_6:30,y_6:0.386},'记录三次吸光度值'],
                [ENJ.Step_ResetSpectrophotometer, {firthree:false}, '打开测量盖，取出4-6号比色皿']




               // [ENJ.Step_Interlude_8, { title: "静置15分钟之后" }, '']
                //[ENJ.Step_SuckLiquid, { bottle: 'volumetricFlask', volume: 2, remain: false, still: true,ins:true }, "用移液管吸取少量亚硝酸钠标准液样品"]
                /*
               //取样1
               [ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 2, remain: false }, "用移液管吸取少量酱油样品"],
               [ENJ.Step_WashPipe, { pipe: 'pipet' }, "润洗一下移液管"],
               [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液缸"],
               [ENJ.Step_EmptyPipet, { remain: true }, "排入废液缸"],
               [ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 2, remain: false }, "再吸取少量酱油样品"],
               [ENJ.Step_WashPipe, { pipe: 'pipet' }, "二次润洗一下移液管"],
               [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液缸"],
               [ENJ.Step_EmptyPipet, { remain: true }, "排入废液缸"],
               [ENJ.Step_SuckLiquid, { bottle: 'soySauce', volume: 6, remain: true }, "吸取足量酱油样品"],
               [ENJ.Step_BlowLiquid, { bottle: 'soySauce', volume: 4, remain: 1, rotation: 20, showLabel: true }, "留下4ml的酱油样品"],
               [ENJ.Step_BlowLiquid, { bottle: 'volumetricFlask', volume: 2, remain: 1, rotation: 15, offsetX: -20, offsetY: 20, showLabel: true}, "向干净的容量瓶中加入2ml的酱油样品"],
               [ENJ.Step_BlowLiquid, { bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "多余的样品，排入废液缸"],
               [ENJ.Step_EmptyPipet, {}, "多余的样品，排入废液缸"],
               [ENJ.Step_ConstantVolume, { flask: 1, volume: 100 }, "补加蒸馏水，定容至100ml"],
               [ENJ.Step_ShakeUp, { flask: 1 }, "摇匀"],

               [ENJ.Step_WashElectrode, {}, "清洗PH电极"],
               [ENJ.Step_WipeUpElectrode, {}, "擦干PH电极"],

               [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 2, remain: false }, "用移液管吸取少量酱油样品"],
               [ENJ.Step_WashPipe, { pipe: 'bigPipet' }, "润洗一下移液管"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液缸"],
               [ENJ.Step_EmptyPipet, { pipet: 'bigPipet',remain: true }, "排入废液缸"],
               [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 2, remain: false }, "再吸取少量酱油样品"],
               [ENJ.Step_WashPipe, { pipe: 'bigPipet' }, "二次润洗一下移液管"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'bigBeaker', volume: 0.8, remain: 2, rightNow: true }, "排入废液缸"],
               [ENJ.Step_EmptyPipet, { pipet: 'bigPipet', remain: true }, "排入废液缸"],
               [ENJ.Step_SuckLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 6, remain: true }, "吸取足量的酱油样品"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', bottle: 'volumetricFlask', volume: 5, remain: 1, rotation: 15, offsetX: 10, offsetY: 60, showLabel: true }, "留下25ml的酱油样品"],
               [ENJ.Step_BlowLiquid, { pipet: 'bigPipet', beaker: 0, volume: 0, scale: 5, remain: 0, offsetX: 90, offsetY: 120, rotation:15 }, "向干净烧杯中加入25ml的酱油样品"],

               //测定1
               [ENJ.Step_AddRotor, { beaker: 0, rotor: 1 }, "加入一颗转子"],
               [ENJ.Step_StartStirrer, { beaker: 0, rotor: 1 }, "打开电子搅拌器，开始自动搅拌"],
               [ENJ.Step_DumpToBuret, {volume: 20}, "向滴定管中加入少量氢氧化钠溶液"],
               [ENJ.Step_WashPipe, { pipe: 'buret' }, "润洗一下滴定管"],
               [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 0 }, "排入废液缸"],
               [ENJ.Step_DumpToBuret, {volume: 20}, "再向滴定管中加入少量氢氧化钠溶液"],
               [ENJ.Step_WashPipe, { pipe: 'buret' }, "二次润洗一下滴定管"],
               [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 0 }, "排入废液缸"],
               [ENJ.Step_DumpToBuret, {volume: 82}, "向滴定管中加入足量氢氧化钠溶液"],
               [ENJ.Step_BlowBuret, { bottle: 'bigBeaker', volume: 80 }, "滴定管中液面降至零刻度线"],
               [ENJ.Step_InstallBuret, {}, "夹好滴定管"],
               [ENJ.Step_DropFromBuret, {volume: 70, remain: true, pHs: [6.2, 8.2]}, "滴定..."],

               [ENJ.Step_Record_2, { v1_1: 16.41 }, '记录第一次滴定体积'],

               //加甲醛
               [ENJ.Step_SuckLiquid, { pipet: 'pipet2', bottle: 'formaldehyde', volume: 6, remain: false, showLabel: true }, "吸取足量的酱油样品"],
               [ENJ.Step_AddFormaldehyde, { pipet: 'pipet2', beaker: 0, volume: 0}, "向干净烧杯中加入25ml的酱油样品"],

               [ENJ.Step_DropFromBuret, {volume: 60, pHs: [8.2, 9.2]}, "滴定..."],
               [ENJ.Step_StopStirrer, { beaker: 0, rotor: 1 }, "关闭电子搅拌器"],

               [ENJ.Step_Record_2, { v1_2: 16.41, v1_m: 0 }, '记录第一次滴定体积'],


               [ENJ.Step_Interlude_1, {title: "第二次取样和测试"}, ''],
               //取样2
               [ENJ.Step_WashElectrode, {}, "清洗PH电极"],
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

               [ENJ.Step_Record_2, { v2_1: 16.42 }, '记录第二次滴定体积，求出平均值'],

               //加甲醛
               [ENJ.Step_SuckLiquid, { pipet: 'pipet2', bottle: 'formaldehyde', volume: 6, remain: false, showLabel: true }, "吸取足量的酱油样品"],
               [ENJ.Step_AddFormaldehyde, { pipet: 'pipet2', beaker: 2, volume: 0}, "向干净烧杯中加入25ml的酱油样品"],

               [ENJ.Step_DropFromBuret, {volume: 60, pHs: [8.2, 9.2]}, "滴定..."],
               [ENJ.Step_StopStirrer, { beaker: 2, rotor: 0 }, "关闭电子搅拌器"],

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
