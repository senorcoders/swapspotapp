import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './interceptor/token.interceptor';
import { IonicStorageModule } from '@ionic/storage';
import { LoginService } from './login.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import {SailsModule} from "angular2-sails";
import { HaversineService } from "ng2-haversine";

import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(), 
    HttpClientModule, AutoCompleteModule,   
    SailsModule.forRoot()

  ],
  providers: [
    StatusBar,
    HttpClientModule,
    SplashScreen,
    LoginService,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    HaversineService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
