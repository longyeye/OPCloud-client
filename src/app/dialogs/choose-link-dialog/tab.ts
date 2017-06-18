/**
 * Created by ta2er on 2017-06-12.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'tab',
  styles: [`
  `],
  template: `
    <div [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `
})
export class Tab {
  @Input('tabTitle') title: string;
  @Input() active = false;
}
