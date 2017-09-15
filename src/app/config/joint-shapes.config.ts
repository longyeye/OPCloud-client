const _ = require('lodash')
const joint = require('rappid');

export const jointShapes = {
  CircularModel: null,
  RectangularModel: null,
  Link: null
};



jointShapes.Link = joint.dia.Link.extend({

  defaults: _.defaultsDeep({
    type: 'app.Link',
    router: {
      name: 'normal'
    },
    connector: {
      name: 'normal'
    },
    attrs: {
      '.tool-options': {
        'data-tooltip-class-name': 'small',
        'data-tooltip': 'Click to open Inspector for this link',
        'data-tooltip-position': 'left'
      },
      '.marker-source': {
        d: 'M 10 0 L 0 5 L 10 10 z',
        stroke: 'transparent',
        fill: '#222138',
        transform: 'scale(0.001)'
      },
      '.marker-target': {
        d: 'M 10 0 L 0 5 L 10 10 z',
        stroke: 'transparent',
        fill: '#222138',
        transform: 'scale(1)'
      },
      '.connection': {
        stroke: '#222138',
        'stroke-dasharray': '0',
        'stroke-width': 1
      }
    }
  }, joint.dia.Link.prototype.defaults)
});

