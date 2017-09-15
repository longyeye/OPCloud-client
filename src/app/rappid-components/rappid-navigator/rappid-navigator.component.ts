import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';

const joint = require('rappid');

@Component({
  selector: 'opcloud-rappid-navigator',
  template: `<div class="navigator-container" #navigatorContainer></div>`,
  styleUrls: ['rappid-navigator.component.scss']
})
export class RappidNavigatorComponent implements OnInit {
  @Input() private paperScroller;
  private navigator;

  @ViewChild('navigatorContainer', { read: ViewContainerRef }) navigatorContainer;

  constructor() {
  }

  ngOnInit() {
    this.initializeNavigator()
  }

  ngAfterViewInit() {
    this.navigatorContainer.element.nativeElement.appendChild(this.navigator.el);
    this.navigator.render();
  }

  initializeNavigator() {

    this.navigator = new joint.ui.Navigator({
      width: 240,
      height: 115,
      paperScroller: this.paperScroller,
      zoom: false
    });
  }

}
