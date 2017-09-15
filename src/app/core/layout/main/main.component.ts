import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdDialog } from '@angular/material';
import { InitRappidService } from '../../../rappid-components/services/init-rappid.service';
import { GraphService } from '../../../rappid-components/services/graph.service';
import { CommandManagerService } from '../../../rappid-components/services/command-manager.service';
import { DialogComponent } from '../../../dialogs/choose-link-dialog/Dialog.component';
import { OplDialogComponent } from '../../../dialogs/opl-dialog/opl-dialog.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'opc-main',
  template: `
    <opc-header></opc-header>

    <a class="sd-tree-menu-icon" (click)="toggleSidenav()">
      <i class="material-icons app-toolbar-menu-icon">{{ sdTreeOpen ? 'chevron_left' : 'menu' }}</i>
    </a>

    <md-sidenav-container class="opcloud-container">

      <md-sidenav #sidenav class="sd-tree-menu"
                  [opened]="sdTreeOpen"
                  mode="side"
                  [opcResizable]="'horizontal'"
                  (opcResize)="onResize($event)">
        <opcloud-opd-hierarchy id="opd-block"></opcloud-opd-hierarchy>

        <opcloud-rappid-navigator [paperScroller]="paperScroller"></opcloud-rappid-navigator>
      </md-sidenav>

      <div class="sd-content">

        <div class="rappid-main rappid main-content">
          <opcloud-rappid-paper [paper]="paper" [paperScroller]="paperScroller"></opcloud-rappid-paper>

          <button class="inspector-button"
                  (click)="toggleInspector()"
                  *ngIf="cell$ | async"
                  md-mini-fab>
            <md-icon>{{ inspectorOpen ? 'close' : 'assignment' }}</md-icon>
          </button>
          <opcloud-rappid-inspector [style.visibility]="inspectorOpen ? 'visible' : 'hidden'"
                                    [cell]="cell$ | async"></opcloud-rappid-inspector>
        </div>

        <opc-opl-container>
          <opcloud-rappid-opl id="opl-block" [graph]="graph" [paper]="paper"></opcloud-rappid-opl>
        </opc-opl-container>

      </div>

    </md-sidenav-container>
  `,
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  dialogSubscription: Subscription;
  @ViewChild('sidenav') sidenav;
  dialog$: BehaviorSubject<any>;
  commandManager;
  graph;
  paper;
  paperScroller;
  cell$;
  private DialogType;
  sdTreeOpen = true;
  inspectorOpen = true;

  constructor(
    initRappid: InitRappidService,
    graphService: GraphService,
    commandManagerService: CommandManagerService,
    private mdDialog: MdDialog,
    private viewContainer: ViewContainerRef) {
    this.graph = graphService.getGraph();
    this.commandManager = commandManagerService.commandManager;
    this.paper = initRappid.paper;
    this.paperScroller = initRappid.paperScroller;
    this.cell$ = initRappid.cell$;
    this.dialog$ = initRappid.dialog$;
  }

  ngOnInit() {
    this.sunscribeToDialog();
  }

  sunscribeToDialog() {
    this.dialogSubscription = this.dialog$.subscribe((data) => {
      if (!data) {
        return;
      }

      if (this.mdDialog._openDialogs.length > 0) {
        console.log('dialogs open!', this.mdDialog._openDialogs);
      }

      switch (data.type) {
        case 'choose-link': {
          this.DialogType = DialogComponent;
          break;
        }
        case 'opl': {
          this.DialogType = OplDialogComponent;
          break;
        }
        case 'close-opl': {
          if (this.DialogType === OplDialogComponent) {
            this.mdDialog.closeAll();
            return;
          }
          break;
        }
        default: {
          return;
        }
      }

      this.mdDialog.open(this.DialogType, {
        viewContainerRef: this.viewContainer,
        panelClass: 'choose-link-dialog',
        hasBackdrop: false,
        data: data.instance
      });
    });

  }

  toggleSidenav() {
    this.sdTreeOpen = !this.sdTreeOpen;
    this.sdTreeOpen ? this.closeSidenav() : this.openSidenav();
  }

  openSidenav() {
    this.sidenav.open();
  }

  closeSidenav() {
    this.sidenav.close();
  }

  // TODO: replace with onResize method
  onResize(e) {
    console.log(e);
  }

  toggleInspector() {
    this.inspectorOpen = !this.inspectorOpen;
  }

  ngOnDestroy() {
    this.dialogSubscription.unsubscribe();
  }
}
