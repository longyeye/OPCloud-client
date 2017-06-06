import { Injectable } from '@angular/core';
import { ModelStorageInterface } from '../../services/storage/model-storage.interface';
import { database } from 'firebase';
const joint = require('rappid');


@Injectable()
export class GraphService {
  graph;
  modelName;
  private database;
  private myChangeLock;
  private modelRef;
  private modelRefOn;

  constructor(modelStorage: ModelStorageInterface) {
    this.database = database();
    this.graph = new joint.dia.Graph;

    // TODO: change:position emits on mousemove, find a better event - when drag stopped
    this.graph.on(`add 
                  remove 
                  change`,
      (x, y, z) => {
        this.updateJSON(x, y, z)
      });

  }

  getModelList() {
    this.database.ref('/models').once('value').then(snapshot => {
      return Object.keys(snapshot.val());
    })
  }

  getGraph(name?: string) {

    return name ? this.loadGraph(name) : this.graph;
  }

  saveGraph(name) {

    console.log('inside saveModel func')
    // TODO: work on this.graph.modelObject - might be JSON
    this.database.ref('models/' + name).set(this.graph.toJson());
    this.modelRef.off();
    this.loadGraph(name)
  }

  loadGraph(name?) {
    if (!!name) {
      this.modelName = name;
      this.modelRef = this.database.ref('models/' + name);
      this.modelRefOn = this.modelRef.on('value', (snapshot) => {
        this.getModel(snapshot.val());
      });
    }
  }

  updateJSON(x?, y?, z?) {
    // debugger
    if (!this.modelName) return;
    if (x && x.attributes.type === 'opm.Link' && z && z.add) return;
    const graphJSON = this.graph.toJSON();
    // TODO: should add OPL sync to the DB
    // console.log(this.modelName)
    if (this.modelName !== null) {
      // update DB
      // console.log(this.modelName)
      // console.log('go to FB');
      this.myChangeLock = true;
      console.log(graphJSON)
      this.database.ref('/models/' + this.modelName).update(graphJSON);

    }
    else {
      console.log('saving in local storage')
    }
  }

  getModel(model) {
    if (this.myChangeLock) {
      this.myChangeLock = false;
      return;
    }

    this.graph.fromJSON(model);
  };

}
