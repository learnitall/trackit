import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
} from '@ionic/react';
import {
  AuthContext,
} from '../services/login';
// import Calendar from '@ericz1803/react-google-calendar';
import './Calendar.css';

const CalendarPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Calendar</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="container">
          <AuthContext.Consumer>
            {(value) =>
              <IonText>
                {value.state.isAuthenticated ?
                <h1>Logged in as {value.state.user}</h1> :
                <h1>Not logged in</h1>}
              </IonText>
            }
          </AuthContext.Consumer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;
