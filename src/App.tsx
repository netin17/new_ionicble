import React, { useState, useRef }  from 'react';
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
import { fabric } from 'fabric';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Tab5 from './pages/Tab5';
import Drawing from './pages/Drawing';

import WebFont from 'webfontloader';

import { SQLiteHook, useSQLite } from 'react-sqlite-hook';

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
import app from './App.module.css';

//import useSqlite  from './database';
import { useEffect } from 'react';
import { AiOutlineHome, AiOutlineSearch, AiOutlinePlus, AiOutlineFolder, AiOutlineUser } from "react-icons/ai";

interface JsonListenerInterface {
  jsonListeners: boolean,
  setJsonListeners: React.Dispatch<React.SetStateAction<boolean>>,
}
interface existingConnInterface {
  existConn: boolean,
  setExistConn: React.Dispatch<React.SetStateAction<boolean>>,
}

// Singleton SQLite Hook
export let sqlite: SQLiteHook;
// Existing Connections Store
export let existingConn: existingConnInterface;
// Is Json Listeners used
export let isJsonListeners: JsonListenerInterface;

setupIonicReact();

const App: React.FC = () => {
  const [existConn, setExistConn] = useState(false);
  existingConn = {existConn: existConn, setExistConn: setExistConn};

  // !!!!! if you do not want to use the progress events !!!!!
  // since react-sqlite-hook 2.1.0
  // sqlite = useSQLite()
  // before
  // sqlite = useSQLite({})
  // !!!!!                                               !!!!!

  sqlite = useSQLite();
  console.log(`$$$ in App sqlite.isAvailable  ${sqlite.isAvailable} $$$`);

  const loadGoogleFonts = async (fontFamily:any) => {
    WebFont.load({
        google: {
            families: fontFamily
        }
    });
}

useEffect(() => {
    fabric.textureSize = 4096;
    async function getData() {
        let fontArray2 = [
            "Acme",
            "Artifika",
            "Comic Neue",
            "Just Another Hand",
            "Black Han Sans",
            "Playball",
            "Poppins",
            "Ultra",
            "Rock Salt",
            "Rubik Wet Paint",
            "Titan One",
            "Luckiest Guy",
            "Creepster",
            "Monoton",
            "Audiowide",
            "Atomic Age",
            "Sigmar One",
            "Black Ops One",
            "Slackey",
            "Rammetto One",
            "Knewave",
            "Rye",
            "Bungee Inline",
            "Rubik Moonrocks",
            "Rampart One",
            "Pirata One",
            "UnifrakturMaguntia",
            "Lemon",
            "Silkscreen",
            "Eater",
            "Vast Shadow",
            "Modak",
            "Coiny",
            "Faster One",
            "Frijole",
            "Gorditas",
            "Ranchers",
            "Climate Crisis",
            "Monofett",
            "Miniver",
            "Plaster",
            "Kavoon",
            "Chicle",
            "Sancreek",
            "Sarina",
            "Offside",
            "Kumar One",
            "Vampiro One",
            "Fascinate",
            "Ewert",
            "Rubik Beastly",
            "Oi"
        ]
        loadGoogleFonts(fontArray2)
    }
    getData()
}, []);

  return (
    <IonApp>
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
</IonApp>
  );
};

export default App;