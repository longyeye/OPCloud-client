import { opmStyle } from '../config/opmStyle';
export const _ = require('lodash');
export const paddingObject = 10;
export const joint = require('rappid');
export const width = require('text-width');
export const height = require('text-height');

export const CommonFunctions = {

  // Function gets cell and restore default configuration in all field that states arrangement use.
  arrangeStatesParams(cell, refX, refY, alignX, alignY, arrangeState, stateWidthPadding, statesHeightPadding){
    cell.attr({text: {'ref-x': refX}});
    cell.attr({text: {'ref-y': refY}});
    cell.attr({text: {'x-alignment': alignX}});
    cell.attr({text: {'y-alignment': alignY}});
    cell.attr({'statesArrange': arrangeState});
    cell.set('statesWidthPadding', stateWidthPadding);
    cell.set('statesHeightPadding', statesHeightPadding);
  },
// Function updateObjectSize Update the size of the object so that no embedded cell will exceed the father border with
// padding of 10p.
  updateObjectSize(fatherCell) {
    let leftSideX = fatherCell.get('position').x;
    let topSideY = fatherCell.get('position').y;
    let rightSideX = fatherCell.get('position').x + fatherCell.get('size').width;
    let bottomSideY = fatherCell.get('position').y + fatherCell.get('size').height;

    _.each(fatherCell.getEmbeddedCells(), function(child) {
      let childBbox = child.getBBox();
      // Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object
      if (childBbox.x <= (leftSideX + paddingObject)) { leftSideX = childBbox.x-paddingObject; }
      if (childBbox.y <= (topSideY + paddingObject)) { topSideY = childBbox.y-paddingObject; }
      if (childBbox.corner().x >= rightSideX-paddingObject) { rightSideX = childBbox.corner().x+paddingObject; }
      if (childBbox.corner().y >= bottomSideY-paddingObject) { bottomSideY = childBbox.corner().y+paddingObject; }
    });
    fatherCell.set({
      position: { x: leftSideX, y: topSideY },
      size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }});
  },

  updateProcessSize(fatherCell){
    var leftSideX = fatherCell.get('position').x;
    var topSideY = fatherCell.get('position').y;
    var rightSideX = fatherCell.get('position').x + fatherCell.get('size').width;
    var bottomSideY = fatherCell.get('position').y + fatherCell.get('size').height;

    var elps = joint.g.ellipse.fromRect(fatherCell.getBBox());
    _.each(fatherCell.getEmbeddedCells(), function(child) {

      var childBbox = child.getBBox();
      //Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object

      if (!elps.containsPoint(childBbox.bottomLeft())){
        bottomSideY = bottomSideY+paddingObject;
        leftSideX = leftSideX - paddingObject;
      }
      if (!elps.containsPoint(childBbox.origin())){
        topSideY = topSideY - paddingObject ;
        leftSideX = leftSideX - paddingObject;
      }
      if (!elps.containsPoint(childBbox.corner())){
        bottomSideY = bottomSideY+paddingObject;
        rightSideX = rightSideX + paddingObject;
      }
      if (!elps.containsPoint(childBbox.topRight())){
        topSideY = topSideY - paddingObject ;
        rightSideX = rightSideX + paddingObject;
      }
    });
    fatherCell.set({
      position: { x: leftSideX, y: topSideY },
      size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }},{skipExtraCall:true});
  },
//Function createGroup. Get the name of the group, its index and if it should be collapsed and generates a group object
// Function createGroup. Get the name of the group, its index and if it should be collapsed and generates a group object
  createGroup(labelName, indexNumber, isClosed = false) {
    return {
      label: labelName,
      index: indexNumber,
      closed: isClosed
    };
  },

//Function CreateSelection. Gets selection type (select or select-box), selection label, in which inspector group it should be and the index.
//The function defines options object for selection according to the label.
//The function return selection object.
  createSelection(selectionType, selectionOptions, selectionLabel, selectionGroup, selectionIndex, selectionDefault = '') {
    return {
      type: selectionType,
      label: selectionLabel,
      defaultValue: selectionDefault,
      options: selectionOptions,
      group: selectionGroup,
      index: selectionIndex
    }
  },

//Function CreateColorsObject. Gets label and index and generate a color-plate object in Styling group
  createColorsObject(colorsLabel, colorsIndex) {
    return {
      type: 'color-palette',
      options: opmStyle.inspectorFont.colorPalette,
      label: colorsLabel,
      group: 'styling',
      index: colorsIndex
    };
  },

// Function CreateRangeObject gets minimum and maximum values (default 10 and 40), label and index and generates a range object.
  createRangeObject(minValue = 10, maxValue = 40, rangeLabel, rangeIndex) {
    return {
      type: 'range',
      min: minValue,
      max: maxValue,
      step: 1,
      unit: 'px',
      label: rangeLabel,
      group: 'styling',
      index: rangeIndex
    };
  },

//Function CreateTextContentObject gets text label, text group and index and generates a text box object.
  createTextContentObject(textLabel, textGroup, textIndex){
    return {
      type: 'content-editable',
      label: textLabel,
      group: textGroup,
      index: textIndex,
    };
  },

  //Function CreateInspectorPart gets shapeName and needed definitions and generates suitable fields in the inspector.
  //Fits for object, process and state (doesn't fit for link)
  CreateInspectorShapesPart(shapeName, shapeDefinition, textDefinition, valueDefinition, groupsDefinition) {
    var inspectorPart = {
      inputs: {
        attrs: {
          [shapeName]: shapeDefinition,
          text: textDefinition,
          value: valueDefinition,
        }
      },
      groups: groupsDefinition
    }
    return inspectorPart;
  }
};
