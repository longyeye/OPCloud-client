import { Component, AfterViewInit, ViewContainerRef, ViewChild, Input, OnInit } from '@angular/core';
import { stencilConfig } from '../../config/stencil.config';

const joint = require('rappid');

@Component({
  selector: 'opcloud-rappid-stencil',
  template: `
    <div class="stencil-container" #stencilContainer>
    </div>
  `,
  styleUrls: ['./rappid-stencil.component.scss']
})
export class RappidStencilComponent implements OnInit, AfterViewInit {
  @Input() graph;
  @Input() paper;
  @Input() paperScroller;

  @ViewChild('stencilContainer', { read: ViewContainerRef }) stencilContainer;
  stencil;

  constructor() {
  }

  ngOnInit() {
    this.initializeStencil();
  }

  ngAfterViewInit() {
    this.stencilContainer.element.nativeElement.appendChild(this.stencil.el);
    this.stencil.render().load(stencilConfig.shapes);
  }

  // Create and populate stencil.
  initializeStencil() {

    this.stencil = new joint.ui.Stencil({
      paper: this.paperScroller,
      snaplines: new joint.ui.Snaplines({ paper: this.paper }),
      scaleClones: true,
      width: 240,
      height: 100,
      dropAnimation: true,
      // Use default Grid Layout
      layout: true,
      // Remove tooltip definition from clone
      dragStartClone: function (cell) {
        return cell.clone().removeAttr('./data-tooltip');
      }
    });
  }


}
