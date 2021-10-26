import React, {createContext} from 'react';
import {Storage} from '@ionic/storage';
import {initializeApp} from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  OAuthCredential,
} from 'firebase/auth';
import {firebaseConfig} from './fireconfig';


const store = new Storage();
(
  async () => {
    await store.create();
  }
)();

// eslint-disable-next-line no-unused-vars
const firebaseApp = initializeApp(firebaseConfig);

// Use firebase for oauth then gapi with helmet
// https://firebase.google.com/docs/auth/web/google-signin
const auth = getAuth();
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');

// Based on https://www.freecodecamp.org/news/state-management-with-react-hooks/
// and https://elisealcala.com/context-use-reducer-typescript/
export interface LoginState {
  isAuthenticated: boolean,
  user: string | null,
  credential: OAuthCredential | null,
  refreshToken: string | null,
  error: string | null,
};
export const initialLoginState: LoginState = {
  isAuthenticated: false,
  user: null,
  credential: null,
  refreshToken: null,
  error: null,
};
interface LoginPayload {
  user: string | null,
  credential: OAuthCredential | null,
  refreshToken: string | null
  error: string | null,
};

const nullLoginPayload: LoginPayload = {
  user: null,
  credential: null,
  refreshToken: null,
  error: null,
};
interface LoginAction {
  type: string,
  payload: LoginPayload
};

type DispatchListener = (
  (loginState: LoginState, actionType: string) => void
);


/**
 * Save or clear login state using local storage
 * @param {LoginState} loginState - loginState to pull credential from
 * @param {string} actionType - type of action received in dispatch
 */
function localStorageListener(loginState: LoginState, actionType: string) {
  if (actionType == 'LOGOUT') {
    console.log('Got logout request, clearing local storage');
    store.clear();
  } else {
    console.log('Saving the following loginState:');
    console.log(loginState);
    store.set('loginState', loginState);
  }
}

const dispatchListeners: DispatchListener[] = [
  localStorageListener,
];

/**
 * Invoke each dispatchListener function with given loginState
 * @param {LoginState} loginState - loginState to give to listeners
 * @param {string} actionType - type of action dispatch is handling
 */
function handleListeners(loginState: LoginState, actionType: string) {
  dispatchListeners.forEach((dispatchListener: DispatchListener) => {
    dispatchListener(loginState, actionType);
  });
}

export const AuthContext = createContext<{
  state: LoginState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialLoginState,
  dispatch: () => null,
});
export const loginReducer = (state: LoginState, action: LoginAction) => {
  let loginState: LoginState | null;
  switch (action.type) {
    case 'LOGIN':
      loginState = {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        credential: action.payload.credential,
        error: null,
      };
      console.log(`Logged in as ${action.payload.user} through dispatch`);
      break;
    case 'LOGOUT':
      loginState = initialLoginState;
      console.log('Logged out through dispatch');
      break;
    case 'ERROR':
      loginState = {
        ...state,
        error: action.payload.error,
      };
      console.warn(`Got auth error: ${action.payload.error}`);
      break;
    default:
      console.warn(`Got unknown event type: ${action.type}`);
      loginState = state;
  }
  handleListeners(loginState, action.type);
  return loginState;
};

/**
 * Initialize loginState by loading from local storage
 * @param {Object} dispatch - React dispatcher to send result to
 */
export async function loadLogin(dispatch: React.Dispatch<LoginAction>) {
  const storeKeys = await store.keys();
  console.debug(`Found the following keys in store:`);
  console.debug(storeKeys);
  if (storeKeys.indexOf('loginState') !== -1) {
    const loadedLoginState: LoginState = await store.get('loginState');
    console.debug(`Loaded the following login state:`);
    console.debug(loadedLoginState);
    if (
      loadedLoginState.user !== null &&
      loadedLoginState.credential !== null
    ) {
      dispatch({
        type: 'LOGIN',
        payload: {
          ...nullLoginPayload,
          user: loadedLoginState.user,
          credential: loadedLoginState.credential,
          refreshToken: loadedLoginState.refreshToken,
        },
      });
      return;
    }
  }
  console.log('No existing login found, triggering logout');
  dispatch({
    type: 'LOGOUT',
    payload: {
      ...nullLoginPayload,
    },
  });
}

/**
 * Perform login using firebase api
 * @param {Object} dispatch - React dispatcher to send result to
 */
export function doLogin(dispatch: React.Dispatch<LoginAction>) {
  signInWithPopup(auth, provider)
      .then((result) => {
        let errorMsg;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential != null || result.user.email != null) {
          dispatch({
            type: 'LOGIN',
            payload: {
              ...nullLoginPayload,
              user: result.user.email,
              credential: credential,
              // for some reason this isn't in the credential...
              refreshToken: result.user.refreshToken,
            },
          });
          return;
        } else {
          errorMsg = 'Could not get credential or user email';
        }
        dispatch({
          type: 'ERROR',
          payload: {
            ...nullLoginPayload,
            error: errorMsg,
          },
        });
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        dispatch({
          type: 'ERROR',
          payload: {
            ...nullLoginPayload,
            user: email,
            error: `${errorMessage} (${errorCode})`,
          },
        });
      });
}

/**
 * Perform logout using firebase api
 * @param {Object} dispatch - dispatch to send result to
 */
export function doLogout(dispatch: React.Dispatch<LoginAction>) {
  signOut(auth).then(() => {
    dispatch({
      type: 'LOGOUT',
      payload: {
        ...nullLoginPayload,
      },
    });
  }).catch((error) => {
    dispatch({
      type: 'LOGOUT',
      payload: {
        ...nullLoginPayload,
        error: `${error.message} (${error.code})`,
      },
    });
  });
}
