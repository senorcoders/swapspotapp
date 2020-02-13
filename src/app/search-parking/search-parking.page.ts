import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RestService } from '../rest.service';
declare var google;

@Component({
  selector: 'app-search-parking',
  templateUrl: './search-parking.page.html',
  styleUrls: ['./search-parking.page.scss'],
})
export class SearchParkingPage implements OnInit {
  @ViewChild('map', {static:false}) mapContainer: ElementRef;
  map: any;
  parkings:any = [];
  myCoords:any;
  constructor(public zone: NgZone, 
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private navCtrl: NavController,
    private rest: RestService,
    private geolocation: Geolocation) { }

    async ngOnInit() {
      await this.getCurrentLocation();
      await this.getParkings();
      this.displayGoogleMap();
      this.getMarkers();
    }

    goBack(){

      this.navCtrl.back();
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

    getParkings(){
   
  
      return new Promise((resolve, reject) => {
        this.rest.getData(`/api/v1/getnearby?x=${this.myCoords.latitude}&y=${this.myCoords.longitude}`).subscribe(data =>{
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
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
  
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
      const position = new google.maps.LatLng(this.myCoords.latitude, this.myCoords.latitude);
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
      const parkingMarker = new google.maps.Marker({ position, title: "Parking", icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png'});
      parkingMarker.setMap(this.map);
    }
 

}
