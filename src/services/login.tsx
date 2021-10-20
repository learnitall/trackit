import React, {createContext} from 'react';
import {Storage} from '@ionic/storage';
import {initializeApp} from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
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

const auth = getAuth();
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');

// Based on https://www.freecodecamp.org/news/state-management-with-react-hooks/
// and https://elisealcala.com/context-use-reducer-typescript/
interface LoginState {
  isAuthenticated: boolean,
  user: string | null,
  token: string | null,
  error: string | null,
};
export const initialLoginState: LoginState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};
interface LoginPayload {
  user: string | null,
  token: string | null,
  error: string | null,
};
interface LoginAction {
  type: string,
  payload: LoginPayload
};


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
        token: action.payload.token,
        error: null,
      };
      console.log(`Logged in as ${action.payload.user} through dispatch`);
      break;
    case 'LOGOUT':
      loginState = null;
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
  // When setting these levels to debug, these messages will
  // show up twice... not sure why.
  if (loginState == null) {
    console.log('Got logout request, clearing storage');
    store.clear();
  } else {
    console.log('Saving the following loginState:');
    console.log(loginState);
    store.set('loginState', loginState);
    return loginState;
  }
};

/**
 * Initialize loginState by loading fro local storage
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
    if (loadedLoginState.user !== null && loadedLoginState.token !== null) {
      dispatch({
        type: 'LOGIN',
        payload: {
          user: loadedLoginState.user,
          token: loadedLoginState.token,
          error: null,
        },
      });
      return;
    }
  }
  console.log('No existing login found, triggering logout');
  dispatch({
    type: 'LOGOUT',
    payload: {
      user: null,
      token: null,
      error: null,
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
        if (credential != null) {
          const token = credential.accessToken;
          const user = result.user;
          const userEmail = user.email;
          if (token != undefined && userEmail != null) {
            dispatch({
              type: 'LOGIN',
              payload: {
                user: userEmail,
                token: token,
                error: null,
              },
            });
            return;
          } else {
            errorMsg = 'Could not get user email or token';
          }
        } else {
          errorMsg = 'Could not get credential';
        }
        dispatch({
          type: 'ERROR',
          payload: {
            user: null,
            token: null,
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
            user: email,
            token: null,
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
        user: null,
        token: null,
        error: null,
      },
    });
  }).catch((error) => {
    dispatch({
      type: 'LOGOUT',
      payload: {
        user: null,
        token: null,
        error: `${error.message} (${error.code})`,
      },
    });
  });
}
