import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { RestService } from '../rest.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('mapHome', {static:false}) mapContainer: ElementRef;

  map: any;
  parkings:any = [];
  myCoords:any;
  constructor(public zone: NgZone, public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private rest: RestService,
    private router: Router) {
  } 
  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.getCurrentLocation();
    await this.getParkings(this.myCoords.latitude, this.myCoords.longitude);
    this.displayGoogleMap();
    this.getMarkers();

  }  
  
  getCurrentLocation(){
    return new Promise((resolve, reject) => {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myCoords = resp.coords;
      console.log("mycoords", this.myCoords);
      resolve();
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
       reject();
     });
    })
  }

  getParkings(lat, lng){
 
    this.parkings = [];
    return new Promise((resolve, reject) => {
      this.rest.getData(`/api/v1/getnearby?x=${lat}&y=${lng}`).subscribe(data =>{
        console.log("Parkings", data);
        this.parkings = data;
        resolve();
      }, error => reject())
 
 
  });
}

  displayGoogleMap() {
    const latLng = new google.maps.LatLng(this.myCoords.latitude, this.myCoords.longitude);

    const mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 19,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    const position = new google.maps.LatLng(this.myCoords.latitude, this.myCoords.longitude);
    console.log("Lat: " + this.myCoords.latitude);
    const parkingMarker = new google.maps.Marker({ position, title: "My current position"});
    parkingMarker.setMap(this.map);
  }

  getMarkers() {
    console.log("AQUI", this.parkings.length);
    this.parkings.forEach(element => {
      this.addMarkersToMap(element);
    });
   
  }

  addMarkersToMap(parking) {
    console.log(parking);
    const position = new google.maps.LatLng(parking.x, parking.y);
    const mySpot = new google.maps.LatLng(this.myCoords.latitude, this.myCoords.longitude);
    const parkingMarker = new google.maps.Marker({ position, title: "Parking", icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png'});
    parkingMarker.setMap(this.map);
  }

  searchParking(){
    this.router.navigateByUrl('/tabs/tab1/search-parking');

    
  }
}
