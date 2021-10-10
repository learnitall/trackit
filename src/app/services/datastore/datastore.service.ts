import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  constructor() {}

  setCreds(creds: any): void {}
  getCreds(): any { return null; }
  setConfig(config: any): void {}
  getConfig(): any { return null; }

}
