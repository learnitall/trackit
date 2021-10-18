import React from 'react';
import {
  IonContent,
  IonPage,
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import PageHeader from '../components/PageHeader';
import './Insights.css';

const Insights: React.FC = () => {
  return (
    <IonPage>
      <PageHeader />
      <IonContent fullscreen>
        <ExploreContainer name="Tab 2 page" />
      </IonContent>
    </IonPage>
  );
};

export default Insights;
