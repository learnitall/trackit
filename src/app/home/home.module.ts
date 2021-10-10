import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { DataStoreGHService } from '../services/datastore-gh/datastore-gh.service';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    CalendarModule.forRoot({ 
      provide: DateAdapter, 
      useFactory: adapterFactory 
    }),
  ],
  entryComponents: [
    CalendarComponent
  ],
  declarations: [HomePage, CalendarComponent],
  providers: [DataStoreGHService]
})
export class HomePageModule {}
