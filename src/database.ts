import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { defineCustomElements as jeepSqlite, applyPolyfills, JSX as LocalJSX } from "jeep-sqlite/loader";
import { SQLiteHook, useSQLite } from 'react-sqlite-hook';
import { HTMLAttributes } from 'react';
type HookResult = {
  db: SQLiteDBConnection | undefined;
  error: any;
  sqlite: SQLiteConnection | undefined;
  isOpen: boolean;
};
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

export let sqlitehook: SQLiteHook;

const useSqlite = (): HookResult => {
  const [db, setDb] = useState<SQLiteDBConnection>();
  const [error, setError] = useState<any>();
  const [sqlite, setSqlite] = useState<SQLiteConnection>();
  const [isOpen, setIsOpen] = useState(false);
  sqlitehook = useSQLite();
  console.log(`$$$ in App sqlite.isAvailable  ${sqlitehook.isAvailable} $$$`);

  useEffect(() => {
    const init = async () => {
      await applyPolyfills();
      jeepSqlite(window);
      const platform = Capacitor.getPlatform();
      const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);

      try {
        if (platform === "web") {
          const jeepEl = document.createElement("jeep-sqlite");
          document.body.appendChild(jeepEl);
          await customElements.whenDefined('jeep-sqlite');
          await sqlite.initWebStore();
        }

        const ret = await sqlite.checkConnectionsConsistency();
        const isConn = (await sqlite.isConnection("db_ionicble", false)).result;
        let dbConnection: SQLiteDBConnection;

        if (ret.result && isConn) {
          dbConnection = await sqlite.retrieveConnection("db_ionicble", false);
        } else {
          dbConnection = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
        }
        setDb(dbConnection);
        setSqlite(sqlite);
        setIsOpen(true);
      } catch (err) {
        setError(err);
      }
    };

    init();
  }, []);

  return { db, error, sqlite, isOpen  };
};

export default useSqlite;