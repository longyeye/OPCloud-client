import { Component, ViewContainerRef, ViewChild, Input, OnChanges } from '@angular/core';
import { inspectorConfig } from '../../config/inspector.config';

const joint = require('rappid');
const _ = require('lodash');

@Component({
  selector: 'opcloud-rappid-inspector',
  template: `
    <div class="inspector-container" #inspectorContainer></div>
  `,
  styleUrls: ['./rappid-inspector.component.css']
})
export class RappidInspectorComponent implements OnChanges {
  @Input() cell;
  @ViewChild('inspectorContainer', { read: ViewContainerRef }) inspectorContainer;

  constructor() {}

  ngOnChanges(changes) {
    if (changes.cell && changes.cell.currentValue && this.cell) {
      this.inspectorContainer.element.nativeElement.innerHTML = null;
      this.createInspector();
    }
  }

  createInspector() {
    const inspector = new joint.ui.Inspector(_.extend({
      cell: this.cell
    }, inspectorConfig[this.cell.get('type')]));
    this.inspectorContainer.element.nativeElement.appendChild(inspector.el);
    inspector.render();
  }

}
