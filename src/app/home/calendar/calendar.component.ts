import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
  Injectable,
  ViewEncapsulation
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  addMinutes,
  endOfWeek
} from 'date-fns';
import { Subject, fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { WeekViewHourSegment } from 'calendar-utils';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarEventTitleFormatter
} from 'angular-calendar';

import { ModalController } from '@ionic/angular';
import { ModalPage } from './modal/modal.page';


function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

/*
const colors: any = {
  lavender: {
    primary: '#AA7DCE',
    secondary: '#AA7DCE',
    name: 'Lavender'
  },
  lpink: {
    primary: '#F4A5AE',
    secondayr: '#F4A5AE',
    name: 'Light Pink'
  },
  crose: {
    primary: '#A8577E',
    secondary: '#A8577E',
    name: 'China Rose'
  },
  inchworm: {
    primary: '#C2F970',
    secondary: '#C2F970',
    name: 'Inchworm'
  },
  pnavy: {
    primary: '#564D80',
    secondary: '#564D80',
    name: 'Purple Navy'
  },
  wbyonder: {
    primary: '#98A6D4',
    secondary: '#98A6D4',
    name: 'Wild Blue Yonder'
  },
  tgreen: {
    primary: '#D3FCD5',
    secondary: '#98A6D4',
    name: 'Tea Green'
  }

};
*/

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  styles: [
    `
      .disable-hover {
        pointer-events: none;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.doRefresh();
  }

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  weekStartsOn: 0 = 0;
  actions: CalendarEventAction[] = [];
  dragToCreateActive = false;
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];

  private doRefresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  async handleClicked(event: CalendarEvent) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        "event": event
      }
    });

    await modal.present();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if (action == "Clicked") this.handleClicked(event);
  }

  getNewEvent(): CalendarEvent {
    return {
      id: this.events.length,
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      actions: this.actions,
      meta: {}
    };
  }

  addEvent(event: CalendarEvent): void {
    this.events = [
      ...this.events,
      event
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = this.getNewEvent();
    if (dragToSelectEvent.meta == null) {
      dragToSelectEvent.meta = {}
    }
    dragToSelectEvent.meta.tmpEvent = true;
    dragToSelectEvent.start = segment.date;
    dragToSelectEvent.end = null;
    this.addEvent(dragToSelectEvent);

    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.doRefresh();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.doRefresh();
      });
    
  }

}
