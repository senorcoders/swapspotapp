import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetParkingSpotPage } from './set-parking-spot.page';

const routes: Routes = [
  {
    path: '',
    component: SetParkingSpotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetParkingSpotPageRoutingModule {}
