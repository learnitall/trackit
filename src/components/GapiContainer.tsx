import React, {useContext, useEffect, useState} from 'react';
import scriptjs from 'scriptjs';
import {
  CalendarApiContext,
  gapiLoad,
  getCalendarList,
  getCalendarEvents,
} from '../services/calendarapi';

const GapiContainer: React.FC<{}> = () => {
  const [gapiScriptLoad, setgapiScriptLoad] = useState(false);
  const {
    state: calendarState,
    dispatch: calendarDispatch,
  } = useContext(CalendarApiContext);

  useEffect(() => {
    scriptjs(
        'https://apis.google.com/js/api.js', () => {
          if (!gapiScriptLoad) {
            gapiLoad(
                calendarDispatch,
                calendarState,
            );
            setgapiScriptLoad(true);
          }
        },
    );
  }, []);

  useEffect(() => {
    if (calendarState.loadState.ready) {
      if (!calendarState.cache.pulledNames) {
        getCalendarList(
            calendarDispatch,
            calendarState,
        );
      }
      if (
        calendarState.currentCalendarId != undefined &&
        calendarState.cache.events[calendarState.currentCalendarId] == undefined
      ) {
        getCalendarEvents(
            calendarState.currentCalendarId,
            calendarDispatch,
            calendarState,
        );
      }
    }
  }, [calendarState]);

  return (null);
};

export default GapiContainer;
