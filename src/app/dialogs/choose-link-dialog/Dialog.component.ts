import {Component, EventEmitter, Input, ViewChild} from '@angular/core';
import { linkDrawing } from '../../link-operating/linkDrawing'

@Component({
  selector: 'dlg',
  templateUrl: './Dialog.component.html',
  styleUrls: ['./Dialog.component.css']
})
export class DialogComponent {

   close = new EventEmitter();
  public newLink: any;
  public linkSource: any;
  public linkTarget: any;
  public opmLinks : Array<any>;
  private selected: any;
  listExpanded = false;
  show:boolean=true;
  noshow:boolean=false;
  //links arrays
  public Structural_Links: Array<any> = [];
  public Agent_Links: Array<any> = [];
  public Instrument_Links: Array<any> = [];
  public Effect_links: Array<any> = [];
  public Consumption_links: Array<any> = [];
  public Result_Link: Array<any> = [];
  public Exception_links: Array<any> = [];
  public Invocation_links: Array<any> = [];

  onClickedExit(link) {

    this.selected = link;
    this.newLink.attributes.name = this.selected.name;

    //console.log('newLink: ', this.newLink);
    //linkDrawing.drawLink(this.newLink, this.selected.name)
   // createCode(link.name, this.linkSource.attributes.attrs.text.text, this.linkTarget.attributes.attrs.text.text);

    console.log('chaneged: ', this.selected);
    this.close.emit(this.selected);

  }


  //use for colors
  get_style(data){

    switch (data) {
      case "opm.Object":
        return "darkgreen";

      case "opm.Process":
        return "darkblue"
    }
  }
//check link array size
  check_empty(links_set){
    if(links_set.length === 0){
      return this.noshow;
    }
    else{
      return this.show;
    }
  }

  replacename(linkname){
     let serv =linkname;
     if(typeof linkname !== "undefined") {
       if (serv.indexOf('_') >= 0) {
         serv = linkname.replace('_', ' ');
       }
       else if (serv.indexOf('-') >= 0) {
         serv = linkname.replace('-', ' ');
       }
     }
    return serv;
  }

//Close Dialog Button
   DefaultExit(){
    this.close.emit('event');

  }


  constructor(){
  }
}

function createCode(linkType, source, target){
  if(linkType  == 'Aggregation-Participation'){
    console.log('class ' + source + '{');
    console.log('    ' + target + ': number;');
    console.log('}');
  }
}
