import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageproviderService } from '../storageprovider.service';
import { RestService } from '../rest.service';
import { ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  hideButton:boolean = false;
  validation_messages = {
    'field': [
        { type: 'required', message: 'Field is required.' },
        { type: 'minlength', message: 'Field must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Field cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'Your Field must contain only numbers and letters.' },
        { type: 'validUsername', message: 'Your Field has already been taken.' },
        { type: 'email', message: 'Your email is not valid' }
      ]
    
    }
  constructor(private auth: RestService,
    private toastController: ToastController,
    private navCtrl: NavController,
    private router: Router,
    private storageProvider: StorageproviderService) { }

  ngOnInit() {
    this.createFormControls();
    this.createLoginForm();
  }

  createFormControls(){
    this.email = new FormControl('', [Validators.required, Validators.email]); 
    this.password = new FormControl('', [Validators.required]); 
  }

  createLoginForm(){
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    }, {
      updateOn: 'submit'
    })
  }

  login(){
    this.hideButton = true;
    console.log("LOGIN", this.loginForm.value, this.loginForm.valid);
    if(this.loginForm.valid){
      this.sendData();
    }else{
      this.validateAllFormFields(this.loginForm);
      this.hideButton = false;

    }
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

  sendData(){
    console.log("send data");
    this.auth.sendData("/users/login", this.loginForm.value).subscribe(val => {
      let token:any = val;
      console.log("TOKEN", token);
      this.storageProvider.set("login", token.token.token);
      localStorage.setItem("login", token.token.token); // also set it to local storage
      this.storageProvider.set("team", token.team.id);
      this.storageProvider.set("userid", token.userid);
      this.hideButton = false;
      this.goToRoot();
    }, error => {
        this.presentToast("Email and password combination not found.");
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



  async goToRoot(){
    // The page needs to refresh to properly load after initial login
    //window.location.href = '/tabs';
    this.router.navigate(['tabs']);

   // this.router.navigateByUrl('/app/tabs/(tab1:tab1)');

 }

}
