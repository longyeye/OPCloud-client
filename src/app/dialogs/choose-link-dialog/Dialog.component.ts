import {Component, EventEmitter, Input, ViewChild , HostListener} from '@angular/core';
import { linkDrawing } from '../../link-operating/linkDrawing'

@Component({
  selector: 'dlg',
  templateUrl: './Dialog.component.html',
  styleUrls: ['./Dialog.component.css']
})
export class DialogComponent {
 //resize
  x: number;
  y: number;
  px: number;
  py: number;
  width: number;
  height: number;
  width_min: number;
  height_min: number;
  minArea: number;
  draggingCorner: boolean;
  draggingWindow: boolean;
  resizer: Function;

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
  public Relation_Links: Array<any> = [];
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

    linkDrawing.drawLink(this.newLink, this.selected.name)
   // createCode(link.name, this.linkSource.attributes.attrs.text.text, this.linkTarget.attributes.attrs.text.text);

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
//Close Button
 DefaultExit(link){
   this.close.emit('event');
   link.remove();
 }


  //resize functions

   constructor() {
    this.x = 400;
    this.y = 100;
    this.px = 0;
    this.py = 0;
    this.width= 455;
    this.height= 370;
    this.width_min= 455;
    this.height_min= 370;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.minArea = 150000
  }

  area() {
    return this.width * this.height;
  }

  onWindowPress(event: MouseEvent) {
    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
      return;
    }
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;
    this.x += offsetX;
    this.y += offsetY;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  topLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.y += offsetY;
    this.width -= offsetX;
    this.height -= offsetY;
  }

  topRightResize(offsetX: number, offsetY: number) {
    this.y += offsetY;
    this.width += offsetX;
    this.height -= offsetY;
  }

  bottomLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.width -= offsetX;
    this.height += offsetY;
  }
  bottomRightResize(offsetX: number, offsetY: number) {
    this.width += offsetX;
    this.height += offsetY;
  }

  onCornerClick(event: MouseEvent, resizer?: Function) {
    this.draggingCorner = true;
    this.px = event.clientX;
    this.py = event.clientY;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;

    let lastX = this.x;
    let lastY = this.y;
    let pWidth = this.width;
    let pHeight = this.height;

    this.resizer(offsetX, offsetY);
    if (this.width<this.width_min || this.height<this.height_min) {
      this.x = lastX;
      this.y = lastY;
      this.width = pWidth;
      this.height = pHeight;
    }
    this.px = event.clientX;
    this.py = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  onCornerRelease(event: MouseEvent) {
    this.draggingWindow = false;
    this.draggingCorner = false;
  }

}

function createCode(linkType, source, target){
  if(linkType  == 'Aggregation-Participation'){
    console.log('class ' + source + '{');
    console.log('    ' + target + ': number;');
    console.log('}');
  }
}
