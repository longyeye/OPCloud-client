import { Component, OnInit } from '@angular/core';
import { GraphService } from '../../../rappid-components/services/graph.service';
import { InitRappidService } from '../../../rappid-components/services/init-rappid.service';

@Component({
  selector: 'opc-header',
  template: `
    <div class="app-toolbar-container">
      <md-toolbar class="app-toolbar mat-elevation-z6" color="primary">

        <img src="../../../../assets/OPCloud.jpg" class="logo">

        <div class="model-name">{{ modelName }}</div>

        <opcloud-rappid-stencil [graph]="graph"
                                [paper]="paper"
                                [paperScroller]="paperScroller">
        </opcloud-rappid-stencil>

        <opcloud-rappid-toolbar></opcloud-rappid-toolbar>
        <span class="app-toolbar-filler"></span>

        <opc-user-status></opc-user-status>

      </md-toolbar>
    </div>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  paperScroller;
  graph;
  paper;
  modelName: string;

  constructor(
    graphService: GraphService,
    initRappid: InitRappidService) {
    this.graph = graphService.graph;
    this.paper = initRappid.paper;
    this.paperScroller = initRappid.paperScroller;
  }

  ngOnInit() {
  }

}
