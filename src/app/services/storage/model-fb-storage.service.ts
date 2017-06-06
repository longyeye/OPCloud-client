import { Injectable, Inject } from '@angular/core';
import { ModelStorageInterface } from './model-storage.interface';
import { ModelObject } from './model-object.class';
import { FirebaseObjectObservable, AngularFire, FirebaseApp } from 'angularfire2';
import { database } from 'firebase';


@Injectable()
export class ModelFbStorageService extends ModelStorageInterface {
  models = [];
  fbModels;
  fbCurrentModel: FirebaseObjectObservable<any>;

  constructor(private af: AngularFire, @Inject(FirebaseApp) private fb: any) {
    super();
    this.fbModels = af.database.object('/modelnames');
  }

  get(modelName: string): any {
    let ref = this.fb.database().ref(`/models/${modelName}`);
    return ref.once('value')
      .then((snapshot) => {
        return new ModelObject(modelName, snapshot.val());
      });
  }

  save(modelObject: ModelObject): any {
    this.fbModels.update({ [modelObject.name]: true });
    this.fbCurrentModel = this.af.database.object(`/models/${modelObject.name}`);
    this.fbCurrentModel.set(modelObject.modelData);
  }

  getModels() {
    return database().ref('/modelnames').once('value')
      .then(snapshot => {
        return Object.keys(snapshot.val());
      })
  }
}
