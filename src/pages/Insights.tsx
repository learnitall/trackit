import React from 'react';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/react';
import {DateTime} from 'luxon';
import {AxisOptions, Chart} from 'react-charts';
import {
  CalendarApiContext, CalendarApiState, CalendarEvent,
} from '../services/calendarapi';
import PageHeader from '../components/PageHeader';
import ResizableBox from '../components/ResizeableBox';
import {prefersDark} from '../services/darkMode';
import './Insights.css';

type SeriesItem = {
  title: string,
  value: number
}

type Series = {
  label: string,
  data: SeriesItem[],
}

/**
 * Return if the calendar state currently has events populated for the
 * current calendar
 * @param {CalendarApiState} state - state of the calendar api
 * @return {boolean}
 */
function hasEvents(state: CalendarApiState): boolean {
  return !(
    state.currentCalendarId == undefined ||
    state.cache == undefined ||
    state.cache.events == undefined ||
    state.cache.events[state.currentCalendarId] == undefined
  );
}

/**
 * Create an area chart that plots time spent per subject.
 * @param {CalendarApiState} state - state of the calendar api
 * @return {Object}
 */
const TimeSpentPerSubj: React.FC = () => {
  /**
   * Take a CalendarApiState and transform the cached events into
   * data usable by react-charts.
   * @param {CalendarApiState} state - state of calendar api
   * @return {Series[]}
   */
  function getData(state: CalendarApiState) {
    const data: Map<string, number> = new Map<string, number>();
    const series: Series[] = [];
    if (
      state.currentCalendarId != undefined &&
      state.cache.events[state.currentCalendarId] != undefined
    ) {
      state.cache.events[state.currentCalendarId].forEach(
          (event: CalendarEvent) => {
            const current = data.get(event.title);
            if (current == undefined) {
              data.set(event.title, event.durationHours);
            } else {
              data.set(event.title, current + event.durationHours);
            }
          },
      );
    }

    data.forEach((value: number, key: string, map: Map<string, number>) => {
      series.push({label: key, data: [{title: 'Subjects', value: value}]});
    });
    return series;
  }

  // Subject name
  const primaryAxis = React.useMemo(
      (): AxisOptions<SeriesItem> => ({
        getValue: (datum) => datum.title,
      }),
      [],
  );

  // Time spent
  const secondaryAxes = React.useMemo(
      (): AxisOptions<SeriesItem>[] => [
        {
          getValue: (datum) => datum.value,
          min: 0,
        },
      ],
      [],
  );

  return (
    <div style={{flex: 1}}>
      <CalendarApiContext.Consumer>
        {(calValue) =>
          (calValue.state.loadState.ready &&
          calValue.state.loadState.auth &&
          hasEvents(calValue.state)) ?
        <>
          <h2>Time Spent per Subject (Hours)</h2>
          <ResizableBox
            width={window.innerWidth}
            height={window.innerHeight / 2}
          >
            <Chart
              options={{
                data: getData(calValue.state),
                primaryAxis: primaryAxis,
                secondaryAxes: secondaryAxes,
                dark: prefersDark,

              }}
            />
          </ResizableBox>
        </> :
        <h1>Please login or select a calendar.</h1>}
      </CalendarApiContext.Consumer>
    </div>
  );
};

/**
 * Return a graph component showing time spent per subject over time.
 * @return {Object}
 */
const TimeSpentPerSubjOverTime: React.FC = () => {
  const memoCache: Map<CalendarApiState, Series[]> =
    new Map<CalendarApiState, Series[]>();

  /**
   * Take a CalendarApiState and transform the cached events into
   * data usable by react-charts.
   * @param {CalendarApiState} state - state of calendar api
   * @return {Series[]}
   */
  function getData(state: CalendarApiState): Series[] {
    const cached = memoCache.get(state);
    if (cached != undefined) {
      return cached;
    }

    const data: Map<string, Map<string, number>> =
      new Map<string, Map<string, number>>();
    const titles: string[] = [];
    const series: Series[] = [];
    let minTime: DateTime | undefined = undefined;
    let maxTime: DateTime | undefined = undefined;
    if (
      state.currentCalendarId != undefined &&
      state.cache.events[state.currentCalendarId] != undefined
    ) {
      state.cache.events[state.currentCalendarId].forEach(
          (event: CalendarEvent) => {
            const currentDate = DateTime.fromISO(event.start);
            const currentDateKey = currentDate.toFormat('yyyy LLL dd');

            let currentEventList = data.get(event.title);
            if (currentEventList == undefined) {
              currentEventList = new Map<string, number>();
            }
            currentEventList.set(
                currentDateKey, event.durationHours,
            );
            data.set(event.title, currentEventList);

            if (
              minTime == undefined ||
              currentDate.toSeconds() < minTime.toSeconds()
            ) {
              minTime = currentDate;
            }
            if (
              maxTime == undefined ||
              currentDate.toSeconds() > maxTime.toSeconds()
            ) {
              maxTime = currentDate;
            }
            if (titles.indexOf(event.title) == -1) {
              titles.push(event.title);
            }
          },
      );
    }

    titles.forEach((title: string, index: number, array: string[]) => {
      const seriesItems: SeriesItem[] = [];
      let rollingHours: number = 0;
      if (minTime == undefined || maxTime == undefined) {
        return [];
      }
      let date: DateTime = minTime;
      while (date.toSeconds() <= maxTime.toSeconds()) {
        const dateKey = date.toFormat('yyyy LLL dd');
        const hoursOnDate = data.get(title)?.get(dateKey);
        if (hoursOnDate != undefined) {
          rollingHours += hoursOnDate;
        }
        // use toISODate to strip off time component
        // graph tooltip will now show day rather than time
        seriesItems.push({title: date.toISODate(), value: rollingHours});
        date = date.plus({'days': 1});
      }
      series.push({label: title, data: seriesItems});
    });

    memoCache.set(state, series);

    return series;
  }

  // Subject name
  const primaryAxis = React.useMemo(
      (): AxisOptions<SeriesItem> => ({
        getValue: (datum) => DateTime.fromISO(datum.title).toJSDate(),
        scaleType: 'localTime',
        elementType: 'line',
      }),
      [],
  );

  // Time spent
  const secondaryAxes = React.useMemo(
      (): AxisOptions<SeriesItem>[] => [
        {
          getValue: (datum) => datum.value,
          stacked: true,
        },
      ],
      [],
  );

  return (
    <div style={{flex: 1, minHeight: window.innerHeight / 4}}>
      <CalendarApiContext.Consumer>
        {(calValue) =>
          (calValue.state.loadState.ready &&
          calValue.state.loadState.auth &&
          hasEvents(calValue.state)) ?
        <>
          <h2>Time Spent per Subject (Hours) Over Time</h2>
          <ResizableBox
            width={window.innerWidth}
            height={window.innerHeight / 2}
          >
            <Chart
              options={{
                data: getData(calValue.state),
                primaryAxis: primaryAxis,
                secondaryAxes: secondaryAxes,
                dark: prefersDark,
              }}
            />
          </ResizableBox>
        </> :
        <></>}
      </CalendarApiContext.Consumer>
    </div>
  );
};

const Insights: React.FC = () => {
  return (
    <IonPage>
      <PageHeader />
      <IonContent class="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <TimeSpentPerSubj/>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <br/>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <TimeSpentPerSubjOverTime/>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Insights;
