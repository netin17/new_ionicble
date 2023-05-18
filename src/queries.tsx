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
      if(!isopen){
        await db.open();
      }
      await db.run('INSERT INTO catagories (name) VALUES (?)', [name]);
      await db.close();
      setOpen(false)
    }
  }; 

  const getCategories = async () => {
    if (db) {   
      if(!isopen){
        await db.open();
      }  
        const qValues : any= await db.query('SELECT * FROM catagories'); 
        await db.close();
        setOpen(false)    
        return qValues?.values;        
    } 
  };

  const saveCanvas = async (canvasparams:any) => {
    if (db) {
      
      await db.open();           
      await db.run('INSERT INTO drawing (name,canvasColor,canvasHeight,canvasWidth,liked,designId,designJson,thumbnail,categories) VALUES (?,?,?,?,?,?,?,?,?)',
      [ canvasparams?.name, canvasparams?.canvasColor, canvasparams?.canvasHeight, canvasparams?.canvasWidth, canvasparams?.liked, canvasparams?.designId, canvasparams?.designJson, canvasparams?.thumbnail, canvasparams?.categories]);
      await db.close();
      setOpen(false)
    
    } 
  };

  const updateCanvas = async (id:any, canvasparams:any) => {
    if (db) {
      if(!isopen){
        await db.open();
      } 
      let data = [canvasparams?.name, canvasparams?.canvasColor, canvasparams?.canvasHeight, canvasparams?.canvasWidth, canvasparams?.liked, canvasparams?.designId, canvasparams?.designJson, canvasparams?.thumbnail, canvasparams?.categories];
      await db.run(`UPDATE drawing SET name = ?, canvasColor = ?, canvasHeight = ?, canvasWidth = ?, liked = ?, designId = ?, designJson = ?, thumbnail = ?, categories = ? WHERE id = ${id}`, data);
      await db.close();
      setOpen(false)
    
    } 
  };

  const LikeUnlikeCanvas = async (id:any, status:any) => {
    if (db) {
      if(!isopen){
        await db.open();
      } 
      let data = [status];
      await db.run(`UPDATE drawing SET liked = ? WHERE id = ${id}`, data);
      await db.close();
      setOpen(false)
    
    } 
  };

  const getCanvases = async()=>{
    if (db) {
      if(!isopen){
        await db.open();
      }
      const qValues : any= await db.query('SELECT * FROM drawing');
      await db.close();
      setOpen(false)
      return qValues?.values
  } 
  }

  const getCanvasesByCategories = async( categories: string)=>{
    if (db) {
      if(!isopen){
        await db.open();
      }
      if(categories === 'all'){

        var qValues : any= await db.query("SELECT * FROM drawing");

      }else if(categories === 'favorites'){

        var qValues : any= await db.query("SELECT * FROM drawing WHERE liked= ?", [1]);

      }else{

        var qValues : any= await db.query("SELECT * FROM drawing WHERE categories= ?", [categories]);
        

      }
      await db.close();
      setOpen(false)
      return qValues?.values
      
  } 
  }

  return {
    initialize,
    insertCategory,
    getCategories,
    saveCanvas,
    getCanvases,
    getCanvasesByCategories,
    updateCanvas,
    LikeUnlikeCanvas,
    isopen
  };
};