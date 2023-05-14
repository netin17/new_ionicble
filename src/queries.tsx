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
    if (db) {
      await db.run('INSERT INTO catagories (name) VALUES (?)', [name]);
    }
  }; 

  const getCategories = async () => {
    if (db) {
        const qValues : any= await db.query('SELECT * FROM catagories');
        return qValues?.values
    } 
  };

  const saveCanvas = async (canvasparams:any) => {
    console.log("DSfsfs")
    if (db) {
      await db.run('INSERT INTO drawing (name,canvasColor,canvasHeight,canvasWidth,liked,designId,designJson,thumbnail,categories) VALUES (?,?,?,?,?,?,?,?,?)',
       [
        canvasparams?.name,
        canvasparams?.canvasColor,
        canvasparams?.canvasHeight,
        canvasparams?.canvasWidth,
        canvasparams?.liked,
        canvasparams?.designId,
        canvasparams?.designJson,
        canvasparams?.thumbnail,
        canvasparams?.categories
      ]
       );
    } 
  };

  const getCanvases = async()=>{
    if (db) {
      const qValues : any= await db.query('SELECT * FROM drawing');
      return qValues?.values
  } 
  }

  return {
    initialize,
    insertCategory,
    getCategories,
    saveCanvas,
    getCanvases,
    isopen
  };
};