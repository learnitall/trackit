import React from 'react';
import {
  IonContent,
  IonPage,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import FullCalendar from '@fullcalendar/react';
import listViewPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import {
  CalendarApiAction,
  CalendarApiContext,
  CalendarApiState,
  setCurrentCalendar,
} from '../services/calendarapi';
import PageHeader from '../components/PageHeader';
import './Calendar.css';

const CalendarPage: React.FC = () => {
  const [calendarName, setCalendarName] = React.useState<string | null>(null);

  /**
   * Use calendarName state to display calendar names
   * @param {CalendarApiState} calendarApiState - state of calendar api to
   * pull calender names from
   * @param {CalendarApiState} state - state of calendar api
   * @param {Object} dispatch - dispatch to send SETCAL event to
   * @return {Object | null}
   */
  function showCalendarNames(
      calendarApiState: CalendarApiState,
      state: CalendarApiState,
      dispatch: React.Dispatch<CalendarApiAction>,
  ) {
    if (
      calendarApiState.cache.names.length !=
      calendarApiState.cache.ids.length
    ) {
      return (
        <IonText color="warning">
          Something wrong happened, please refresh.
        </IonText>
      );
    }
    if (calendarApiState.cache.names.length == 0) {
      return (
        <IonText color="warning">
          Waiting for calendar list to load...
        </IonText>
      );
    }
    const calendarOptions = [];
    for (let i = 0; i < calendarApiState.cache.names.length; i++) {
      calendarOptions.push(
          <IonSelectOption key={i} value={calendarApiState.cache.ids[i]}>
            {calendarApiState.cache.names[i]}
          </IonSelectOption>,
      );
    }
    return (
      <IonList>
        <IonItem>
          <IonLabel>Choose Calendar:</IonLabel>
          <IonSelect
            value={calendarName}
            onIonChange={
              (e) => {
                if (
                  e.detail.value == null ||
                  e.detail.value == state.currentCalendarId
                ) {
                  return;
                }
                setCurrentCalendar(
                    e.detail.value, state, dispatch,
                );
                setCalendarName(e.detail.value);
              }
            }
          >
            {calendarOptions}
          </IonSelect>
        </IonItem>
      </IonList>
    );
  }

  /**
   * Display calendar, populated with events in cache
   * @param {CalendarApiState} state - state of calendar api
   * @return {Object}
   */
  function showCalendar(
      state: CalendarApiState,
  ) {
    if (
      state.currentCalendarId == undefined ||
      state.cache.events[state.currentCalendarId] == undefined
    ) {
      return (null);
    }

    return (
      <FullCalendar
        plugins={[listViewPlugin, dayGridPlugin, timeGridWeek]}
        initialView='listWeek'
        events={state.cache.events[state.currentCalendarId]}
        headerToolbar={{
          'start': 'title',
          'center': '',
          'end': 'listWeek,timeGridWeek,dayGridMonth,today,prev,next',
        }}
      />
    );
  }

  return (
    <IonPage>
      <PageHeader />
      <IonContent fullscreen class="ion-padding">
        <CalendarApiContext.Consumer>
          {(calValue) => (<>
            {
              (
                calValue.state.loadState.ready &&
                calValue.state.loadState.auth
              ) ?
              <IonText>
                <h1>Logged in as {calValue.state.currentUser}</h1>
              </IonText> :
              <h1>Not logged in</h1>
            }
            {showCalendarNames(
                calValue.state, calValue.state, calValue.dispatch)}
            {showCalendar(calValue.state)}
          </>)}
        </CalendarApiContext.Consumer>
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;
