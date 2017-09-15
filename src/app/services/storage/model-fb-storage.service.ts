import { Injectable, Inject } from '@angular/core';
import { ModelStorageInterface } from './model-storage.interface';
import { ModelObject } from './model-object.class';
import { FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database';
const firebaseKeyEncode = require('firebase-key-encode');

@Injectable()
export class ModelFbStorageService extends ModelStorageInterface {
  models = [];
  fbModels;
  fbCurrentModel: FirebaseObjectObservable<any>;

  constructor(private af: AngularFireDatabase) {
    super();
    this.fbModels = af.object('/modelnames');
  }

  get(modelName: string): any {
    let ref = this.af.database.ref(`/models/${modelName}`);
    return ref.once('value')
      .then((snapshot) => {
        return new ModelObject(modelName, snapshot.val());
      });
  }

  listen(modelName: string, graph): any {
    let ref = this.af.database.ref(`/models/${modelName}`);
    ref.on('value', function (snapshot) {
      let json = snapshot.val();
      if (json) {
        firebaseKeyEncode.deepDecode(json);
        graph.fromJSON(json);
      }
    });
  }

  getAndListen(modelName: string, graph): any {
    var newValue = this.get(modelName);
    this.listen(modelName, graph);
    return newValue;
  }

  save(modelObject: ModelObject): any {
    this.fbModels.update({ [modelObject.name]: true });
    this.fbCurrentModel = this.af.object(`/models/${modelObject.name}`);
    this.fbCurrentModel.set(modelObject.modelData);
  }

  getModels(): any {
    let ref = this.af.database.ref('/modelnames');
    return ref.once('value')
      .then((snapshot) => {
        return this.models = Object.keys(snapshot.val());
      });
  }

  deleteModel(modelName) : any {
    this.af.database.ref(`/models/${modelName}`).remove();
    this.af.database.ref(`/modelnames/${modelName}`).remove();
  }
}
