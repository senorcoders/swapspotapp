import { Component } from '@angular/core';
import { SailsService } from 'angular2-sails';
import { environment } from 'src/environments/environment';
import { RestService } from '../rest.service';
import { StorageproviderService } from '../storageprovider.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  type: string;
  received:any = [];
  sent:any = [];
  useremail:any;

  constructor(private _sailsService:SailsService,
    private rest: RestService,
    private storageProvider: StorageproviderService,
    private toastController: ToastController) {}

 async ngOnInit() {
    this.type = 'received';
    this._sailsService.connect(environment.apiURL);
      let that = this;
      this._sailsService.get('/message/subscribe', function(data, jwr){
        console.log("response", data, jwr);
        that._sailsService.on('new_message').subscribe(entry => {
          console.log("new message", entry);
          if(entry['receiver'] == that.useremail){
            that.received.push(entry);

          }else{
            that.sent.push(entry);
          }
        })
      })

      await this.getUserInfo();
      this.getReceived();
      this.getSent();
  }


  getUserInfo(){
    return new Promise((resolve, reject) => {
      this.storageProvider.get('email').then(res => {
        this.useremail = res;
        console.log("userid", res, this.useremail);
        resolve();
      })
    })
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  getReceived(){
    this.rest.sendData('/api/inbox', {"receiver": this.useremail}).subscribe(res => {
      this.received = res;
      console.log("msg", this.received);
    })
  }

  getSent(){
    this.rest.sendData('/api/sent', {"sender": this.useremail}).subscribe(res => {
      this.sent = res;
      console.log("msg", this.received);
    })
  }


  sendMessage(data, status){
    let sntMsg;
    if(status == 'accept'){
      sntMsg = 'Your request for swap spots has been accepted';
    }else{
      sntMsg = 'Your request for swap spots has been denied';

    }

    let info = {
      sender: this.useremail,
      receiver: data.sender,
      message: sntMsg
    };
    this.rest.sendData('/api/message', info).subscribe(res => {
      console.log("mensaje enviado", res);
      this.presentToast("Your response for swap spots has been sent.");
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
