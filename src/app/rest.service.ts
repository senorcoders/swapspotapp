import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(public http: HttpClient) { }
  sendData(url, data){
    return this.http.post(url, data)
  }

  getData(url){
    return this.http.get(url);
  }

  deleteData(url){
    return this.http.delete(url);
  }

  updateData(url, data){
    return this.http.patch(url, data)

  }
}
