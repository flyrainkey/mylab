//######################################################################################################################
// src/skins/NumberLabel.js
//######################################################################################################################
(function() {
  var Skin = ENJ.Skin;
  var Text = CreateJS.Text;
  var Bitmap = CreateJS.Bitmap;

  var base = Skin.prototype;

  function NumberLabel(props) {
    Skin.call(this, props);
  }

  ENJ.defineClass({
    constructor: NumberLabel,
    extend: Skin,

    register: function() {
      base.register.call(this);
      this.digits = 2;
      this.number = 0;
      this.unit = '';
    },

    ready: function(props) {
      var field, label;

      label = new Bitmap(RES.getRes('数字标签'));

      field = new Text();
      field.set({
        color: '#fff',
        font: '12px Arial',
        x: 15, y: 5
      });
      //field.color = '#fff';
      //field.font = '12px Arial';

      this.addChild(label, field);

      this.field = field;
      //this.save({temperature: 'temperature' in props ? props.temperature : 0});
      this.onChange('number');
    },

    onChange: function(key, val, old) {
      if (key === 'number') {
        this.field.text = this.number.toFixed(this.digits) + this.unit;
      }
    }
  });

  ENJ.NumberLabel = NumberLabel;
})();
