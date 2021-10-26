import React, {useContext, useEffect, useState} from 'react';
import scriptjs from 'scriptjs';
import {
  CalendarApiContext,
  gapiSetup,
  setgapiToken,
  getListCalendarNames,
  clearCalendarApiState,
} from '../services/calendarapi';
import {AuthContext} from '../services/login';

const GapiContainer: React.FC<{}> = () => {
  const [gapiScriptLoad, setgapiScriptLoad] = useState(false);
  const {
    state: calendarState,
    dispatch: calendarDispatch,
  } = useContext(CalendarApiContext);
  const {state: authState} = useContext(AuthContext);

  useEffect(() => {
    scriptjs(
        'https://apis.google.com/js/api.js', () => {
          if (!gapiScriptLoad) {
            gapiSetup(
                calendarDispatch,
                calendarState,
            );
            setgapiScriptLoad(true);
          }
        },
    );
  }, []);

  useEffect(() => {
    if (calendarState.loadState.ready && !calendarState.cache.pulledNames) {
      getListCalendarNames(
          calendarDispatch,
          calendarState,
      );
    }

    if (
      authState.isAuthenticated &&
      authState.credential != null &&
      authState.credential.accessToken != undefined &&
      calendarState.token != authState.credential.accessToken
    ) {
      setgapiToken(
          calendarDispatch,
          calendarState,
          authState.credential.accessToken,
      );
    }

    if (
      !authState.isAuthenticated &&
      calendarState.token != undefined
    ) {
      clearCalendarApiState(calendarState, calendarDispatch);
    }
  }, [calendarState, authState]);

  return (null);
};

export default GapiContainer;
