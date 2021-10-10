import { Injectable } from '@angular/core';
import { DataStoreService } from '../datastore/datastore.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataStoreGHService extends DataStoreService {

  private _storage: Storage | null = null;

  constructor(public storage: Storage) { 
    super(); 
    this.init_storage();
  }

  async init_storage() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getFromStore(name: string): Promise<any> {
    var resultPromise: Promise<any> = this._storage.get(name);
    return resultPromise.then(
      function(response) {
        return response;
      },
      function(error) {
        console.warn(`Got error while pulling ${name} from local storage: ${error.code}`);
        if (error.exception !== "") console.warn(error.exception);
        return null;
      }
    )
  }

  async setToStore(name: string, value: any): Promise<boolean> {
    var setPromise: Promise<any> = this._storage.set(name, value);
    return setPromise.then(
      function(response) {
        console.log(`Successfully set ${name} in local storage.`);
        return true;
      },
      function(error) {
        console.warn(`Got error when setting ${name} in local storage: ${error.code}`);
        if (error.exception !== "") console.warn(error.exception);
        return false;
      }
    )

  }

  async getConfig(): Promise<string> {
    return await this.getFromStore("gh-repo");
  }

  async setConfig(repo: string): Promise<boolean> {
    return await this.setToStore("gh-repo", repo);
  }

  async setCreds(pat: string): Promise<boolean> {
    return await this.setToStore("gh-pat", pat);
  }

  async getCreds(): Promise<string> { 
    return await this.getFromStore("gh-pat");
  }

}
