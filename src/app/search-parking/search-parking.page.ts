import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RestService } from '../rest.service';
import { MapsAPILoader } from '@agm/core';
import { SailsService } from 'angular2-sails';
import { environment } from 'src/environments/environment';
import { StorageproviderService } from '../storageprovider.service';
import { HaversineService, GeoCoord } from 'ng2-haversine';
declare const google: any;
@Component({
  selector: 'app-search-parking',
  templateUrl: './search-parking.page.html',
  styleUrls: ['./search-parking.page.scss'],
})
export class SearchParkingPage implements OnInit {
  @ViewChild('map', {static:false}) mapContainer: ElementRef;
  @ViewChild("addresstext", {static:false}) private addresstext: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  tmpCoord:any;
  map: any;
  parkings:any = [];
  myCoords:any;
  showPopup:boolean = false;
  showInstructions:boolean = false;
  markerEmail_tmp:any;
  useremail:any;
  instructions:any = [];
  constructor(public zone: NgZone, 
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private navCtrl: NavController,
    private rest: RestService,
    private geolocation: Geolocation,
    private ngZone: NgZone,
    private _sailsService:SailsService,
    private storageProvider: StorageproviderService,
    private toastController: ToastController,
    private _haversineService: HaversineService) { }

    async ngOnInit() {
      
      await this.getCurrentLocation();
      await this.getEmail();
      await this.getParkings(this.myCoords.latitude, this.myCoords.longitude);
      this.displayGoogleMap();
      this.getMarkers();
      this._sailsService.connect(environment.apiURL);
      let that = this;
      this._sailsService.get('/location/subscribe', function(data, jwr){
        console.log("response", data, jwr);
        that._sailsService.on('new_location').subscribe(entry => {
          console.log("new entry", entry);
          that.addMarkersToMap({x: entry['lat'], y: entry['long']});
          that.markerEmail_tmp = entry['email'];
        })
      })
    }
    ngAfterViewInit() {
      this.getPlaceAutocomplete();
    }
  
    getEmail(){
      return new Promise((resolve, reject) => {
        this.storageProvider.get('email').then(res => {
          this.useremail = res;
          console.log("email", this.useremail);
  
          resolve();
        })
      })
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
      this.directionsDisplay.setMap(this.map);

    }
  
    getMarkers() {
      console.log("AQUI", this.parkings.length);
      this.parkings.forEach(element => {
        this.addMarkersToMap(element);
      });
     
    }
  
    addMarkersToMap(parking) {
      console.log(parking);
      let that = this;
      const position = new google.maps.LatLng(parking.x, parking.y);
      const mySpot = new google.maps.LatLng(this.myCoords.latitude, this.myCoords.longitude);
      const parkingMarker = new google.maps.Marker({ position, title: "Parking", icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png'});
      const contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<div id="bodyContent">' +
      '<div class="row"><div class="col-lg-12"><button (click)="calculateAndDisplayRoute('+ parking +')">Drive Here<button></div></div>'+
      '<div class="row"><div class="col-lg-12"><button>Reserve this parking<button></div></div>'+
      '</div>' +
      '</div>';
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 400
  });
  parkingMarker.addListener('click', function() {
    // infowindow.open(this.map, parkingMarker);
    that.showPopup = true;
    that.tmpCoord = parking;

  });

      parkingMarker.setMap(this.map);
    }
 

    calculateAndDisplayRoute(position) {
      console.log("position", position);
      this.closePopup();
      const that = this;
      this.directionsService.route({
        origin: {
          lat: this.myCoords.latitude,
          lng: this.myCoords.longitude
        } ,
        destination: {
          lat: position.x,
          lng: position.y
        },
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {
          that.directionsDisplay.setDirections(response);
          this.instructions = response['routes'][0]['legs'][0]['steps'];
          console.log("response", response, this.instructions);

        } else {
          console.log('Directions request failed due to ' + status);
        }
      });

      let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
        console.log("live geo", data.coords, position);
        let spotPosition: GeoCoord = {
          latitude: position.x,
          longitude: position.y
      };
        let myLivePosition: GeoCoord = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude
      };

        let distanceInMeters = this._haversineService.getDistanceInMeters(myLivePosition, spotPosition);
        console.log("distance", distanceInMeters);
        if(distanceInMeters < 40){
          let data = {
            sender: this.useremail,
            receiver: this.markerEmail_tmp,
            message: "I am taking the spot"
          };
          this.rest.sendData('/api/message', data).subscribe(res => {
            console.log("mensaje enviado", res);
            this.closePopup();
            this.presentToast("Your requests for swap spots has been sent. Check your inbox to see responses.");
          })
        }
        });
    }

    closePopup(){
      this.showPopup = false;
    }

    sendRequest(){
      let data = {
        sender: this.useremail,
        receiver: this.markerEmail_tmp,
        message: "Hey. Let's swap spots!"
      };
      this.rest.sendData('/api/message', data).subscribe(res => {
        console.log("mensaje enviado", res);
        this.closePopup();
        this.presentToast("Your requests for swap spots has been sent. Check your inbox to see responses.");
      })
    }


    async presentToast(msg) {
      const toast = await this.toastController.create({
        message: msg,
        duration: 2000
      });
      toast.present();
    }

    showInstructionsFn(coords){
      let that = this;
      this.calculateAndDisplayRoute(coords);
      setTimeout(() => {
        that.showInstructions = true;

      }, 2000);
    }

    closeInstructions(){
      this.showInstructions = false;
    }
}
