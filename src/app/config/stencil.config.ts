import { opmShapes } from './opm-shapes.config';
import {OpmProcess} from '../models/OpmProcess';
import {OpmObject} from '../models/OpmObject';

export const stencilConfig = {
  shapes: [
    new OpmProcess(),
    new OpmObject()
  ]
};
