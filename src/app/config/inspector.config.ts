import { inspectorShapes } from './inspectorShapes';
import { inspectorLinks } from './inspectorLinks';
import {CommonFunctions} from "../common/commonFunctions";

export const inspectorConfig = {

  //object parameters
  'opm.Object': CommonFunctions.CreateInspectorShapesPart('rect', inspectorShapes.shapeDefinition, inspectorShapes.textDefinition, inspectorShapes.valueDefinition, inspectorShapes.groupsDefinition),
  //process parameters
  'opm.Process': CommonFunctions.CreateInspectorShapesPart('ellipse', inspectorShapes.shapeDefinition, inspectorShapes.textDefinition, inspectorShapes.functionDefinition, inspectorShapes.groupsDefinition),
  //state parameters
  'opm.State': CommonFunctions.CreateInspectorShapesPart('rect', inspectorShapes.falseDefinition, inspectorShapes.textDefinition, inspectorShapes.falseDefinition, inspectorShapes.groupsDefinition),
  //link parameters
  'opm.Link': {
    inputs: {
      attrs: inspectorLinks.linkDefinition,
      labels: inspectorLinks.labelDefinition
    },
    groups: inspectorLinks.groupsDefinition
  }
};
