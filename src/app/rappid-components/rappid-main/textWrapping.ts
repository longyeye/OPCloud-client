import * as common from "../../common/commonFunctions";

export const wrapAndSize = {
  width: 0,
  height: 0,
  text: ''
};

export const textWrapping = {

  updateCell(cell, x, y, cornerX, cornerY){
    cell.set({
      position: {x: x, y: y},
      size: {width: cornerX - x, height: cornerY - y}
    });
  },

  getTextWidth(text, fontSize, fontWeight, fontFamily){
    return common.width(text, {
      family: fontFamily,
      size: fontSize,
      weight: fontWeight
    });
  },

  getTextHeight(text, fontSize, fontWeight, fontFamily){
    return common.height(text, {
      family: fontFamily,
      size: fontSize,
      weight: fontWeight
    }).height;
  },

  getParagraphWidth(text, cell){
    var size;
    var textArray = text.split('\n');
    var maxLineWidth = 0;
    for (var i = 0; i < textArray.length; i++) {
      var textWidth = this.getTextWidth(textArray[i], cell.attributes.attrs.text['font-size'], cell.attributes.attrs.text['font-weight'], cell.attributes.attrs.text['font-family']);
      if (textWidth > maxLineWidth)
        maxLineWidth = textWidth;
    }
    return maxLineWidth;
  },

  getParagraphHeight(text, cell){
    var textArray = text.split('\n');
    var textHeight = this.getTextHeight(textArray[0], cell.attributes.attrs.text['font-size'], cell.attributes.attrs.text['font-weight'], cell.attributes.attrs.text['font-family']);
    return textArray.length * textHeight;
  },

  wrapTextAfterSizeChange(cell){
    var textString = cell.attributes.attrs.text.text;
    if (!textString) return;
    cell.attributes.attrs.manuallyResized = true;
    textString = this.refactorText(cell, cell.get('size').width);
    if (textString != cell.attributes.attrs.text.text)  cell.attr({text: {text: textString}});
    var heightTextAndStates = this.getParagraphHeight(textString, cell) + cell.get('statesHeightPadding') + cell.get('padding');
    var widthTextAndStates = this.getParagraphWidth(textString, cell) + cell.get('statesWidthPadding') + cell.get('padding');
    if((heightTextAndStates > cell.get('size').height) || (widthTextAndStates> cell.get('size').width)){
      cell.resize(widthTextAndStates, heightTextAndStates);
    }
  },

  //units have to be bellow the object's name
  unitsNewLine(textString){
    if (textString.includes('[') && !textString.includes('\n[')) {
      textString = textString.replace('[', '\n[');
      if (textString.includes('[\n')) {
        textString = textString.replace('[\n', '[');
      }
    }
    return textString;
  },

  wrapText(cell, width){
    var textString = cell.attr('text/text');
    if (!textString) return;
    var textString = textString.replace(/\n/g, ' ');
    var wordsArr = textString.split(' ');
    var newStr = wordsArr[0];
    var i = 1;
    while (i < wordsArr.length) {
      if (this.getParagraphWidth((newStr + ' ' + wordsArr[i]), cell) < width) {
        newStr = newStr + ' ' + wordsArr[i];
      }
      else {
        newStr = newStr + '\n' + wordsArr[i];
      }
      i++;
    }
    return newStr;
  },

  refactorText(cell, width){
    var textString = this.wrapText(cell, width);
    //wrapText remove spaces from the end
    var lastChar = cell.attr('text/text').charAt(cell.attr('text/text').length - 1);
    textString = ((lastChar == ' ') || (lastChar == '\u00A0')) ? (textString + ' ') : textString;
    textString = this.unitsNewLine(textString);
    return textString;
  },

  calculateNewTextSize(textString, cell){
    var addition = 1, increase = false;
    var stateWidth = cell.get('statesWidthPadding');
    var stateHeight = cell.get('statesHeightPadding');
    var result = wrapAndSize;
    textString = this.refactorText(cell, cell.get('size').width - stateWidth - cell.get('padding'));
    var textWidth = this.getParagraphWidth(textString, cell) + stateWidth;
    var textHeight = this.getParagraphHeight(textString, cell) + stateHeight;
    while ((textHeight > (cell.get('size').height * addition - cell.get('padding'))) || (textWidth > (cell.get('size').width * addition - cell.get('padding')))) {
      increase = true;
      addition = addition * 1.1;
      textString = this.refactorText(cell, cell.get('size').width * addition - stateWidth - cell.get('padding'));
      textWidth = this.getParagraphWidth(textString, cell) + stateWidth;
      textHeight = this.getParagraphHeight(textString, cell) + stateHeight;
    }
    while ((textHeight < (cell.get('size').height * addition/1.1 - cell.get('padding'))) && (textWidth < (cell.get('size').width * addition/1.1 - cell.get('padding'))) &&
    (cell.get('size').height * addition/1.1 > cell.get('minSize').height) && (cell.get('size').width * addition/1.1 > cell.get('minSize').width) && !increase) {
      addition = addition / 1.1;
      textString = this.refactorText(cell, cell.get('size').width * addition - stateWidth - cell.get('padding'));
      textWidth = this.getParagraphWidth(textString, cell) + stateWidth;
      textHeight = this.getParagraphHeight(textString, cell) + stateHeight;
    }
    result.width = cell.get('size').width * addition;
    result.height = cell.get('size').height * addition;
    result.text = textString;
    return result;
  },

  updateTextAndSize(cell){
    var newParams = this.calculateNewTextSize(cell.attr('text/text'), cell);
    cell.attr({text: {text: newParams.text}});
    cell.resize(newParams.width, newParams.height);
  }
};
