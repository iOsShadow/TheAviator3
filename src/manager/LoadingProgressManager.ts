export class LoadingProgressManager {
  promises: Promise<any>[];
  constructor() {
    this.promises = [];
  }

  add(promise: Promise<any>) {
    this.promises.push(promise);
  }

  then(callback: (value: any[]) => any[] | PromiseLike<any[]>) {
    return Promise.all(this.promises).then(callback);
  }

  catch(callback: (reason: Error) => void) {
    return Promise.all(this.promises).catch(callback);
  }
}
