import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageproviderService {

  constructor(public storage: Storage) { }


  public async set(key, value){
    return this.storage.set(key, value);
}
public async get(key){
    return this.storage.get(key);
}
public async remove(key){
    return this.storage.remove(key);
}
}
