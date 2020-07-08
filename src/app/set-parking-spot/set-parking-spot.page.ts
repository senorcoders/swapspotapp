import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../rest.service';
import { Platform, ToastController, LoadingController, NavController } from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { StorageproviderService } from '../storageprovider.service';

@Component({
  selector: 'app-set-parking-spot',
  templateUrl: './set-parking-spot.page.html',
  styleUrls: ['./set-parking-spot.page.scss'],
})
export class SetParkingSpotPage implements OnInit {
  @ViewChild('mapuser', {static:false}) mapContainer: ElementRef;

  map: any;
  parkings:any = [];
  myCoords:any;
  userid:FormControl;
  lat:FormControl;
  long:FormControl;
  msg:FormControl;
  parkingForm:FormGroup;
  userid_st:any;
  hideButton:boolean = false;

  constructor(public zone: NgZone, public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private rest: RestService,
    private navCtrl: NavController,
    private storageProvider: StorageproviderService,
    private toastController:ToastController) { }

  async ngOnInit() {
    this.createFormControls();
    this.createRegisterForm();
    await this.getUserInfo();

    await this.platform.ready();
    
    await this.getCurrentLocation();
    // await this.getParkings(this.myCoords.latitude, this.myCoords.longitude);
    this.displayGoogleMap();
    // this.getMarkers();

  }

  getUserInfo(){
    return new Promise((resolve, reject) => {
      this.storageProvider.get('userid').then(res => {
        this.userid_st = res;
        console.log("userid", this.userid_st);
        this.userid.setValue(this.userid_st);

        resolve();
      })
    })
  }

  createFormControls(){
    this.userid = new FormControl('', [Validators.required]); 
    this.lat = new FormControl('', [Validators.required]); 
    this.long = new FormControl('', [Validators.required]); 
    this.msg = new FormControl(''); 

  }

  createRegisterForm(){
    this.parkingForm = new FormGroup({
      userid: this.userid,
      lat: this.lat,
      long: this.long,
      msg: this.msg
     
    }, {
      updateOn: 'submit'
    })

  }
  getCurrentLocation(){
    return new Promise((resolve, reject) => {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myCoords = resp.coords;
      console.log("mycoords", this.myCoords);
      this.lat.setValue(this.myCoords['latitude']);
      this.long.setValue(this.myCoords['longitude']);
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
    const parkingMarker = new google.maps.Marker({ position, title: "My current position", icon: 'http://barefoot.senorcoders.com/wp-content/uploads/2020/02/google-maps-location-icon-74-150x150.png'});
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

  
  goBack(){

    this.navCtrl.back();
  }

  unsubscribe(){
    this.rest.stopWatchingPosition();
  }

  addParking(){

    this.hideButton = true;
    if(this.parkingForm.valid){
      console.log("valido", this.parkingForm.value);
      this.sendData();
    }else{
     console.log("invalido");
      this.hideButton = false;
    }

  }

  sendData(){
    console.log("What to send")
    this.rest.sendData("/api/addparking", this.parkingForm.value).subscribe(val => {
      this.presentToast("Your parking has been added");
      this.hideButton = false;
   
    }, error => {
      this.presentToast(error);
      this.hideButton = false;

    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
