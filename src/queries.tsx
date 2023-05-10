import { useEffect, useState } from 'react';
import useSqlite from './database';

export const SqllileQueries = () => {
  const { db } = useSqlite();
 const [isopen, setOpen]=useState(false)
  const initialize = async (): Promise<void> => {
    console.log('Entering initialize');
    try {
        console.log(db)
      if (db) {
        await db.open();
        setOpen(true)
        console.log("opened")
      }
      return;
    } catch (err) {
      console.log(`Error: ${err}`);
      return;
    }
  };

  // Call initialize function when the component mounts
  useEffect(() => {
    if (db) {
      initialize();
    }
  }, [db]);

  const insertCategory = async (name: string) => {
    console.log("SDfsadsadaasdasdadsfsdf")
    if (db) {
        console.log("SDfdsfsdf")
      await db.run('INSERT INTO catagories (name) VALUES (?)', [name]);
    //   let res: any = await db.query("SELECT * FROM catagories");
    //   console.log(res.values);
    }
  }; 

  const getCategories = async () => {
    if (db) {
        console.log("gjgjghjghjghjgjg")
        const qValues : any= await db.query('SELECT * FROM catagories');
        return qValues?.values
    } 
  };

  return {
    initialize,
    insertCategory,
    getCategories,
    isopen
  };
};