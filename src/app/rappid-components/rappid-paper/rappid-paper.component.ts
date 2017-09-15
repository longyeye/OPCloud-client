import { Component, OnInit, AfterViewInit, ViewContainerRef, ViewChild, Input } from '@angular/core';
const joint = require('rappid');

@Component({
  selector: 'opcloud-rappid-paper',
  template: `
    <div class="paper-container" #paperContainer></div>
  `,
  styleUrls: ['./rappid-paper.component.scss']
})
export class RappidPaperComponent implements AfterViewInit{
  @Input() paper;
  @ViewChild('paperContainer', { read: ViewContainerRef }) paperContainer;
  @Input() paperScroller;

  constructor() {
  }

  ngAfterViewInit() {
    // this.initPaperScroller();
    this.paperContainer.element.nativeElement.appendChild(this.paperScroller.el);
  }



  initPaperScroller() {
    /*this.paperScroller = new joint.ui.PaperScroller({
      paper: this.paper,
      autoResizePaper: true,
      padding: 50
    });*/
  }

}
