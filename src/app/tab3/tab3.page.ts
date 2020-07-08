import { Component } from '@angular/core';
import { SailsService } from 'angular2-sails';
import { environment } from 'src/environments/environment';
import { RestService } from '../rest.service';
import { StorageproviderService } from '../storageprovider.service';

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
    private storageProvider: StorageproviderService) {}

 async ngOnInit() {
    this.type = 'received';
    this._sailsService.connect(environment.apiURL);
      let that = this;
      this._sailsService.get('/message/subscribe', function(data, jwr){
        console.log("response", data, jwr);
        that._sailsService.on('new_message').subscribe(entry => {
          console.log("new message", entry);
          that.received.push(entry);
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

}
