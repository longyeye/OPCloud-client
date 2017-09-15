import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RappidToolbarComponent } from './rappid-toolbar/rappid-toolbar.component';
import { RappidStencilComponent } from './rappid-stencil/rappid-stencil.component';
import { RappidPaperComponent } from './rappid-paper/rappid-paper.component';
import { GraphService } from './services/graph.service';
import { RappidInspectorComponent } from './rappid-inspector/rappid-inspector.component';
import { RappidNavigatorComponent } from './rappid-navigator/rappid-navigator.component';
import { CommandManagerService } from './services/command-manager.service';
import { RappidOplComponent } from './rappid-opl/rappid-opl.component';
import { TreeModule } from 'angular-tree-component';
import { OPDHierarchyComponent } from '../opd-hierarchy/opd-hierarchy.component';
import { InitRappidService } from './services/init-rappid.service';
import { MdButtonModule, MdIconModule, MdTooltipModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    MdIconModule,
    MdButtonModule,
    MdTooltipModule,
    MdIconModule
  ],
  declarations: [
    RappidToolbarComponent,
    RappidStencilComponent,
    RappidPaperComponent,
    RappidInspectorComponent,
    RappidNavigatorComponent,
    RappidOplComponent,
    OPDHierarchyComponent
  ],
  providers: [
    GraphService,
    CommandManagerService,
    InitRappidService
  ],
  exports: [
    RappidToolbarComponent,
    RappidToolbarComponent,
    RappidStencilComponent,
    RappidPaperComponent,
    RappidInspectorComponent,
    RappidNavigatorComponent,
    RappidOplComponent,
    OPDHierarchyComponent
  ]
})
export class RappidModule { }
