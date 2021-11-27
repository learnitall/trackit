import React, {createContext} from 'react';
// Helpful docs:
// https://github.com/google/google-api-javascript-client
// https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md
// https://github.com/google/google-api-javascript-client/blob/master/samples/authSample.html

const LOAD_TIMEOUT = 5000; // 5 seconds
// eslint-disable-next-line max-len
const CLIENT_ID = '506233661691-7fngm8v1ti1vsu26dlvk8e4ekrt3s1rd.apps.googleusercontent.com';
const SCOPES = 'profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly';

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
export interface CalendarEvent {
  end: string,
  start: string,
  title: string,
  allDay: boolean,
};
interface CalendarApiCache {
  names: string[],
  ids: string[], // have the same order as 'names'
  pulledNames: boolean, // implies ids are populated as well
  events: Record<string, CalendarEvent[]>,
};
const initialCalendarApiCache: CalendarApiCache = {
  names: [],
  ids: [],
  pulledNames: false,
  events: {},
};
export interface CalendarApiState {
  loadState: CalendarApiLoadState,
  cache: CalendarApiCache,
  currentUser: string | undefined,
  currentCalendarId: string | undefined,
  currentCalendarName: string | undefined,
};
export const initialCalendarApiState: CalendarApiState = {
  loadState: initialCalendarApiLoadState,
  cache: initialCalendarApiCache,
  currentUser: undefined,
  currentCalendarId: undefined,
  currentCalendarName: undefined,
};

interface CalendarApiActionPayload {
  loadState: CalendarApiLoadState | null,
  cache: CalendarApiCache | null,
  currentUser: string | undefined,
  currentCalendarId: string | undefined,
  currentCalendarName: string | undefined,
};
const nullCalendarApiActionPayload: CalendarApiActionPayload = {
  loadState: null,
  cache: null,
  currentUser: undefined,
  currentCalendarId: undefined,
  currentCalendarName: undefined,
};
export interface CalendarApiAction {
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
    case 'SETCAL':
      console.log('Got setcal action for calendar');
      console.log('Setting calendar to:');
      console.log(action.payload.currentCalendarId);
      calendarApiState = {
        ...state,
        currentCalendarId: action.payload.currentCalendarId,
        currentCalendarName: action.payload.currentCalendarName,
      };
      break;
    case 'LOAD':
      console.log('Got load action for calendar');
      calendarApiState = {
        ...state,
        currentUser: action.payload.currentUser,
        loadState: {
          ...state.loadState,
          ...action.payload.loadState,
        },
      };
      break;
    case 'CLEAR':
      console.log('Got clear action for calendar');
      calendarApiState = {
        currentUser: undefined,
        currentCalendarId: undefined,
        currentCalendarName: undefined,
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
      console.warn(`Got unknown event type: ${action.type}`);
      calendarApiState = state;
  }
  console.log('Setting new calendar api state:');
  console.log(calendarApiState);
  return calendarApiState;
};

/**
 * Return handle for sign in state bound to given dispatch
 * @param {CalendarApiState} state - state of calendar api
 * @param {Object} dispatch - dispatch to send api events to
 * @return {function}
 */
function getSignInHandler(
    state: CalendarApiState,
    dispatch: React.Dispatch<CalendarApiAction>,
) {
  console.log('Handling update in login state...');

  // eslint-disable-next-line require-jsdoc
  function _handleSignInState(isSignedIn: boolean) {
    if (isSignedIn) {
      const currentUser: string = gapi.auth2.getAuthInstance().currentUser
          .get().getBasicProfile().getEmail();
      console.log(`Got login from ${currentUser}`);
      dispatch({
        type: 'LOAD',
        payload: {
          ...nullCalendarApiActionPayload,
          currentUser: currentUser,
          loadState: {
            ...state.loadState,
            loaded: true,
            auth: true,
            ready: true,
          },
        },
      });
    } else {
      console.log('No one is signed in');
      clearCalendarApiState(state, dispatch);
      dispatch({
        type: 'LOAD',
        payload: {
          ...nullCalendarApiActionPayload,
          loadState: {
            ...state.loadState,
            loaded: true,
            auth: false,
            ready: false,
          },
        },
      });
    }
  }
  return _handleSignInState;
}

/**
 * Load the gapi client and auth module.
 * @param {Object} dispatch - React dispatcher to send result to
 * @param {CalendarApiState} state - State of calendar api
 */
