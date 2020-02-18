import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { StorageproviderService } from './storageprovider.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  myCoords:any;
  watch:any;
  constructor(public http: HttpClient, private geolocation: Geolocation,
    private storageProvider: StorageproviderService) { }
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

  watchPosition(){
    this.watch = this.geolocation.watchPosition().subscribe(position => {
      console.log(position.coords.longitude + ' ' + position.coords.latitude);
      this.sendCoords(position.coords.longitude, position.coords.latitude);
      });
  }

  sendCoords(lat, lng){
    this.storageProvider.get('userid').then(res => {
      console.log("userid", res);
      if ( res != null) {
        this.postPositions(lat, lng, res);
      }
    })
  }

  postPositions(lat, lng, userid){
    let data = {
      lat: lat,
      long: lng,
      userid:userid
    }
    this.http.post('/api/setlocation', data,  {responseType: 'text'}).subscribe(data => {
      console.log("Send locations", data);
    })
  }

  stopWatchingPosition(){
    this.watch.unsubscribe();
  }
  
}
