/**
 * Created by olegz on 03-Jun-17.
 */
import * as common from "../common/commonFunctions";
import {gridLayout} from "./gridLayout";
import {textWrapping} from "../rappid-components/rappid-main/textWrapping";
const joint = require('rappid');
const paddingObject = common.paddingObject;

export function arrangeStates(side) {
  let options = this.options;
  let fatherObject = options.cellView.model;
  let embeddedStates = fatherObject.getEmbeddedCells();
  let maxWidth = null;
  let maxHeight = null;
  // If the Object has any embedded states
  if (embeddedStates.length) {
    // Find the maximum Height and Width of all the states
    common._.each(embeddedStates, function (child) {
      if (child.getBBox().width > maxWidth) maxWidth = child.getBBox().width;
      if (child.getBBox().height > maxHeight) maxHeight = child.getBBox().height;
    });
    // Set the Height and Width fo every state
    common._.each(embeddedStates, function (child) {
      let stateWidth = (child.getBBox().width * 2 > maxWidth) ? maxWidth : child.getBBox().width;
      let stateHeight = (child.getBBox().height * 2 > maxHeight) ? maxHeight : child.getBBox().height;
      child.set({size: {height: stateHeight, width: stateWidth}});
    });

    if((side == 'top') || (side == 'bottom')){
      var refY = (side == 'top') ? (maxHeight+2*common.paddingObject) : common.paddingObject;
      common.CommonFunctions.arrangeStatesParams(fatherObject, 0.5, refY, 'middle', 'up', side, 0, maxHeight+common.paddingObject);
      textWrapping.updateTextAndSize(fatherObject);
      var marginY = (side == 'top') ? (fatherObject.getBBox().y + paddingObject) : (fatherObject.getBBox().y + fatherObject.getBBox().height - paddingObject - maxHeight);
      updtaeGridLayout(embeddedStates.length, maxWidth + 5, maxHeight, fatherObject.getBBox().x + 0.5*(fatherObject.getBBox().width - (maxWidth + 5) * embeddedStates.length), marginY);
    }
    if((side == 'left') || (side == 'right')){
      var refX = (side == 'left') ? (maxWidth+2*common.paddingObject) : common.paddingObject;
      common.CommonFunctions.arrangeStatesParams(fatherObject, refX, 0.5, 'left', 'middle', side, maxWidth+common.paddingObject, 0);
      textWrapping.updateTextAndSize(fatherObject);
      var marginX = (side == 'left') ? (fatherObject.getBBox().x + paddingObject) : (fatherObject.getBBox().x + fatherObject.getBBox().width - paddingObject - maxWidth);
      updtaeGridLayout(1, maxWidth, maxHeight + 5, marginX, fatherObject.getBBox().y + 0.5*(fatherObject.getBBox().height - (maxHeight + 5) * embeddedStates.length));
    }
  }

  function updtaeGridLayout(columns, columnWidthParam, rowHeightParam, marginXParam, marginYParam){
    gridLayout.layout(embeddedStates, {
      columns: columns,
      rows: embeddedStates.length,
      columnWidth: columnWidthParam,
      rowHeight: rowHeightParam,
      marginX: marginXParam,
      marginY: marginYParam
    });
  }
}
