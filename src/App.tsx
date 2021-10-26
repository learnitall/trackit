import React, {useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {help, calendar, trendingUp} from 'ionicons/icons';

import {
  AuthContext,
  loginReducer,
  initialLoginState,
  loadLogin,
} from './services/login';

import {
  CalendarApiContext,
  calendarReducer,
  initialCalendarApiState,
} from './services/calendarapi';

import CalendarPage from './pages/Calendar';
import Insights from './pages/Insights';
import AboutPage from './pages/About';

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
import GapiContainer from './components/GapiContainer';

const App: React.FC = () => {
  const [initState, setInitState] = React.useState(false);
  const [loginState, loginDispatch] = React.useReducer(
      loginReducer,
      initialLoginState,
  );
  const [calendarApiState, calendarDispatch] = React.useReducer(
      calendarReducer,
      initialCalendarApiState,
  );

  useEffect(() => {
    if (!initState) {
      loadLogin(loginDispatch);
      setInitState(true);
    }
  });

  return (
    <IonApp>
      <AuthContext.Provider
        value={{state: loginState, dispatch: loginDispatch}}
      >
        <CalendarApiContext.Provider
          value={{state: calendarApiState, dispatch: calendarDispatch}}
        >
          <GapiContainer />
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/calendar">
                  <CalendarPage />
                </Route>
                <Route exact path="/insights">
                  <Insights />
                </Route>
                <Route exact path="/about">
                  <AboutPage />
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
                <IonTabButton tab="about" href="/about">
                  <IonIcon icon={help} />
                  <IonLabel>About</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </CalendarApiContext.Provider>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
