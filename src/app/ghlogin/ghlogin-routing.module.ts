import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GhloginPage } from './ghlogin.page';

const routes: Routes = [
  {
    path: '',
    component: GhloginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhloginPageRoutingModule {}
