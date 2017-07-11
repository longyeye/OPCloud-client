const _ = require('lodash');
const joint = require('rappid');
const g = joint.g;

export const basicDefinitions = {

  stateWidth: 50,
  stateHeight: 25,

  textWrap(s, textWidth){
    return joint.util.breakText(s, {width: textWidth});
  },

  createShape(shapeName){
    return {
      fill: '#DCDCDC',
      magnet : true,
      stroke: (shapeName == 'rect') ? '#006400' : ((shapeName == 'ellipse') ? '#00008B' : '#808000'),
      'stroke-width': 2,
      filter: (shapeName == 'state') ? null : {name: 'dropShadow', args: {dx: 3, dy: 3, blur: 0, color: 'grey'}},
      width: 90,
      height: 50,
      rx: (shapeName == 'ellipse') ? 40 : (shapeName == 'state') ? 20 : null,
      ry: (shapeName == 'ellipse') ? 40 : (shapeName == 'state') ? 20 : null,
      cx: (shapeName == 'ellipse') ? 40 : null,
      cy: (shapeName == 'ellipse') ? 40 : null
    };
  },

  createText(shapeName){
    var textOnShape = (shapeName == 'rect') ? 'Object' : (shapeName == 'ellipse') ? 'Process' : 'state';
    return {
      text: this.textWrap(textOnShape, 112),
      fill: 'black',
      'font-size': 14,
      'ref-x': .5,
      'ref-y': .5,
      'text-anchor': 'middle',
      'y-alignment': 'middle',
      'font-family': 'Arial, helvetica, sans-serif',
      'font-weight': (shapeName == 'state') ? 300 : 600
    }
  },

  defineShape(shapeName){
    return {
      markup: `<g class="rotatable"><g class="scalable"><${shapeName}/></g><text/></g>`,
      defaults: _.defaultsDeep({
        type: (shapeName == 'rect') ? 'opm.Object' : 'opm.Process',
        size: {width: 90, height: 50},
        attrs: {
          [shapeName]: this.createShape(shapeName),
          'text': this.createText(shapeName),
          'value' : {'value' : 'None', 'valueType' : 'None', 'units' : ''},
          'wrappingResized' : false,
          'manuallyResized' : false,
          'statesArrange' : 'bottom'
        }
      }, joint.shapes.basic.Generic.prototype.defaults)
    };
  },

  defineLink(){
    return {
      defaults: _.defaultsDeep({
        type: 'opm.Link',
        attrs: {'.connection': { 'stroke-width': 2, 'stroke-dasharray': '8 5' }},
        labels: [{ position: 0.5, attrs: { text: { text: '' } } }]
      }, joint.dia.Link.prototype.defaults)
    };
  },

  defineState() {
    return {
      markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',
      defaults: _.defaultsDeep({
        type: 'opm.StateNorm',
        size: {width: this.stateWidth, height: this.stateHeight},
        attrs: {
          rect: this.createShape('state'),
          text: this.createText('state'),
        },
        'father': null
      }, joint.shapes.basic.Generic.prototype.defaults)
    };
  }
};
