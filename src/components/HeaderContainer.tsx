import { IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import './HeaderContainer.css';

const HeaderContainer: React.FC = () => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle>Track It</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

export default HeaderContainer