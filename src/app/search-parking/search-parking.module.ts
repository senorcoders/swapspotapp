import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchParkingPageRoutingModule } from './search-parking-routing.module';

import { SearchParkingPage } from './search-parking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchParkingPageRoutingModule
  ],
  declarations: [SearchParkingPage]
})
export class SearchParkingPageModule {}
