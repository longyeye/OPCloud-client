/**
 * OPM Shapes Library for JointJS
 * Developed by:
 * Nadav Oved, Aviv Sugarman, Oleg Zendel, Itamar Shafran and Or Keren
 * for the OPCloud Project
 */
const joint = require('rappid');
export const _ = require('lodash');
import { basicDefinitions } from './basicDefinitions';
import {OpmProcess} from '../models/OpmProcess';
import { OpmObject } from '../models/OpmObject';

export const opmShapes = {
  // OPM Links definitions

  Link: joint.dia.Link.extend(basicDefinitions.defineLink()),
  Object: new OpmObject(),
  Process: new OpmProcess(),
  State: joint.dia.Element.extend(basicDefinitions.defineState()),
  TriangleAgg: joint.shapes.devs.Model.extend({
    markup: '<image/>',
    defaults: _.defaultsDeep({
      type: 'opm.TriangleAgg',
      size: {width: 30, height: 30},
      inPorts: ['in'],
      outPorts: ['out'],
      ports: {
        groups: {
          'in': {
            position: {
              name: 'top'
            },
            attrs: {
              '.port-body': {
                fill: 'black',
                magnet: 'passive',
                r: 1
              }
            },
            label: {markup: '<text class="label-text"/>'}
          },
          'out': {
            position: {
              name: 'bottom'
            },
            attrs: {
              '.port-body': {
                fill: 'black',
                magnet: 'passive',
                r: 1
              }
            },
            label: {markup: '<text class="label-text"/>'}
          }
        }
      },
      attrs: {
        image: { 'xlink:href': '../../assets/OPM_Links/StructuralAgg.png', width: 30, height: 30},
      }
    }, joint.shapes.devs.Model.prototype.defaults)
  }),
  StructLink: joint.shapes.devs.Link.extend({
    defaults: _.defaultsDeep({
      type: 'opm.StructLink',
      router: {name: 'manhattan', args: { step: 5}},
//      connection: { name: 'orthogonal' },
      attrs: {'.link-tools': {display: 'none'}, '.marker-arrowheads': {display: 'none'}}
    }, joint.shapes.devs.Link.prototype.defaults)
  })
};

joint.shapes.opm = opmShapes;

