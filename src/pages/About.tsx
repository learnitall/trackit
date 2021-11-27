import React from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';
import './About.css';

const AboutPage: React.FC<{}> = () => {
  return (
    <IonPage>
      <PageHeader />
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel><strong>General</strong></IonLabel>
          </IonItem>
          <IonItem lines="none">
            <p>
              <strong>Track It&apos;s</strong> goal is to help students and
              professionals track their work over time and gain insights
              through said tracking. It hopes to answer questions like:
              &quot;When on average do I study for my math class?&quot;,
              &quot;How many times a week, on average, have I had a
              meeting during the last month?&quot;, &quot;Which classes
              do I spent the most time studying for?&quot;
              <br/><br/>
              It&apos;s simple in operation. Events are tracked through the
              use of Google Calendar- all this website does is present insights
              gathered from the given calendar in a pretty way. To start,
              create a new calendar where you&apos;ll track your work and
              thrown some events on there. Then, come back and login to your
              Google account with the login button up in the top right.
              This gives the website access to your calendar events for
              analysis, but no data is collected or stored. The website will
              only save your login information on your device for further use.
            </p>
          </IonItem>
          <IonItem id="privacy">
            <IonLabel><strong>Privacy Policy</strong></IonLabel>
          </IonItem>
          <IonItem lines="none">
            <p>
              Track It is written by Ryan Drew, who can be contacted at <a
                href="mailto:learnitall0@gmail.com"
              >learnitall0@gmail.com</a> for any questions or concerns
              regarding privacy. In short, <strong>no information is
              knowingly collected and stored outside of the user&apos;s
              device by this website!</strong>
              <br/><br/>
              This website uses the Google API for accessing user&apos;s
              Google calendars, events and other basic information about
              their Google account (such as name and email). The information
              that this website can access is presented during the Sign-In
              prompt, where users can consent to this read-only access.
              Credentials for access to user data are persisted on the
              user&apos;s device for the sole purposes of convenience, allowing
              the user to not have to login every time they visit Track It.
              None of the data pulled from the users&apos;s Google account is
              sent off of the user&apos;s device, and only stored for caching
              purposes. Track It&apos;s API access to a user&apos;s account, and
              any cached data that Track It has stored on the user&apos;s
              device, can be removed by logging out. Logging out removes any
              stored credentials and data on the user&apos;s device. Track It
              is served statically from Google&apos;s Firebase Hosting service,
              with analytics features disabled. The website is open source and
              the code can be found at <a
                href="https://github.com/learnitall/trackit"
              >https://github.com/learnitall/trackit</a>.
              I, Ryan Drew, have no access to personally-identifiable
              information regarding user visitation.
            </p>
          </IonItem>
          <IonItem id="tos">
            <IonLabel><strong>Terms of Service</strong></IonLabel>
          </IonItem>
          <IonItem lines="none">
            <p>
              By logging into their Google account through Track It, the
              user agrees to read-only access to their calendars, calendar
              events and basic account information. This read-only access
              is to be used for analyzing calendar event data within the
              browser and displaying an embedded Google calendar
              containing user data. The user also agrees to allow Track It
              to store API credentials and cached data received from Google APIs
              on their device, and understands that this website is not
              responsible, nor liable, for unauthorized access to their Google
              account and/or data through the use of said stored data, should it
              be found by a malicious actor.
              <br/><br/>
              Track It will try its best to display accurate and helpful
              information regarding a user&apos;s calendar event data, however
              mistakes happen. Should a user wish for additional features,
              finds a mistake in the data presented, or finds a bug with
              the website, please reach out to <a
                href="mailto:learnitall0@gmail.com"
              >learnitall0@gmail.com</a>.
            </p>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>

  );
};

export default AboutPage;
