import React, {useContext} from 'react';
import {IonButtons, IonButton, IonIcon, IonText} from '@ionic/react';
import {logoGoogle} from 'ionicons/icons';
import {
  AuthContext,
  doLogin,
  doLogout,
} from '../services/login';

/**
 * Create the login button
 * @param {Object} props - Render properties containing button callback
 * @param {function(): void} props.onClick - Called when login button is pressed
 * @return {Object} - Ionic ion-buttons tag containing the login button
 */
function LoginButton(props: { onClick: () => void }) {
  return (
    <IonButtons slot="end">
      <IonButton onClick={props.onClick}>
        <IonIcon
          style={{'paddingRight': '5px'}}
          size="large"
          icon={logoGoogle}
        ></IonIcon>
        <IonText>Login</IonText>
      </IonButton>
    </IonButtons>
  );
}

/**
 * Create the logout button
 * @param {Object} props - Render properties containing button callback
 * @param {function(): void} props.onClick - Called when logout
 * button is pressed
 * @return {Object} - Ionic ion-buttons tag containing the logout button
 */
function LogoutButton(props: { onClick: any }) {
  return (
    <IonButtons slot="end">
      <IonButton onClick={props.onClick}>
        <IonIcon
          style={{'paddingRight': '5px'}}
          size="large"
          icon={logoGoogle}
        ></IonIcon>
        <IonText>Logout</IonText>
      </IonButton>
    </IonButtons>
  );
}

/**
 * Controls login and logout UI elements.
 * @return {Object} LogoutButton or LoginButton depending on login status
 */
const LoginControl: React.FC<{}> = () => {
  const {dispatch} = useContext(AuthContext);
  /**
   * Called when user clicks on the LoginButton
   * Triggers a Login event
   */
  function handleLoginClick() {
    doLogin(dispatch);
  }

  /**
   * Called when the user clicks on the LogoutButton
   * Triggers a Logout event
   */
  function handleLogoutClick() {
    doLogout(dispatch);
  }

  return (
    <AuthContext.Consumer>
      {(value) => (
        !value.state.isAuthenticated ?
        <LoginButton onClick={handleLoginClick}/> :
        <LogoutButton onClick={handleLogoutClick}/>
      )}
    </AuthContext.Consumer>
  );
};

export default LoginControl;
