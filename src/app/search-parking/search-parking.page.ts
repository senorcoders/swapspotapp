import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RestService } from '../rest.service';
import { MapsAPILoader } from '@agm/core';
declare const google: any;
@Component({
  selector: 'app-search-parking',
  templateUrl: './search-parking.page.html',
  styleUrls: ['./search-parking.page.scss'],
})
export class SearchParkingPage implements OnInit {
  @ViewChild('map', {static:false}) mapContainer: ElementRef;
  @ViewChild("addresstext", {static:false}) private addresstext: ElementRef;

  map: any;
  parkings:any = [];
  myCoords:any;
  constructor(public zone: NgZone, 
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private navCtrl: NavController,
    private rest: RestService,
    private geolocation: Geolocation,
    private ngZone: NgZone) { }

    async ngOnInit() {
      await this.getCurrentLocation();
      await this.getParkings(this.myCoords.latitude, this.myCoords.longitude);
      this.displayGoogleMap();
      this.getMarkers();
    }
    ngAfterViewInit() {
      this.getPlaceAutocomplete();
    }

    getPlaceAutocomplete(){
      const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
        types: ['(regions)']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(async () => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          var lat = place.geometry.location.lat();
          var lng = place.geometry.location.lng();
          console.log("Place", place, lat, lng);
         
          this.map.setCenter(new google.maps.LatLng( lat, lng ));
          await this.getParkings(lat, lng);
          this.getMarkers();
          // this.query = place['formatted_address'];
        });
      });
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
      const latLng = new google.maps.LatLng(33.186148, this.myCoords.longitude);
  
      const mapOptions = {
        center: latLng,
        disableDefaultUI: true,
        zoom: 19,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
  
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
      const position = new google.maps.LatLng(33.186148, this.myCoords.longitude);
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
 

}
