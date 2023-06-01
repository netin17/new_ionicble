import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import {StoreContext} from './Store/CanvasStore'
import reportWebVitals from './reportWebVitals';
import { defineCustomElements as jeepSqlite, applyPolyfills, JSX as LocalJSX  } from "jeep-sqlite/loader";
import { HTMLAttributes } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

type StencilToReact<T> = {
  [P in keyof T]?: T[P] & Omit<HTMLAttributes<Element>, 'className'> & {
    class?: string;
  };
} ;

declare global {
  export namespace JSX {
    interface IntrinsicElements extends StencilToReact<LocalJSX.IntrinsicElements> {
    }
  }
}

applyPolyfills().then(() => {
  jeepSqlite(window);
});
window.addEventListener('DOMContentLoaded', async () => {
  console.log('$$$ in index $$$');
  const platform = Capacitor.getPlatform();
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  try {

    if(platform === "web") {
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
    }
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection("db_ionicble", false)).result;
    var db: SQLiteDBConnection
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection("db_ionicble", false);
    } else {
            //await sqlite.closeConnection("db_ionicble", false);
      db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
    }

    
    await db.open();
    const drawingRes: any =  await db.execute(`
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
    
  const categortyRes: any = await db.execute(`
    CREATE TABLE IF NOT EXISTS catagories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);
    

   
    console.log(`categortyRes: ${JSON.stringify(categortyRes)}`);
     console.log(`drawingRes: ${JSON.stringify(drawingRes)}`);
    await db.close();
    await sqlite.closeConnection("db_ionicble", false);
    const container = document.getElementById('root');
    const root = createRoot(container!);
    root.render(
      <StoreContext>
        <App />
      </StoreContext>
    );
    
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://cra.link/PWA
    serviceWorkerRegistration.unregister();
    
    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Error: ${err}`)
  }
});