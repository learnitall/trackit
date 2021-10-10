import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }

  async getEvents(): Promise<CalendarEvent[]> { return null; }
  async setEvents(events: CalendarEvent[]) {}
  async init() {}
  async test(): Promise<boolean> { return null; }

}
