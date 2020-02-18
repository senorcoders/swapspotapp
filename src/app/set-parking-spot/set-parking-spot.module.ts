import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetParkingSpotPageRoutingModule } from './set-parking-spot-routing.module';

import { SetParkingSpotPage } from './set-parking-spot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetParkingSpotPageRoutingModule
  ],
  declarations: [SetParkingSpotPage]
})
export class SetParkingSpotPageModule {}
