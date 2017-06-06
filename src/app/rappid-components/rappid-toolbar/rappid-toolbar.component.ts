import { Component, OnInit } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { SaveModelDialogComponent } from '../../dialogs/save-model-dialog/save-model-dialog.component';
import { MdDialog } from '@angular/material';
import { LoadModelDialogComponent } from '../../dialogs/load-model-dialog/load-model-dialog.component';
import { CommandManagerService } from '../services/command-manager.service';
import {ModelObject} from "../../services/storage/model-object.class";

@Component({
  selector: 'opcloud-rappid-toolbar',
  templateUrl: './rappid-toolbar.component.html',
  styleUrls: ['./rappid-toolbar.component.css']
})
export class RappidToolbarComponent implements OnInit {
  graph;
  // modelName;
  private commandManager;

  constructor(private graphService: GraphService,
              commandManagerService: CommandManagerService,
              private _dialog: MdDialog) {
    this.commandManager = commandManagerService.commandManager;
  }

  ngOnInit() {
    this.graph = this.graphService.getGraph();
  }

  undo() {
    this.commandManager.undo();
    this.graphService.updateJSON();
  }

  redo() {
    this.commandManager.redo();
    this.graphService.updateJSON();
  }

  saveModel() {
  }

  saveModelAs() {
    // debugger;
    // let dialogRef = this._dialog.open(SaveModelDialogComponent);
    // dialogRef.afterClosed().subscribe(result => {
    let result = prompt("Save Model As:", "Enter a Model Name");
    if (result === "Enter a Model Name" || result === null) {
      console.log("Model not saved");
      return;
    }
    this.graphService.saveGraph(result);
  }

  loadModel() {
    let dialogRef = this._dialog.open(LoadModelDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.graphService.loadGraph(result);
      }
    });
  }

}
