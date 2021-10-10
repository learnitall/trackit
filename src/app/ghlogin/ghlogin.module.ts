import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GhloginPageRoutingModule } from './ghlogin-routing.module';

import { GhloginPage } from './ghlogin.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    GhloginPageRoutingModule
  ],
  declarations: [GhloginPage]
})
export class GhloginPageModule {}
