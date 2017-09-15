import { dataBase } from './linksDatabase';


export const linkTypeSelection = {

  //This function aims to generate single OPL sentence with given linkName and source and target object
  generateOPL(source, target, linkName){
    var srcName;
    var desName;
    var srcStateObject;
    var desStateObject;
    var srcType;
    var desType;


    srcType=source.attributes.type;
    desType=target.attributes.type;

    srcName=source.attributes.attrs.text.text;
    desName=target.attributes.attrs.text.text;

    switch (srcType){
      case 'opm.Object':
        srcName=`<b class="object">${srcName}</b>`;
      case 'opm.Process':
        srcName=`<b class="process">${srcName}</b>`;
     // case 'opm.State':
     //   var parentName=graph.getCell(source.attributes.parent).attributes.attrs.text.text;
       // var stateName=source.attributes.attrs.text.text;
      //  srcName=`<b class="state">${stateName} ${parentName}</b>`;

    }

    switch (desType){
      case 'opm.Object':
        desName=`<b class="object">${desName}</b>`;
      case 'opm.Process':
        desName=`<b class="process">${desName}</b>`;
    }


    /*if(source.attributes.type == "State"){
     srcStateObject=
     }

     if(target.attributes.type == "State"){
     desStateObject=
     }*/

    if(linkName=="Unidirectional_Relation"){
      return `${srcName} relates to ${desName}.`;
    }
    else if(linkName=="Bidirectional_Relation"){
      return `${srcName} and ${desName} are equivalent.`;
    }
    else if(linkName=="Aggregation-Participation"){
      return `${srcName} consists of ${desName}.`;
    }
    else if(linkName=="Generalization-Specialization"){
      return `${desName} is a ${srcName}.`;
    }
    else if(linkName=="Exhibition-Characterization"){
      return `${srcName} exhibits ${desName}.`;
    }
    else if(linkName=="Classification-Instantiation"){
      return `${desName} is an instance of ${srcName}.`;
    }
    else if(linkName=="Result"){
      return `${srcName} yields ${desName}.`;
    }
    else if(linkName=="Consumption"){
      return `${desName} consumes ${srcName}.`;
    }
    else if(linkName=="Effect"){
      return `${srcName} affects ${desName}.`;
    }
    else if(linkName=="Agent"){
      return `${srcName} handles ${desName}.`;
    }
    else if(linkName=="Instrument"){
      return `${desName} requires ${srcName}.`;
    }
    else if(linkName=="In-out_Link_Pair"){
      return ``;//<P> changes <O> from <s1> to <s2>
    }
    else if(linkName=="Agent"){
      return `${srcName} handles ${desName}.`;
    }
    else if(linkName=="Invocation"){
      return `${srcName} invokes ${desName}.`;
    }
    // cant read link name format
    //else if(linkName=="Overtime_exception_<maxtime, unit>"){
     // return `${desName} occurs if ${srcName} lasts more than <maxtime> <units>.`;
      //<maxtime> and <unit> can be typed after the popup menu,
      //bur need these parameters to generate OPL in the opl widget

    //}
    //else if(linkName=="Undertime_exception <minitime, unit>"){
     // return `${this.desName} occurs if ${this.srcName} falls short of <mintime> <units>.`;
      //<mintime> and <unit> can be typed after the popup menu,
      //bur need these parameters to generate OPL in the opl widget
   // }
      else if(linkName=="Overtime_exception"){
      return `${desName} occurs if ${srcName} lasts more than maxtime units.`;
    }
    else if(linkName=="Undertime_exception"){
      return `${desName} occurs if ${srcName} falls short of mintime units.`;
    }
    else if(linkName=="Condition_Consumption"){
      return `${desName} occurs if ${srcName} exists, in which case ${desName} consumes ${srcName}, otherwise ${desName} is skipped.`;
    }
    else if(linkName=="Condition_Effect"){
      return `${desName} occurs if ${srcName} exists, in which case ${desName} affects ${srcName}, otherwise ${desName} is skipped.`;
    }
    else if(linkName=="Condition_Input"){
      return `${desName} occurs if ${srcStateObject} is at state ${srcName}.`;
    }
    else if(linkName=="Condition_Instrument"){
      return `${desName} occurs if ${srcName} exists, otherwise ${desName} is skipped.`;
    }
    else if(linkName=="Condition_Agent"){
      return `${desName} occurs if ${srcName} exists, otherwise ${desName} is skipped.`;
    }
    else if(linkName=="Event_Consumption"){
      return `${srcName} initiates ${desName}, which consumes ${srcName}.`;
    }
    else if(linkName=="Event_Effect"){
      return `${srcName} initiates ${desName}, which affects ${srcName}.`;
    }
    else if(linkName=="Event_Input"){
      return ``;
    }
    else if(linkName=="Event_Instrument"){
      return `${srcName} initiates ${desName}, which requires ${srcName}.`;
    }
    else if(linkName=="Event_Agent"){
      return `${srcName} initiates and handles ${desName}.`;
    }

  },

//This function finds all available links with given array of all link names
  availableOPL(linkObject, availableLinks){
    var source = linkObject.getSourceElement();
    var target = linkObject.getTargetElement();
    var linksNamesWithOpl: Array<any> = [];

    for(var i=0; i<availableLinks.length; i++){
      linksNamesWithOpl.push({name: availableLinks[i].name, opl: this.generateOPL(source, target, availableLinks[i].name)});
    }

    return linksNamesWithOpl;
  },

//Function findSuitableLinks gets a potential link, get from it the source and target types, go over
// the database and find all link types the are suitable to this specific link. The function return all found links in an array
  findSuitableLinks(link){
    //substring because we want to remove the prefix 'opm.'
    //toLowerCase because we need the type to match the format in database.
    var source: string = link.getSourceElement().attributes.type.substring(4).toLowerCase();
    var target:string = link.getTargetElement().attributes.type.substring(4).toLowerCase();
    var result: Array<any> = [];
    var linksDataArray: dataBase = new dataBase();

    //Go over the database
    for (let linkData of linksDataArray.linksArray){
      //If the link name is already in the final array so no need to check it, as every link name will appear only once
      if(result.indexOf(linkData.linkName)>-1){
        continue;
      }
      var isSourceMatch = false, isTargetMatch = false;
      if(source == 'state'){
        isSourceMatch = (linkData.sourceType.indexOf(source) > -1);
      }
      else {
        isSourceMatch = ((linkData.sourceType.indexOf(source) > -1) && (linkData.sourceType.indexOf("state") == -1));
      }
      if(target == 'state'){
        isTargetMatch = (linkData.targetType1.indexOf(target) > -1) || (linkData.targetType2.indexOf(target) > -1);
      }
      else {
        isTargetMatch = (((linkData.targetType1.indexOf(target) > -1) && (linkData.targetType1.indexOf("state") == -1)) ||
          ((linkData.targetType2.indexOf(target) > -1) && (linkData.targetType2.indexOf("state") == -1)));
      }

      if(isSourceMatch && isTargetMatch){
        result.push({name: linkData.linkName, opl: "gggggg"});
      }
    }

    return result;
  },

  generateLinkWithOpl(link){
    var linkNames = this.findSuitableLinks(link);
    return this.availableOPL(link, linkNames);
  }

}
