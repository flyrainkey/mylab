var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

gulp.task('uglify-2',function(){
  return gulp.src('./dist/expt2.js')
    .pipe(rename('expt2.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('concat-2',function(){
  return gulp.src([
    'src/entry.js',

    'src/elements/Element.js',
    'src/elements/NumLabel.js',
    'src/elements/Board.js',
    'src/elements/Curve.js',
    'src/elements/LiquidContainer.js',
    'src/elements/SuckBall.js',
    'src/elements/Buret.js',
    'src/elements/BeakerNew.js',
    'src/elements/Cylinder.js',
    'src/elements/WaterBottle.js',
    'src/elements/VolumetricFlask.js',
    'src/elements/SoySauce.js',
    'src/elements/ReagenBottle.js',
    'src/elements/PHElectrode.js',
    'src/elements/PHInstrument.js',
    'src/elements/MagneticStirrer.js',
    'src/elements/TitrationStand.js',
    'src/elements/Pipet.js',
    'src/elements/ResultTable_2.js',

    'src/scenes/Scene.js',
    'src/scenes/Scene_2.js',
    //'src/scenes/Scene_3.js',

    'src/steps/Step.js',
    'src/steps/Step_CutBag.js',
    'src/steps/Step_WashBag.js',
    'src/steps/Step_DumpPowder.js',
    'src/steps/Step_DumpWater.js',
    'src/steps/Step_BlowLiquid.js',
    'src/steps/Step_SuckLiquid.js',
    'src/steps/Step_StirLiquid.js',
    'src/steps/Step_TransferLiquid.js',
    'src/steps/Step_ConstantVolume.js',
    'src/steps/Step_ShakeUp.js',
    'src/steps/Step_WashElectrode.js',
    'src/steps/Step_WipeUpElectrode.js',
    'src/steps/Step_DumpFromFlask.js',
    'src/steps/Step_AddRotor.js',
    'src/steps/Step_StartStirrer.js',
    'src/steps/Step_StopStirrer.js',
    'src/steps/Step_CorrectPHInstrument.js',
    'src/steps/Step_WashPipe.js',
    'src/steps/Step_EmptyPipet.js',
    'src/steps/Step_DumpToCylinder.js',
    'src/steps/Step_DumpFromCylinder.js',
    'src/steps/Step_DumpToBuret.js',
    'src/steps/Step_BlowBuret.js',
    'src/steps/Step_InstallBuret.js',
    'src/steps/Step_DropFromBuret.js',
    'src/steps/Step_Interlude_1.js',
    'src/steps/Step_Interlude_2.js',
    'src/steps/Step_Record_2.js',



    'src/scripts/Script.js',
    'src/scripts/Script_2.js',
    //'src/scripts/Script_3.js',

    'src/expts/Experiment.js',

    'src/Lab.js',

    'src/exit2.js'
  ]).pipe(concat('expt2.js')).pipe(gulp.dest('./dist/'));
});

gulp.task('uglify-3',function(){
  return gulp.src('./dist/expt3.js')
    .pipe(rename('expt3.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('concat-3',function(){
  return gulp.src([
    'src/entry.js',

    'src/elements/Element.js',
    'src/elements/NumLabel.js',
    'src/elements/Board.js',
    'src/elements/Curve.js',
    'src/elements/LiquidContainer.js',
    'src/elements/SuckBall.js',
    'src/elements/Buret.js',
    'src/elements/Beaker.js',
    'src/elements/Cylinder.js',
    'src/elements/WaterBottle.js',
    'src/elements/VolumetricFlask.js',
    'src/elements/SoySauce.js',
    'src/elements/ReagenBottle.js',
    'src/elements/PHElectrode.js',
    'src/elements/PHInstrument.js',
    'src/elements/MagneticStirrer.js',
    'src/elements/TitrationStand.js',
    'src/elements/Pipet.js',
    'src/elements/ResultTable_3.js',

    'src/scenes/Scene.js',
    'src/scenes/Scene_3.js',

    'src/steps/Step.js',
    'src/steps/Step_CutBag.js',
    'src/steps/Step_WashBag.js',
    'src/steps/Step_DumpPowder.js',
    'src/steps/Step_DumpWater.js',
    'src/steps/Step_BlowLiquid.js',
    'src/steps/Step_SuckLiquid.js',
    'src/steps/Step_StirLiquid.js',
    'src/steps/Step_TransferLiquid.js',
    'src/steps/Step_ConstantVolume.js',
    'src/steps/Step_ShakeUp.js',
    'src/steps/Step_WashElectrode.js',
    'src/steps/Step_WipeUpElectrode.js',
    'src/steps/Step_DumpFromFlask.js',
    'src/steps/Step_AddRotor.js',
    'src/steps/Step_AddFormaldehyde.js',
    'src/steps/Step_StartStirrer.js',
    'src/steps/Step_StopStirrer.js',
    'src/steps/Step_CorrectPHInstrument.js',
    'src/steps/Step_WashPipe.js',
    'src/steps/Step_EmptyPipet.js',
    'src/steps/Step_DumpToCylinder.js',
    'src/steps/Step_DumpFromCylinder.js',
    'src/steps/Step_DumpToBuret.js',
    'src/steps/Step_BlowBuret.js',
    'src/steps/Step_InstallBuret.js',
    'src/steps/Step_DropFromBuret.js',
    'src/steps/Step_Interlude_1.js',
    'src/steps/Step_Interlude_2.js',
    'src/steps/Step_Interlude_3.js',
    'src/steps/Step_Record_2.js',


    'src/scripts/Script.js',
    'src/scripts/Script_3.js',

    'src/expts/Experiment.js',

    'src/Lab.js',

    'src/exit3.js'
  ]).pipe(concat('expt3.js')).pipe(gulp.dest('./dist/'));
});
gulp.task('uglify-8',function(){
  return gulp.src('./dist/expt8.js')
      .pipe(rename('expt8.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/'))
});
gulp.task('concat-8',function(){
  return gulp.src([
    'src/entry.js',

    'src/elements/Element.js',
    'src/elements/NumLabel.js',
    'src/elements/Board.js',
    'src/elements/Curve.js',
    'src/elements/LiquidContainer.js',
    'src/elements/SuckBall.js',
    'src/elements/Buret.js',
    'src/elements/BeakerNew.js',
    'src/elements/Cylinder.js',
    'src/elements/WaterBottle.js',
    'src/elements/VolumetricFlask.js',
    'src/elements/SoySauce.js',
    'src/elements/ReagenBottle.js',
    'src/elements/PHElectrode.js',
    'src/elements/PHInstrument.js',
    'src/elements/MagneticStirrer.js',
    'src/elements/TitrationStand.js',
    'src/elements/Pipet.js',
    'src/elements/ResultTable_3.js',
    'src/elements/BeakerNew.js',
    'src/elements/Arrow.js',
    'src/elements/Tube.js',
    'src/skins/Skin.js',
    'src/skins/DigitalDisplay.js',
    'src/skins/Spectrophotometer.js',
    'src/skins/LiquidLayer.js',
    'src/skins/BeakerNew.js',
    'src/skins/Cuvette.js',
    'src/elements/ResultTable_8.js',



    'src/scenes/Scene.js',
    'src/scenes/Scene_8.js',

    'src/steps/Step.js',
    'src/steps/Step_CutBag.js',
    'src/steps/Step_WashBag.js',
    'src/steps/Step_DumpPowder.js',
    'src/steps/Step_DumpWater.js',
    'src/steps/Step_BlowLiquid.js',
    'src/steps/Step_SuckLiquid.js',
    'src/steps/Step_StirLiquid.js',
    'src/steps/Step_TransferLiquid.js',
    'src/steps/Step_ConstantVolume.js',
    'src/steps/Step_ShakeUp.js',
    'src/steps/Step_WashElectrode.js',
    'src/steps/Step_WipeUpElectrode.js',
    'src/steps/Step_DumpFromFlask.js',
    'src/steps/Step_AddRotor.js',
    'src/steps/Step_AddFormaldehyde.js',
    'src/steps/Step_StartStirrer.js',
    'src/steps/Step_StopStirrer.js',
    'src/steps/Step_CorrectPHInstrument.js',
    'src/steps/Step_WashPipe.js',
    'src/steps/Step_EmptyPipet.js',
    'src/steps/Step_EmptyPipet8.js',
    'src/steps/Step_DumpToCylinder.js',
    'src/steps/Step_DumpFromCylinder.js',
    'src/steps/Step_DumpToBuret.js',
    'src/steps/Step_BlowBuret.js',
    'src/steps/Step_InstallBuret.js',
    'src/steps/Step_DropFromBuret.js',
    'src/steps/Step_Interlude_1.js',
    'src/steps/Step_Interlude_2.js',
    'src/steps/Step_Interlude_3.js',
    'src/steps/Step_Interlude_8.js',
    'src/steps/Step_Record_2.js',
    'src/steps/Step_BlowPool.js',
    'src/steps/Step_DumpToCuvette.js',
     'src/Steps/Step_WashCuvette.js',
      'src/Steps/Step_wipeCuvette.js',
      'src/Steps/Step_InstallCuvette.js',
      'src/Steps/Step_CorrectSpectrophotometer.js',
      'src/Steps/Step_MeasureLuminosity.js',
      'src/Steps/Step_ResetSpectrophotometer.js',
      'src/Steps/Step_Record_8.js',




    'src/scripts/Script.js',
    'src/scripts/Script_8.js',

    'src/expts/Experiment.js',

    'src/Lab.js',

    'src/exit8.js'

  ]).pipe(concat('expt8.js')).pipe(gulp.dest('./dist/'));
});


gulp.task('concat-12',function(){
  return gulp.src([
    '1.js','2.js'
  ]).pipe(concat('12.js')).pipe(gulp.dest('./dist/'));
});

gulp.task('default',['concat-12']);
gulp.task('watch', function () {
  // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
  return watch('src/**/*.js', function () {
    gulp.src('src/**/*.js')
        .pipe(gulp.dest('build'));
  });
});

//gulp.watch('src/**/*.js')