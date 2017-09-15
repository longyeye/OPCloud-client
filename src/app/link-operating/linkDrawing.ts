const joint = require('rappid');

const DictOfLinksValue = {
  "Unidirectional_Relation": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 8,34 L -12,25 L 8,16 L -12,25 L 8,34 M -12,25', 'stroke-width': 2}},
  "Uni-direct(tag)": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 8 34 L -12 25 L 8 16 L-12 25 L 8 34 M -12,25', 'stroke-width': 2}},
  "Bidirectional_Relation": {src: true, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 8,33 L -12,25 L 8,33 L-12,25 Z', 'stroke-width': 2}},
  "Bi-direct(tag)": {src: true, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 8,33 L -12,25 L 8,33 L-12,25 Z', 'stroke-width': 2}},
  "Bi-direct(ftag, btag)": {src: true, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 8,33 L -12,25 L 8,33 L-12,25 Z', 'stroke-width': 2}},
  "Aggregation-Participation": {src: false, dst: false, middle: true, c: false, e: false, value: 'StructuralAgg.png'},
  "Exhibition-Characterization": {src: false, dst: false, middle: true, c: false, e: false, value: 'StructuralExhibit.png'},
  "Generalization-Specialization": {src: false, dst: false, middle: true, c: false, e: false, value: 'StructuralGeneral.png'},
  "Classification-Instantiation": {src: false, dst: false, middle: true, c: false, e: false, value: 'StructuralSpecify.png'},
  "Result": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'white', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25', 'stroke-width': 2}},
  "Consumption": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'white', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25', 'stroke-width': 2}},
  "Effect": {src: true, dst: true, middle: false, c: false, e: false, value: {fill: 'white', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25', 'stroke-width': 2}},
  "Agent": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0', 'stroke-width': 2}},
  "Instrument": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'white', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0', 'stroke-width': 2}},
  "Invocation": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'white', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25', 'stroke-width': 2}},
  "Overtime_exception": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 32 46  L40 32  L48 16  M40 31 L16 31', 'stroke-width': 2}},
  "Undertime_exception": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 32 46  L40 32  L48 16  M40 31 L16 31 Z M 42 46  L50 32  L58 16  M50 31 L26 31', 'stroke-width': 2}},
  "Undertime_and_overtime_exception": {src: false, dst: true, middle: false, c: false, e: false, value: {fill: 'black', d: 'M 22 46  L30 32  L38 16  M30 31 L6 31 Z M 32 46  L40 32  L48 16  M40 31 L16 31 Z M 52 46  L60 32  L68 16  M60 31 L36 31', 'stroke-width': 2}},
  "Condition_Consumption": {src: false, dst: true, middle: false, c: true, e: false, value: {fill: 'white', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25', 'stroke-width': 2}},
  "Condition_Effect": {src: true, dst: true, middle: false, c: true, e: false, value: {fill: 'white', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25', 'stroke-width': 2}},
  "Condition_Instrument": {src: false, dst: true, middle: false, c: true, e: false, value: {fill: 'white', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0', 'stroke-width': 2}},
  "Condition_Agent": {src: false, dst: true, middle: false, c: true, e: false, value: {fill: 'black', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0', 'stroke-width': 2}},
  "Event_Consumption": {src: false, dst: true, middle: false, c: false, e: true, value: {fill: 'white', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25', 'stroke-width': 2}},
  "Event_Effect": {src: true, dst: true, middle: false, c: false, e: true, value: {fill: 'white', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25', 'stroke-width': 2}},
  "Event_Instrument": {src: false, dst: true, middle: false, c: false, e: true, value: {fill: 'white', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0', 'stroke-width': 2}},
  "Event_Agent": {src: false, dst: true, middle: false, c: false, e: true, value: {fill: 'black', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0', 'stroke-width': 2}},
};

function invocation(link) {
  var source = link.getSourceElement();
  var target = link.getTargetElement();
  var src_x = source.attributes.position.x;
  var src_y = source.attributes.position.y;
  var dst_x = target.attributes.position.x;
  var dst_y = target.attributes.position.y;
  // create the orthogonal vector to draw the link
  var vector = {x: dst_x-src_x, y: dst_y-src_y};
  var vector_length = Math.sqrt(Math.pow(vector.x, 2)+Math.pow(vector.y, 2));
  var x = vector.x/vector_length;
  var y = vector.y/vector_length;
  vector.x = -y;
  vector.y = x;
  //console.log("x+45 = ", vector.x, "\ny+25 = ", vector.y);

  link.set('vertices', [
    { x: 0.45*(src_x+10*vector.x)+0.55*(dst_x+10*vector.x) +45, y: 0.45*(src_y+5*vector.y)+0.55*(dst_y+5*vector.y) +25},
    { x: 0.55*(src_x-10*vector.x)+0.45*(dst_x-10*vector.x) +45, y: 0.55*(src_y-5*vector.y)+0.45*(dst_y-5*vector.y) +25}
  ]);

}

function conditionOrEvent(link, s: string){
  var source = link.getSourceElement();
  var target = link.getTargetElement();
  var x_diff = target.attributes.position.x-source.attributes.position.x;
  var y_diff = target.attributes.position.y-source.attributes.position.y;
  if (x_diff == 0) {
    link.set('labels', [ { position: -5, attrs: { text: {text: s+'      '}, rect: {fill: 'transparent'} } } ])
  }
  else if (y_diff == 0) {
    link.set('labels', [ { position: -5, attrs: { text: {text: s+'\n\n'}, rect: {fill: 'transparent'} } } ]);
  }
  else {
    var coeff = y_diff / x_diff;
    if (x_diff > 0) {
      if (coeff > 1) {
        link.set('labels', [{position: -5, attrs: {text: {text: '    '+s+'\n'}, rect: {fill: 'transparent'}}}]);
      }
      else if (coeff == 1) {
        link.set('labels', [{position: -5, attrs: {text: {text: '   '+s+'\n'}, rect: {fill: 'transparent'}}}]);
      }
      else if (0 < coeff && coeff < 1) {
        link.set('labels', [{position: -5, attrs: {text: {text: '  '+s+'\n\n'}, rect: {fill: 'transparent'}}}]);
      }
      else if (-1 < coeff && coeff < 0) {
        link.set('labels', [{position: -5, attrs: {text: {text: s+'      \n'}, rect: {fill: 'transparent'}}}]);
      }
      else if (coeff == -1) {
        link.set('labels', [{position: -5, attrs: {text: {text: s+'      '}, rect: {fill: 'transparent'}}}]);
      }
      else if (coeff < -1) {
        link.set('labels', [{position: -5, attrs: {text: {text: s+'      '}, rect: {fill: 'transparent'}}}]);
      }
    }
    else {  //x_diff < 0
      if (coeff > 1) {
        link.set('labels', [{position: -5, attrs: {text: {text: '      '+s}, rect: {fill: 'transparent'}}}]);
      }
      else if (coeff == 1) {
        link.set('labels', [{position: -5, attrs: {text: {text: '        '+s+''}, rect: {fill: 'transparent'}}}]);
      }
      else if (0 < coeff && coeff < 1) {
        link.set('labels', [{position: -5, attrs: {text: {text: '      '+s+'\n'}, rect: {fill: 'transparent'}}}]);
      }
      else if (-1 < coeff && coeff < 0) {
        link.set('labels', [{position: -5, attrs: {text: {text: s+'  \n\n'}, rect: {fill: 'transparent'}}}]);
      }
      else if (coeff == -1) {
        link.set('labels', [{position: -5, attrs: {text: {text: s+'      \n'}, rect: {fill: 'transparent'}}}]);
      }
      else if (coeff < -1) {
        link.set('labels', [{position: -5, attrs: {text: {text: s+'      \n'}, rect: {fill: 'transparent'}}}]);
      }
    }
  }
}

export const linkDrawing = {
  drawLink(link, linkName, ftag: string = null, btag: string = null){
    var linkInfo = DictOfLinksValue[linkName];
    var graph = link.get('graph');
    link.set({'graph': null}, { ignoreCommandManager: true });
    if (!linkInfo) {
      console.log('ERROR, link name does not exist!');
      return;
    }

    if (link.attributes.router) {
      link.unset('router');
    }
    if (link.attributes.labels) {
      link.unset('labels');
    }
    if (link.attributes.labelMarkup) {
      link.unset('labelMarkup');
    }
    var newAttributes = {
      '.connection': { stroke: 'black', 'stroke-width': 2, 'stroke-dasharray': "0" },
      '.marker-source' : {d:'', 'stroke-width': 2},
      '.marker-target' : {d:'', 'stroke-width': 2}
    };
    if (linkInfo.src) {
      newAttributes['.marker-source'] = linkInfo.value;
    }
    if (linkInfo.dst) {
      newAttributes['.marker-target'] = linkInfo.value;
    }
    if (linkInfo.middle) {   //structural links
      var outboundLinks = graph.getConnectedLinks(link.getSourceElement(), { outbound: true });
      var targetTriangle;
      for (var pt in outboundLinks) {
        if(outboundLinks[pt].attributes.type == 'opm.StructLink'){
          var tmpTargetTriangle = outboundLinks[pt].getTargetElement();
          if(tmpTargetTriangle.get('linkName') == linkName) {
            var newIdArray = tmpTargetTriangle.get('linkId');
            newIdArray.push(link.id);
            tmpTargetTriangle.set('linkId', newIdArray);
            targetTriangle = tmpTargetTriangle;
          }
        }
      }
      if(targetTriangle){
        var linkNewSecond = new joint.shapes.opm.StructLink({
          source: { id: targetTriangle.id, port: 'out'},
          target: { id: link.getTargetElement().id},
        });
        targetTriangle.set('numberOfTargets', targetTriangle.get('numberOfTargets')+1);
        graph.addCell(linkNewSecond);
      }
      else {
        var triangle = new joint.shapes.opm.TriangleAgg;
        var img = "../../assets/OPM_Links/" + linkInfo.value;
        var newX = (link.getSourceElement().getBBox().center().x + link.getTargetElement().getBBox().center().x) / 2 - 15;
        var newY = (link.getSourceElement().getBBox().center().y + link.getTargetElement().getBBox().center().y) / 2;
        triangle.set('position', {x: newX, y: newY});
        triangle.set('size', {width: 30, height: 25});
        triangle.set('linkId', [link.id]);
        triangle.set('linkName', linkName);
        triangle.set('numberOfTargets', 1);
        triangle.attr({image: {'xlink:href': img}})
        var linkNewFirst = new joint.shapes.opm.StructLink({
          source: {id: link.getSourceElement().id},
          target: {id: triangle.id, port: 'in'},
        });
        var linkNewSecond = new joint.shapes.opm.StructLink({
          source: {id: triangle.id, port: 'out'},
          target: {id: link.getTargetElement().id},
        });
        graph.addCells([triangle, linkNewFirst, linkNewSecond]);
      }
      newAttributes['.connection'] = { stroke: 'black', 'stroke-width': 0, 'stroke-dasharray': "0"};
      newAttributes['.link-tools'] = {display: 'none'};
      newAttributes['.marker-arrowheads'] = {display: 'none'};
      newAttributes['.connection-wrap'] = {display: 'none'};
      newAttributes['.marker-vertices'] = {display: 'none'};
    }
    if (ftag && btag) {
      link.set('labels', [ { position: 0.75, attrs: { text: {text: ftag+'\n'}, rect: {fill: 'transparent'} } },
        { position: 0.25, attrs: { text: {text: '\n'+btag}, rect: {fill: 'transparent'} } }
      ]);
    }
    else if (ftag) {
      link.set('labels', [ {  position: 0.75, attrs: { text: {text: ftag+'\n'}, rect: {fill: 'transparent'} } } ]);
    }
    else if (linkInfo.c || linkInfo.e) {
      var s: string = (linkInfo.c) ? 'c' : 'e';
      conditionOrEvent(link, s);
    }
    if (linkName == 'Invocation') {
      invocation(link);
    }
   // link.set({'attrs': newAttributes}, { ignoreCommandManager: true });
    link.attr({'.connection': {'stroke-dasharray': '0'}, '.marker-source': newAttributes['.marker-source'],
      '.marker-target': newAttributes['.marker-target']});

  },

  linkUpdating(link) {
    if (link.attributes.name === 'Invocation') {

      invocation(link);
    } else {
      var linkInfo = DictOfLinksValue[link.attributes.name];
      if (linkInfo.c || linkInfo.e) {
        var s: string = (linkInfo.c) ? 'c' : 'e';
        conditionOrEvent(link, s);
      }
    }
  }
}
