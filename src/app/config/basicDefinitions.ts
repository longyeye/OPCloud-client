const _ = require('lodash');
const joint = require('rappid');
const g = joint.g;

export const basicDefinitions = {

  stateWidth: 50,
  stateHeight: 25,
  objectProcessWidth: 90,
  objectProcessHeight: 50,

  createShape() {
    return {
      fill: '#DCDCDC',
      magnet : true,
     // stroke: (shapeName == 'rect') ? '#006400' : ((shapeName == 'ellipse') ? '#00008B' : '#808000'),
      'stroke-width': 2,
      // filter: (shapeName == 'state') ? null : {name: 'dropShadow', args: {dx: 3, dy: 3, blur: 0, color: 'grey'}, attrs: { width:5, height:5 }},
      filter: {name: 'dropShadow', args: {dx: 3, dy: 3, blur: 0, color: 'grey'}, attrs: { width:5, height:5 }},
      width: 90,
      height: 50,
  //    rx: (shapeName == 'ellipse') ? 40 : (shapeName == 'state') ? 20 : null,
  //    ry: (shapeName == 'ellipse') ? 40 : (shapeName == 'state') ? 20 : null,
  //    cx: (shapeName == 'ellipse') ? 40 : null,
  //    cy: (shapeName == 'ellipse') ? 40 : null
    };
  },

  createText() {
    return {
    //  text: (shapeName == 'rect') ? 'Object' : (shapeName == 'ellipse') ? 'Process' : 'state',
      fill: 'black',
      'font-size': 14,
      'ref-x': .5,
      'ref-y': .5,
      'x-alignment': 'middle',
      'y-alignment': 'middle',
      'font-family': 'Arial, helvetica, sans-serif',
     // 'font-weight': (shapeName == 'state') ? 300 : 600
      'font-weight': 600
    };
  },

  defineShape() {
    return {
     // markup: `<g class="rotatable"><g class="scalable"><${shapeName}/></g><text/></g>`,
      defaults: _.defaultsDeep({
       // type: (shapeName == 'rect') ? 'opm.Object' : 'opm.Process',
        size: {width: 90, height: 50},
        minSize: {width: 90, height: 50},
      //  padding: (shapeName == 'rect') ? 15 : 35,
        statesWidthPadding : 0,
        statesHeightPadding : 0,
        attrs: {
         // [shapeName]: this.createShape(shapeName),
          'text': this.createText(),
          'value' : {'value' : 'None', 'valueType' : 'None', 'units' : ''},
          'wrappingResized' : false,
          'manuallyResized' : false,
       //   'statesArrange' : 'bottom',
        }
      }, joint.shapes.basic.Generic.prototype.defaults),
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
        type: 'opm.State',
        size: {width: this.stateWidth, height: this.stateHeight},
        minSize: {width: 50, height: 25},
        padding: 10,
        attrs: {
          rect: this.createShape('state'),
          text: this.createText('state'),
          'wrappingResized' : false,
          'manuallyResized' : false,
        },
        'father': null
      }, joint.shapes.basic.Generic.prototype.defaults)
    };
  }
};
