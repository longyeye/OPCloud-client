import { ModelObject } from './model-object.class';

export abstract class ModelStorageInterface {
  abstract get(modelName: string): ModelObject;
  abstract save(modelObject: ModelObject): any;
  abstract getModels(): Array<string>;
  abstract deleteModel(modelName): any;
}
