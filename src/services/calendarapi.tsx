import React, {createContext} from 'react';
// Helpful docs:
// https://github.com/google/google-api-javascript-client
// https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md

const LOAD_TIMEOUT = 5000; // 5 seconds
interface CalendarApiLoadState {
  auth: boolean,
  errored: boolean,
  timeout: boolean,
  loaded: boolean,
  ready: boolean
};
const initialCalendarApiLoadState: CalendarApiLoadState = {
  auth: false,
  errored: false,
  timeout: false,
  loaded: false,
  ready: false,
};
interface CalendarApiCache {
  names: string[],
  pulledNames: boolean,
};
const initialCalendarApiCache: CalendarApiCache = {
  names: [],
  pulledNames: false,
};
export interface CalendarApiState {
  loadState: CalendarApiLoadState,
  cache: CalendarApiCache,
  token: string | undefined,
};
export const initialCalendarApiState: CalendarApiState = {
  loadState: initialCalendarApiLoadState,
  cache: initialCalendarApiCache,
  token: undefined,
};

interface CalendarApiActionPayload {
  loadState: CalendarApiLoadState | null,
  token: string | undefined,
  cache: CalendarApiCache | null,
};
const nullCalendarApiActionPayload: CalendarApiActionPayload = {
  loadState: null,
  token: undefined,
  cache: null,
};
interface CalendarApiAction {
  type: string,
  payload: CalendarApiActionPayload
};

export const CalendarApiContext = createContext<{
  state: CalendarApiState,
  dispatch: React.Dispatch<any>;
}>({
  state: initialCalendarApiState,
  dispatch: () => null,
});
export const calendarReducer = (
    state: CalendarApiState, action: CalendarApiAction,
) => {
  let calendarApiState: CalendarApiState | null;
  switch (action.type) {
    case 'TOKEN':
      console.log('Got token action for calendar');
      calendarApiState = {
        ...state,
        token: action.payload.token,
        loadState: {
          ...state.loadState,
          ...action.payload.loadState,
        },
      };
      break;
    case 'LOAD':
      console.log('Got load action for calendar');
      calendarApiState = {
        ...state,
        loadState: {
          ...state.loadState,
          ...action.payload.loadState,
        },
      };
      break;
    case 'CLEAR':
      console.log('Got clear action for calendar');
      calendarApiState = {
        ...state,
        token: undefined,
        loadState: {
          ...state.loadState,
          ready: false,
          auth: false,
        },
        cache: initialCalendarApiCache,
      };
      break;
    case 'CACHE':
      calendarApiState = {
        ...state,
        cache: {
          ...state.cache,
          ...action.payload.cache,
        },
      };
      break;
    default:
      console.warn(`Got unknown even type: ${action.type}`);
      calendarApiState = state;
  }
  console.log('Setting new calendar api state:');
  console.log(calendarApiState);
  return calendarApiState;
};

/**
 * Load the gapi client.
 * @param {Object} dispatch - React dispatcher to send result to
 * @param {CalendarApiState} state - State of calendar api
 */
export function gapiSetup(
    dispatch: React.Dispatch<CalendarApiAction>,
    state: CalendarApiState,
) {
  if (state.loadState.ready) {
    console.log('gapi client already loaded');
    return;
  }

  console.log('Loading gapi client');
  gapi.load('client', {
    callback: () => {
      console.log('Loaded gapi client');
      if (state.loadState.auth && state.token != undefined) {
        console.log('Found ready to go token, giving to client');
        gapi.client.setToken({access_token: state.token});
      }
      dispatch({
        type: 'LOAD',
        payload: {
          ...nullCalendarApiActionPayload,
          loadState: {
            ...state.loadState,
            ready: state.loadState.auth,
            timeout: false,
            errored: false,
            loaded: true,
          },
        },
      });
    },
    onerror: () => {
      console.log('Error occurred while loading gapi client');
      dispatch({
        type: 'LOAD',
        payload: {
          ...nullCalendarApiActionPayload,
          loadState: {
            auth: false,
            ready: false,
            timeout: false,
            errored: true,
            loaded: false,
          },
        },
      });
    },
    timeout: LOAD_TIMEOUT,
    ontimeout: () => {
      console.log('Timeout occurred while loading gapi client');
      dispatch({
        type: 'LOAD',
        payload: {
          ...nullCalendarApiActionPayload,
          loadState: {
            auth: false,
            ready: false,
            timeout: true,
            errored: true,
            loaded: false,
          },
        },
      });
    },
  });
};

/**
 * Set the token for the gapi client
 * @param {Object} dispatch - Dispatch to send results to
 * @param {CalendarApiState} state - State of Calendar API
 * @param {string} token - token to give to gapi
 */
export function setgapiToken(
    dispatch: React.Dispatch<CalendarApiAction>,
    state: CalendarApiState,
    token: string,
) {
  if (!state.loadState.loaded) {
    console.warn(
        'Got request for setting gapi token, but gapi is not loaded.',
    );
    console.warn(
        'Saving token for later',
    );
    return;
  } else {
    console.warn(
        'gapi client is loaded, setting token',
    );
    gapi.client.setToken({access_token: token});
  }
  dispatch({
    type: 'TOKEN',
    payload: {
      ...nullCalendarApiActionPayload,
      loadState: {
        ...state.loadState,
        auth: true,
        ready: state.loadState.loaded,
      },
      token: token,
    },
  });
}

/**
 * Clear out current CalendarApiState for logout
 * Keeps information about gapi load
 * @param {CalendarApiState} state - current state of calendar api
 * @param {Object} dispatch - dispatch to send CLEAR signal to
 */
export function clearCalendarApiState(
    state: CalendarApiState,
    dispatch: React.Dispatch<CalendarApiAction>,
) {
  dispatch({
    type: 'CLEAR',
    payload: nullCalendarApiActionPayload,
  });
}

/**
 * Get a list of the names of the user's calendar
 * Uses the following endpoint:
 * https://developers.google.com/calendar/api/v3/reference/calendarList/list
 * @param {Object} dispatch - Dispatch to send results to
 * @param {CalendarApiState} state - State of Calendar API
 */
export async function getListCalendarNames(
    dispatch: React.Dispatch<CalendarApiAction>,
    state: CalendarApiState,
) {
  if (!state.loadState.ready) {
    console.warn(
        'Got request for listing calendar names, but gapi is not ready',
    );
    return;
  }
  gapi.client.request({
    path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    method: 'GET',
  }).then(
      (response) => {
        console.log('Got response from gapi:');
        console.log(response);
        const calendarNames: string[] = [];
        response.result.items.forEach(
            (item: {summary: string}) => calendarNames.push(item.summary),
        );
        dispatch({
          type: 'CACHE',
          payload: {
            ...nullCalendarApiActionPayload,
            cache: {
              ...initialCalendarApiCache,
              names: calendarNames,
              pulledNames: true,
            },
          },
        });
      },
      (rejected) => {
        console.log('Got reject from gapi:');
        console.log(rejected);
      },
  );
}
