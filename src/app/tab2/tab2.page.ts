import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { RestService } from '../rest.service';
import { StorageproviderService } from '../storageprovider.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  name: FormControl;
  email: FormControl;
  birthdate: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  usertype: FormControl;
  updateForm: FormGroup;
  regex:string='(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9_]).{8,20}$';
  hideButton:boolean = false;
  useremail:any;
  userData:any = [];
  validation_messages = {
    'field': [
        { type: 'required', message: 'Field is required.' },
        { type: 'minlength', message: 'Field must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Field cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'Password needs: 1 uppercase, 1 number, Min 8 characters.' },
        { type: 'validUsername', message: 'Your Field has already been taken.' },
        { type: 'email', message: 'Your email is not valid' }
      ]
    
    }
  constructor(private router: Router, private navCtrl: NavController, private rest: RestService,
    public toastController: ToastController, private storageProvider: StorageproviderService) {}

   async ngOnInit(){
      this.createFormControls();
      this.createupdateForm();
      await this.getUserInfo();
      this.getCurrentData();
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

    getCurrentData(){
      this.rest.sendData('/singleuser', {"email": this.useremail}).subscribe(res => {
        this.userData = res;
        console.log("currentuser", this.userData);
        this.name.setValue(this.userData['name']);
        this.email.setValue(this.userData['email']);
        this.birthdate.setValue(this.userData['birthdate']);
      })
    }
    createFormControls(){
      this.name = new FormControl('', [Validators.required]); 
      this.email = new FormControl('', [Validators.required, Validators.email]); 
      this.birthdate = new FormControl('');
    }
  
    createupdateForm(){
      this.updateForm = new FormGroup({
        name: this.name,
        email: this.email,
        birthdate: this.birthdate,
      }, {
        updateOn: 'submit'
      })
    }


    //custom validation for each form field on DOM
  validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => { 
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);  
      }
    });
  }

  update(){
    this.hideButton = true;
    this.updateForm.controls['email'].setValue(this.updateForm.get('email').value.trim());
    console.log("value", this.updateForm.value, this.updateForm.valid);
    if(this.updateForm.valid){
     this.sendData();
    }else{
      this.validateAllFormFields(this.updateForm);
      this.hideButton = false;
    }
  }

  sendData(){
    console.log("What to send")
    this.rest.updateData("/updateuser" , this.updateForm.value).subscribe(val => {
        this.presentToast("successfully updated");
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
