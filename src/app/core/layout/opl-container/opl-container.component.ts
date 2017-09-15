import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'opc-opl-container',
  template: `
    <button md-raised-button class="opl-icon"
            (click)="toggleOpl()"
            [ngStyle]="{top: oplOpen ? '-20px' : '-36px'}" color="primary">
      OPL
      <i class="material-icons app-toolbar-menu-icon">{{ oplOpen ? 'expand_more' : 'expand_less' }}</i>
    </button>

    <div class="opl-widget" *ngIf="oplOpen">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./opl-container.component.scss']
})
export class OplContainerComponent implements OnInit {
  oplOpen = true;

  constructor() {
  }

  ngOnInit() {
  }

  toggleOpl() {
    this.oplOpen = !this.oplOpen;
  }

}
