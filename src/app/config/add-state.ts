import {basicDefinitions} from "./basicDefinitions";
const joint = require('rappid');
const _ = require('lodash');
const paddingObject = 10;

//Return true if the object contains a state which exceeds it (with a padding of paddingObject)
function updateObject(fatherCell){
  var leftSideX = fatherCell.get('originalPosition').x;
  var topSideY = fatherCell.get('originalPosition').y;
  var rightSideX = fatherCell.get('originalPosition').x + fatherCell.get('originalSize').width;
  var bottomSideY = fatherCell.get('originalPosition').y + fatherCell.get('originalSize').height;

  _.each(fatherCell.getEmbeddedCells(), function(child) {
    var childBbox = child.getBBox();
    //Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object
    if (childBbox.x <= (leftSideX+paddingObject)) { leftSideX = childBbox.x-paddingObject; }
    if (childBbox.y <= (topSideY+paddingObject)) { topSideY = childBbox.y-paddingObject; }
    if (childBbox.corner().x >= rightSideX-paddingObject) { rightSideX = childBbox.corner().x+paddingObject; }
    if (childBbox.corner().y >= bottomSideY-paddingObject) { bottomSideY = childBbox.corner().y+paddingObject; }
  });
  fatherCell.set({
    position: { x: leftSideX, y: topSideY },
    size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }});
}

export function addState () {

  var options = this.options;
  //this.startBatch();
  var fatherObject = options.cellView.model;
  var defaultState = new joint.shapes.opm.StateNorm(basicDefinitions.defineState());
  fatherObject.embed(defaultState);     //makes the state stay in the bounds of the object
  options.graph.addCells([fatherObject, defaultState]);

  //Placing the new state. By default it is outside the object.
  var xNewState = fatherObject.getBBox().center().x - basicDefinitions.stateWidth/2;
  var yNewState = fatherObject.getBBox().y + fatherObject.getBBox().height - basicDefinitions.stateHeight - paddingObject;
  if (fatherObject.get('embeds') && fatherObject.get('embeds').length){
    _.each(fatherObject.getEmbeddedCells(), function(child) {
      if (!fatherObject.getBBox().containsPoint(child.getBBox().origin()) ||
          !fatherObject.getBBox().containsPoint(child.getBBox().topRight()) ||
          !fatherObject.getBBox().containsPoint(child.getBBox().corner()) ||
          !fatherObject.getBBox().containsPoint(child.getBBox().bottomLeft())) {
        child.set({position: {x: xNewState, y: yNewState}});
      }
    });
  }

  options.graph.on('change:position change:size', function(cell) {
    cell.set('originalSize', cell.get('size'));
    cell.set('originalPosition', cell.get('position'));

    var parentId = cell.get('parent');
    if (parentId){
      var parent = options.graph.getCell(parentId);
      if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
      if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));
      updateObject(parent);
    }
    else if (cell.get('embeds') && cell.get('embeds').length){
      updateObject(cell);
    }
  });
}