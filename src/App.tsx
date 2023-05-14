import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Tab5 from './pages/Tab5';
import Drawing from './pages/Drawing';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
// import '@ionic/react/css/padding.css';
// import '@ionic/react/css/float-elements.css';
// import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
// import '@ionic/react/css/flex-utils.css';
// import '@ionic/react/css/display.css';


/* Theme variables */
import './theme/variables.css';
import app from './App.module.css'

import useSqlite  from './database';
import { useEffect } from 'react';
import { AiOutlineHome, AiOutlineSearch, AiOutlinePlus, AiOutlineFolder, AiOutlineUser } from "react-icons/ai";
setupIonicReact();

const App: React.FC = () => {
  const { db, error, sqlite } = useSqlite();
  useEffect(() => {
    const createTables = async () => {
      if (db) {
        try {
          await db.open();
          await db.execute(`
          CREATE TABLE IF NOT EXISTS drawing (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            canvasColor TEXT,
            canvasHeight INTEGER,
            canvasWidth INTEGER,
            liked INTEGER,
            designId TEXT,
            designJson TEXT,
            thumbnail TEXT,
            categories TEXT
          )
        `);
          
          await db.execute(`
          CREATE TABLE IF NOT EXISTS catagories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
          )
        `);
        await db.close();
    await sqlite?.closeConnection("db_ionicble", false);  
        } catch (err) {
          console.error(err);
        }
      }
    };

    createTables();
  }, [db]);
  return <IonApp>
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tab1">
          <Tab1 />
        </Route>
        <Route path="/tab2">
          <Tab2 />
        </Route>
        <Route path="/tab3">
          <Tab3 />
        </Route>
        <Route path="/tab4">
          <Tab4 />
        </Route>
        <Route path="/tab5">
          <Tab5 />
        </Route>
        <Route exact path="/">
          <Redirect to="/tab1" />
        </Route>
       
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tab1">
        <AiOutlineHome aria-hidden="true" />
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tab2">
        <AiOutlineSearch />
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tab3">
        <AiOutlinePlus />
        </IonTabButton>
        <IonTabButton tab="tab4" href="/tab4">
        <AiOutlineFolder />
        </IonTabButton>
        <IonTabButton tab="tab5" href="/tab5">
        <AiOutlineUser />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
    <Route path="/drawing">
          <Drawing />
        </Route>
  </IonReactRouter>
</IonApp>;
}

export default App;
