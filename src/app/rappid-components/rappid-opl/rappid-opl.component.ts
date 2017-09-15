import { Component, OnInit, ViewChild, ViewContainerRef,ComponentFactoryResolver,ComponentRef,Input } from '@angular/core';
import { linkTypeSelection} from '../../link-operating/linkTypeSelection'

// popup imports
import {DialogComponent} from "../../dialogs/choose-link-dialog/Dialog.component";
//import {DialogDirective} from "../../dialogs/choose-link-dialog/DialogDirective.directive";
import {OplDialogComponent} from "../../dialogs/opl-dialog/opl-dialog.component";


@Component({
  selector: 'opcloud-rappid-opl',
  template: `
    <div class="opl-container">
       <ng-container *ngFor="let cell of graph.getCells()">
          <p *ngIf = "cell.attributes.opl" 
            [innerHTML]="cell.attributes.opl" 
            (mouseover)="highlightCell(cell)"
            (mouseleave)="unhighlightCell(cell)">
          </p><br *ngIf = "cell.attributes.opl">
      </ng-container> 
    </div>
  `,
  styleUrls: ['./rappid-opl.component.css']
})
export class RappidOplComponent implements OnInit {
  @Input() graph;
  @Input() paper;

  constructor() {
  }

  ngOnInit() {
    this.GenerateOPL();
    this.HoverOnCells;
  }

  GenerateOPL(){
      this.graph.on('add', (cell) => {

        if (cell.attributes.type === 'opm.Object') {
          this.updateObjectOPL(cell);
        }

        if (cell.attributes.type === 'opm.Process') {
          this.updateProcessOPL(cell);
        }

        if (cell.attributes.type === 'opm.State') {
          var parentId = cell.attributes.parent;
          if(parentId) {
            var parent = this.graph.getCell(parentId).attributes.attrs.text.text;
            cell.attributes['opl'] = `${parent} can be ${cell.attributes.attrs.text.text}`;
          }
        }
      });

      this.graph.on('change', (cell) => {
        if (cell.attributes.type === 'opm.State') {
          var parentId = cell.attributes.parent;
          if(parentId){
            var parent = this.graph.getCell(parentId).attributes.attrs.text.text;
            cell.attributes['opl'] = `${parent} can be ${cell.attributes.attrs.text.text}`;
          }
        }

        if (cell.attributes.type === 'opm.Object') {
          this.updateObjectOPL(cell);
        }

        if (cell.attributes.type === 'opm.Process') {
          this.updateProcessOPL(cell)
        }

        if (cell.attributes.type != 'opm.Link') {
          var pt;
          var outboundLinks = this.graph.getConnectedLinks(cell, {outbound: true});
          for (pt in outboundLinks) {
            if(outboundLinks[pt].attributes.type == 'opm.Link')
              this.updateLinkOPL(outboundLinks[pt]);
          }
          var inboundLinks = this.graph.getConnectedLinks(cell, {inbound: true});
          for (pt in inboundLinks) {
            if(inboundLinks[pt].attributes.type == 'opm.Link')
              this.updateLinkOPL(inboundLinks[pt]);
          }
        }

        if (cell.attributes.type === 'opm.Link' && cell.attributes.opl != null) {
          this.updateLinkOPL(cell);
        }
      });
  };

  HoverOnCells(){
    this.paper.on('link:mouseenter',function(cellView,evt){
    },this);
  }

  //Function getElementEssence(cell) receives a cell from graph and gets its essence ('Physica' or 'Informatical').
  getElementEssence(cell){
    if(cell.attributes.type==='opm.Object') var essence=cell.attributes.attrs.rect.filter.args;
    if(cell.attributes.type==='opm.Process') var essence=cell.attributes.attrs.ellipse.filter.args;
    if(essence.dx>0) return 'physical';
    if(essence.dx==0) return 'informatical';
  }

  //Function getElementAffiliation(cell) receives a cell and gets its affliation ('Environmental' or 'Informatical').
  getElementAffiliation(cell){

    if(cell.attributes.type==='opm.Object'){
      if(cell.attributes.attrs.rect["stroke-dasharray"]== '10,5') return 'environmental';
      else return 'systemic';
    }
    if(cell.attributes.type==='opm.Process'){
      if(cell.attributes.attrs.ellipse["stroke-dasharray"]== '10,5') return 'environmental';
      else return 'systemic';
    }

  }

  //update OPL for a link when link is added or changed
  updateLinkOPL(cell){
    var src=cell.getSourceElement();
    var tgt=cell.getTargetElement();
    if(src && tgt)
        cell.attributes.opl=linkTypeSelection.generateOPL(src,tgt,cell.attributes.name);
  }
  //update OPL for an Object when object is added or changed
  updateObjectOPL(cell){
    var essence=this.getElementEssence(cell);
    var affiliation=this.getElementAffiliation(cell);
    var objectName=cell.attributes.attrs.text.text;

    cell.attributes.opl=`<b class="object">${objectName}</b> is <i>${affiliation}</i> and <i>${essence}</i><b>.</b>`;

  }
  //update OPL for a Process when process is added or changed
  updateProcessOPL(cell){
    var essence=this.getElementEssence(cell);
    var affiliation=this.getElementAffiliation(cell);
    var processName=cell.attributes.attrs.text.text;

    cell.attributes.opl=`<b class="process">${processName}</b> is <i>${affiliation}</i> and <i>${essence}</i><b>.</b>`;

  }

  highlightObject(cell){
    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('rect/fill','#FFA500');

  }
  unhighlightObject(cell){
    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('rect/fill','#DCDCDC')

  }

  highlightProcess(cell){
    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('ellipse/fill','#FFA500')
  }

  unhighlightProcess(cell){
    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('ellipse/fill','#DCDCDC')
  }

  highlightLink(cell){

    var source=cell.getSourceElement();
    var target=cell.getTargetElement();
    if(source.attributes.type==='opm.Object') this.highlightObject(source);
    else if(source.attributes.type==='opm.Process') this.highlightProcess(source);
    if(target.attributes.type==='opm.Object') this.highlightObject(target);
    else if(target.attributes.type==='opm.Process') this.highlightProcess(target);

    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('.connection/stroke','#FFA500');
  }
  unhighlightLink(cell){

    var source=cell.getSourceElement();
    var target=cell.getTargetElement();
    if(source.attributes.type==='opm.Object') this.unhighlightObject(source);
    else if(source.attributes.type==='opm.Process') this.unhighlightProcess(source);
    if(target.attributes.type==='opm.Object') this.unhighlightObject(target);
    else if(target.attributes.type==='opm.Process') this.unhighlightProcess(target);

    var cellView = this.paper.findViewByModel(cell);
    cellView.model.removeAttr('.connection/stroke');
  }


  highlightCell(cell){
    switch(cell.attributes.type) {
      case 'opm.Object':
        this.highlightObject(cell);
        break;
      case 'opm.Process': this.highlightProcess(cell);
        break;
      case 'opm.Link': this.highlightLink(cell);
        break;
    }

  }

  unhighlightCell(cell){
    switch(cell.attributes.type) {
      case 'opm.Object': this.unhighlightObject(cell);
        break;
      case 'opm.Process': this.unhighlightProcess(cell);
        break;
      case 'opm.Link': this.unhighlightLink(cell);
        break;
    }

  }

}
