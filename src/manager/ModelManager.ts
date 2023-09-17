import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { LoadingProgressManager } from './LoadingProgressManager';

export class ModelManager {
  path: any;
  models: {};
  loadingProgressManager: LoadingProgressManager;

  constructor(path) {
    this.path = path;
    this.models = {};
    this.loadingProgressManager = new LoadingProgressManager();
  }

  load(modelName, path) {
    const promise = new Promise((resolve, reject) => {
      const loader = new OBJLoader();
      loader.load(
        path,
        obj => {
          this.models[modelName] = obj;
          resolve(obj);
        },
        function () {},
        reject,
      );
    });
    this.loadingProgressManager.add(promise);
  }

  get(modelName) {
    if (typeof this.models[modelName] === 'undefined') {
      throw new Error("Can't find model " + modelName);
    }
    return this.models[modelName];
  }
}
