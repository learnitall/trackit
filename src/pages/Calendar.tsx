import React from 'react';
import {
  IonContent,
  IonPage,
  IonText,
} from '@ionic/react';
import {
  AuthContext,
} from '../services/login';
import {
  CalendarApiContext,
  CalendarApiState,
} from '../services/calendarapi';
import PageHeader from '../components/PageHeader';
// import Calendar from '@ericz1803/react-google-calendar';
import './Calendar.css';

const CalendarPage: React.FC = () => {
  /**
   * Use calendarName state to display calendar names
   * @param {CalendarApiState} calendarApiState - state of calendar api to
   * pull calender names from
   * @return {Object | null}
   */
  function showCalendarNames(calendarApiState: CalendarApiState) {
    if (calendarApiState.cache.names.length > 0) {
      return (
        <p>{calendarApiState.cache.names.join()}</p>
      );
    } else {
      return (null);
    }
  }

  return (
    <IonPage>
      <PageHeader />
      <IonContent fullscreen>
        <div className="container">
          <AuthContext.Consumer>
            {(value) =>
              <IonText>
                {value.state.isAuthenticated ?
                <h1>Logged in as {value.state.user}</h1> :
                <h1>Not logged in</h1>
                }
              </IonText>
            }
          </AuthContext.Consumer>
          <CalendarApiContext.Consumer>
            {(value) =>
              <IonText>
                {showCalendarNames(value.state)}
              </IonText>
            }
          </CalendarApiContext.Consumer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;
