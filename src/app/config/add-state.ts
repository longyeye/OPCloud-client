import {basicDefinitions} from "./basicDefinitions";
import * as common from "../common/commonFunctions";
import {arrangeStates} from "../config/arrangeStates";
const joint = require('rappid');
let objectChangedSize = false;

function saveValues(cell, parent) {
  cell.set('originalSize', cell.get('size'));
  cell.set('originalPosition', cell.get('position'));
  if (parent) {
    if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
    if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));
  }
}

export function addNewState(fatherObject, graph) {
  let defaultState = new joint.shapes.opm.State(basicDefinitions.defineState());
  fatherObject.embed(defaultState);     //makes the state stay in the bounds of the object
  graph.addCells([fatherObject, defaultState]);
  //Placing the new state. By default it is outside the object.
  let xNewState = fatherObject.getBBox().center().x - basicDefinitions.stateWidth / 2;
  let yNewState = fatherObject.getBBox().y + fatherObject.getBBox().height - basicDefinitions.stateHeight - common.paddingObject;
  defaultState.set('father', defaultState.get('parent'));
  if (fatherObject.get('embeds') && fatherObject.get('embeds').length) {
    common._.each(fatherObject.getEmbeddedCells(), function (child) {
      if (!fatherObject.getBBox().containsPoint(child.getBBox().origin()) || !fatherObject.getBBox().containsPoint(child.getBBox().topRight()) || !fatherObject.getBBox().containsPoint(child.getBBox().corner()) || !fatherObject.getBBox().containsPoint(child.getBBox().bottomLeft())) {
        child.set({position: {x: xNewState, y: yNewState}});
      }
    });
  }
  graph.on('change:position', function (cell) {
    let parentId = cell.get('parent');
    let parent = graph.getCell(parentId);
    saveValues(cell, parent);
    if (parentId) {        //State case
      common.CommonFunctions.updateObjectSize(parent);
    }
    else if (cell.get('embeds') && cell.get('embeds').length) {  //Object case
      if (objectChangedSize) {
        common.CommonFunctions.updateObjectSize(cell);
        objectChangedSize = false;
      }
    }
  });
  graph.on('change:size', function (cell) {
    let parentId = cell.get('parent');
    let parent = graph.getCell(parentId);
    saveValues(cell, parent);
    if (parentId) {        //State case
      common.CommonFunctions.updateObjectSize(parent);
    }
    else if (cell.get('embeds') && cell.get('embeds').length) {  //Object case
      objectChangedSize = true;
      common.CommonFunctions.updateObjectSize(cell);
    }
  });
  //Add the new state using the current states arrangement
  if (fatherObject.get('embeds').length < 2) {
    arrangeStates.call(this, 'bottom');
  }
  else {
    arrangeStates.call(this, fatherObject.attributes.attrs.statesArrange);
  }
}

export function addState() {
  let options = this.options;
  //this.startBatch();
  let fatherObject = options.cellView.model;
  addNewState.call(this, fatherObject, options.graph);
}
