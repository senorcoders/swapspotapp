import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';
import { StorageproviderService } from '../storageprovider.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: FormControl;
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  usertype: FormControl;
  registerForm: FormGroup;
  regex:string='(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9_]).{8,20}$';
  hideButton:boolean = false;
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
    public toastController: ToastController, private storageProvider: StorageproviderService) { }

  ngOnInit() {
    this.createFormControls();
    this.createRegisterForm();
  }

  async goToRoot(){
    this.router.navigate(['tabs']);

  }

  createFormControls(){
    this.name = new FormControl('', [Validators.required]); 
    this.email = new FormControl('', [Validators.required, Validators.email]); 
    this.password = new FormControl('',[Validators.required, Validators.pattern(this.regex)]);
    this.confirmPassword = new FormControl('',[Validators.required]);
  }

  createRegisterForm(){
    this.registerForm = new FormGroup({
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
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

  register(){
    this.hideButton = true;
    this.registerForm.controls['email'].setValue(this.registerForm.get('email').value.trim());
    console.log("value", this.registerForm.value, this.registerForm.valid);
    if(this.registerForm.valid){
      if(this.password.value === this.confirmPassword.value){
        console.log("All ready");
        this.sendData();

      }else{
        this.hideButton = false;
        this.presentToast("Passwords don't match");
      }
    }else{
      this.validateAllFormFields(this.registerForm);
      this.hideButton = false;
    }
  }

  sendData(){
    console.log("What to send")
    this.rest.sendData("/users", this.registerForm.value).subscribe(val => {
      if(val.hasOwnProperty('message')){
        this.presentToast(val['message']);
        this.hideButton = false;
      }else{
        let token:any = val;
        console.log("TOKEN", token);
       
        this.storageProvider.set("login", token.token);
        localStorage.setItem("login", token.token); // also set it here
      // this.storageProvider.set("team", token.team.id);
      this.storageProvider.set("userid", token.userid);
      this.storageProvider.set("first_time", true);
      console.log("SET USERID: ", token.userid);
      
      setTimeout(() => {
        this.rest.watchPosition();
        this.goToRoot();

      }, 2000);
      }
   
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
