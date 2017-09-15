import { Injectable } from '@angular/core';
import { GraphService } from './graph.service';

const joint = require('rappid');

const $ = require('jquery');
// window.jQuery = $;
const _ = require('lodash');


@Injectable()
export class CommandManagerService {
  commandManager;
  private graph;

  constructor(graphService: GraphService) {
    this.graph = graphService.getGraph();
    this.commandManager = new joint.dia.CommandManager({graph: this.graph,
      cmdBeforeAdd: function(cmdName, cell, graph, options) {
        options = options || {};
        return !options.ignoreCommandManager;
      }
    });
  }
}
