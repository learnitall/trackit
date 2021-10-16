import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, trendingUp } from 'ionicons/icons';

import { initializeApp } from "firebase/app";

import PageHeader from './components/PageHeader';

import CalendarPage from './pages/Calendar';
import Insights from './pages/Insights';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


const firebaseConfig = {
  apiKey: "AIzaSyAZkebUc3jK0VFIjF5ZDzrOc3Q85j24gOg",
  authDomain: "trackit-606d0.firebaseapp.com",
  projectId: "trackit-606d0",
  storageBucket: "trackit-606d0.appspot.com",
  messagingSenderId: "669528637609",
  appId: "1:669528637609:web:d0dd1a423c565eb00069b8"
};
const firebaseApp = initializeApp(firebaseConfig);


const App: React.FC = () => (
  <IonApp>
    <PageHeader />
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/calendar">
            <CalendarPage />
          </Route>
          <Route exact path="/insights">
            <Insights />
          </Route>
          <Route exact path="/">
            <Redirect to="/calendar" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="calendar" href="/calendar">
            <IonIcon icon={calendar} />
            <IonLabel>Calendar</IonLabel>
          </IonTabButton>
          <IonTabButton tab="insights" href="/insights">
            <IonIcon icon={trendingUp} />
            <IonLabel>Insights</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
