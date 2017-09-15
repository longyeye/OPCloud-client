import { Injectable } from '@angular/core';
import { ModelStorageInterface } from './model-storage.interface';
import { ModelObject } from './model-object.class';

const modelStorageName = 'OPCloud_Models';

@Injectable()
export class ModelLocalStorageService extends ModelStorageInterface {
  models;

  constructor() {
    super();
    this.models = JSON.parse(localStorage.getItem(modelStorageName)) || {};
  }

  get(modelName) {
    if (!this.models[modelName]) {
      alert('no model exists in this name');
      return;
    }
    return new ModelObject(modelName, this.models[modelName]);
  }

  save(modelObject: ModelObject) {
    this.models[modelObject.name] = modelObject.modelData;

    try {
      localStorage.setItem(modelStorageName, JSON.stringify(this.models));
      console.log(`model ${modelObject.name} was saved in localStorage`);
    } catch (e) {
      console.error('error while saving to localStorage', e);
    }
  }

  getModels() {
    return Object.keys(this.models);
  }

  deleteModel(modelName) {
    this.models[modelName].remove();
  }
}

