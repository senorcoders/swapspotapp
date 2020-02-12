import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchParkingPage } from './search-parking.page';

const routes: Routes = [
  {
    path: '',
    component: SearchParkingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchParkingPageRoutingModule {}
