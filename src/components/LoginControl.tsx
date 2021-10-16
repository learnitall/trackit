import { IonButtons, IonButton, IonIcon, IonText } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { Component } from "react";


function LoginButton(props: { onClick: any }) {
    return (
      <IonButtons slot="end">
        <IonButton>
          <IonIcon style={{"padding-right": "5px"}} size="large" icon={logoGoogle}></IonIcon>
          <IonText>Login</IonText>
        </IonButton>
      </IonButtons>
    );
}

function LogoutButton(props: { onClick: any }) {
    return (
      <IonButtons slot="end">
        <IonButton>
          <IonIcon style={{"padding-right": "5px"}} size="large" icon={logoGoogle}></IonIcon>
          <IonText>Logout</IonText>
        </IonButton>
      </IonButtons>
    );
}

interface LoginControlState {
  isLoggedIn: boolean
}

// Based on https://reactjs.org/docs/conditional-rendering.html
class LoginControl extends Component<{}, LoginControlState> {
    constructor(props: {}) {
      super(props);
      this.handleLoginClick = this.handleLoginClick.bind(this);
      this.handleLogoutClick = this.handleLogoutClick.bind(this);
      this.state = {isLoggedIn: false};
    }
  
    handleLoginClick() {
      this.setState({isLoggedIn: true});
    }
  
    handleLogoutClick() {
      this.setState({isLoggedIn: false});
    }
  
    render() {
      const isLoggedIn = this.state.isLoggedIn;
      let button;
      if (isLoggedIn) {
        button = <LogoutButton onClick={this.handleLogoutClick} />;
      } else {
        button = <LoginButton onClick={this.handleLoginClick} />;
      }
  
      return ( <>{button}</> );
    }
  }

  export default LoginControl;
