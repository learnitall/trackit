import { IonItem, IonThumbnail, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import './HeaderContainer.css';

const HeaderContainer: React.FC = () => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonItem>
                    <IonThumbnail>
                        <img src={process.env.PUBLIC_URL + '/assets/icon/icon.png'} style={{ borderRadius: "5px"}}/>
                     </IonThumbnail>
                    <IonTitle>Track It</IonTitle>
                </IonItem>
            </IonToolbar>
        </IonHeader>
    );
};

export default HeaderContainer