export function gapiLoad(
    dispatch: React.Dispatch<CalendarApiAction>,
    state: CalendarApiState,
) {
  if (state.loadState.ready) {
    console.log('gapi already loaded');
    return;
  }

  console.log('Loading gapi');
  gapi.load('client', {
    callback: () => {
      console.log('Loaded gapi');
      dispatch({
        type: 'LOAD',
        payload: {
          ...nullCalendarApiActionPayload,
          loadState: {
            ...state.loadState,
            auth: false,
            ready: false,
            timeout: false,
            errored: false,
            loaded: true,
          },
        },
      });
      console.log('Doing init');
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      }).then(function() {
        console.log('Init successful');
        getSignInHandler(state, dispatch)(
            gapi.auth2.getAuthInstance().isSignedIn.get(),
        );
      }).catch(function(error) {
        console.log('Got error during gapi init:');
        console.log(error);
      });
    },
    onerror: () => {
      console.log('Error occurred while loading gapi');
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
      console.log('Timeout occurred while loading gapi');
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
 * Use the gapi library to login a user
 * @param {CalendarApiState} state - state of calendar api
 * @param {Object} dispatch - dispatch to send results to
 */
export function doLogin(
    state: CalendarApiState, dispatch: React.Dispatch<CalendarApiAction>,
) {
  gapi.auth2.getAuthInstance().isSignedIn.listen(
      getSignInHandler(state, dispatch),
  );
  gapi.auth2.getAuthInstance().signIn();
}


/**
 * Use the gapi library to logout the user
 * @param {CalendarApiState} state
 * @param {Object} dispatch
 */
export function doLogout(
    state: CalendarApiState, dispatch: React.Dispatch<CalendarApiAction>,
) {
  gapi.auth2.getAuthInstance().isSignedIn.listen(
      getSignInHandler(state, dispatch),
  );
  gapi.auth2.getAuthInstance().signOut();
}


/**
 * Get a list of the names and ids of the user's calendar
 * Uses the following endpoint:
 * https://developers.google.com/calendar/api/v3/reference/calendarList/list
 * @param {Object} dispatch - Dispatch to send results to
 * @param {CalendarApiState} state - State of Calendar API
 */
export async function getCalendarList(
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
        const calendarIds: string[] = [];
        response.result.items.forEach(
            (item: {summary: string, id: string}) => {
              calendarNames.push(item.summary);
              calendarIds.push(item.id);
            },
        );
        dispatch({
          type: 'CACHE',
          payload: {
            ...nullCalendarApiActionPayload,
            cache: {
              ...initialCalendarApiCache,
              names: calendarNames,
              ids: calendarIds,
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

/**
 * Sets the currently selected calendar to the given id
 * @param {string} calendarId - id of currently selected calendar to change to
 * @param {CalendarApiState} state - state of calendar api
 * @param {Object} dispatch - Dispatch to send results to
 */
export async function setCurrentCalendar(
    calendarId: string,
    state: CalendarApiState,
    dispatch: React.Dispatch<CalendarApiAction>,
) {
  dispatch({
    type: 'SETCAL',
    payload: {
      ...nullCalendarApiActionPayload,
      currentCalendarId: calendarId,
      currentCalendarName: state.cache.names[
          state.cache.ids.indexOf(calendarId)
      ],
    },
  });
}

/**
 * Get list of events for the given calendar, storing in local cache
 * @param {string} calendarId - ID of google calendar to pull events from
 * @param {Object} dispatch - Dispatch to send results to
 * @param {CalendarApiState} state - State of Calendar API
 */
export async function getCalendarEvents(
    calendarId: string,
    dispatch: React.Dispatch<CalendarApiAction>,
    state: CalendarApiState,
) {
  if (!state.loadState.ready) {
    console.warn(
        `Got request for getting calendar events for ${calendarId}
        names, but gapi is not ready`,
    );
    return;
  }
  gapi.client.request({
    path: `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    method: 'GET',
    params: {
      'singleEvents': true,
    },
  }).then(
      (response) => {
        console.log('Got response from gapi');
        console.log(response);
        // const nextPageToken: string | undefined =
        // response.result.nextPageToken;
        if (state.cache.events[calendarId] == undefined) {
          state.cache.events[calendarId] = [];
        }
        response.result.items.forEach(
            (item: {
              summary: string,
              end: {
                dateTime: string,
                date: string,
              },
              start: {
                dateTime: string,
                date: string,
              },
              colorId: string,

            }) => {
              let allDay: boolean = false;
              let end: string = item.end.dateTime;
              let start: string = item.start.dateTime;
              if (
                item.end.dateTime == undefined ||
                item.end.dateTime == undefined
              ) {
                allDay = true;
                end = item.end.date;
                start = item.start.date;
              }
              state.cache.events[calendarId].push({
                title: item.summary,
                end: end,
                start: start,
                allDay: allDay,
              });
            },
        );
        dispatch({
          type: 'CACHE',
          payload: {
            ...nullCalendarApiActionPayload,
            cache: {
              ...state.cache,
              events: state.cache.events,
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
