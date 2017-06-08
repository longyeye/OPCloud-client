import { Injectable } from '@angular/core';
import { ModelObject } from '../../services/storage/model-object.class';
import { ModelStorageInterface } from '../../services/storage/model-storage.interface';
const joint = require('rappid');


@Injectable()
export class GraphService {
  graph;
  modelObject;
  modelStorage;
  private JSON;
  private JSON_string;
  private modelToSync;
  // private OPL;
  // private modelName;


  constructor(modelStorage: ModelStorageInterface) {
    this.modelStorage = modelStorage;
    this.graph = new joint.dia.Graph;
    this.JSON = this.graph.toJSON();
    // this.initializeDatabase();
    // TODO: change:position emits on mousemove, find a better event - when drag stopped
    this.graph.on(`add 
                  remove 
                  change:position 
                  change:attrs 
                  change:size 
                  change:angle`,
      () => this.updateJSON());
     this.modelObject = new ModelObject(null, null);

  }

  getGraph(name?: string) {

    return name ? this.loadGraph(name) : this.graph;
  }

  saveGraph(modelName) {
    debugger;
    console.log('inside saveModel func')
    // TODO: work on this.graph.modelObject - might be JSON
    this.modelObject.saveModelParam(modelName, this.JSON);
    this.modelStorage.save(this.modelObject);
  }

  loadGraph(name) {
    this.modelStorage.get(name).then((res) => {
      this.modelObject = res;

      this.graph.fromJSON(this.modelObject.modelData);
    });
  }

  updateJSON() {
    this.JSON = this.graph.toJSON();
    this.JSON_string = JSON.stringify(this.JSON);
    // TODO: should add OPL sync to the DB
    // this.modelToSync = { graph: this.JSON_string };
    // console.log(this.modelObject.name)
    if (this.modelObject.name !== null) {
       // update DB
      console.log(this.modelObject.name)
      console.log('go to FB');
      this.modelStorage.save(this.modelObject);
    }
    else {
      // console.log('saving in local storage')
      localStorage.setItem(this.modelObject.name, this.modelToSync);
    }
  }

//   this.fireDB.ref('/models/' + this.modelName).on('value', function (snapshot) {
//   getModel(snapshot.val());
// });

   /*
   _.bind(this.graph.updateModel, this.graph);
   this.graph.listen = function () {
   function getModel(model) {
   if (app.graph.myChangeLock) {
   //console.log('my change');
   app.graph.myChangeLock = false;
   return;
   }
   app.graph.JSON_string = model.graph;
   app.graph.JSON = JSON.parse(app.graph.JSON_string);
   app.graph.fromJSON(JSON.parse(app.graph.JSON_string));
   app.graph.OPL = model.opl;
   document.getElementById("opl").innerHTML = app.graph.OPL;
   };
   if (this.modelName !== 'undefined') {
   this.fireDB.ref('/models/' + this.modelName).on('value', function (snapshot) {
   getModel(snapshot.val());
   });
   }
   };
   _.bind(this.graph.listen, this.graph);
   this.graph.listen();
   }*/

}
