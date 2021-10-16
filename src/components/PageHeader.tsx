import React from 'react';
import {IonHeader, IonToolbar, IonTitle} from '@ionic/react';
import LoginControl from './LoginControl';

const PageHeader: React.FC<{}> = () => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle slot="start">Track It</IonTitle>
        <LoginControl />
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
