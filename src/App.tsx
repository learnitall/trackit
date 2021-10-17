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
import {calendar, trendingUp} from 'ionicons/icons';

import {
  AuthContext,
  loginReducer,
  initialLoginState,
  loadLogin,
} from './services/login';

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

let _initialized: boolean = false;

const App: React.FC = () => {
  const [loginState, loginDispatch] = React.useReducer(
      loginReducer,
      initialLoginState,
  );
  useEffect(() => {
    if (!_initialized) {
      loadLogin(loginDispatch);
      _initialized = true;
    }
  });

  return (
    <IonApp>
      <AuthContext.Provider
        value={{state: loginState, dispatch: loginDispatch}}
      >
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
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
