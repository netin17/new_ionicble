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
    console.log(db)
    if (db) {
      initialize();
    }
  }, [db]);

  const insertCategory = async (name: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (db) {
          db.isDBOpen().then(async (result) => {
            console.log(result, "result");
            if (result && result.result) {
              await db.run('INSERT INTO catagories (name) VALUES (?)', [name]);
              const qValues: any = await db.query('SELECT * FROM catagories');
              console.log(qValues?.values);
              db.close();
              resolve(qValues?.values);
            } else {
              await db.open();
              await db.run('INSERT INTO catagories (name) VALUES (?)', [name]);
              const qValues: any = await db.query('SELECT * FROM catagories');
              console.log(qValues?.values);
              db.close();
              resolve(qValues?.values);
            }
          });
        } else {
          reject("Database is not available");
        }
      } catch (error) {
        reject(error);
      }
    });
  };


  const getCategories = async (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (db) {
          db.isDBOpen().then(async (result) => {
            console.log(result, "result");
            if (result && result.result) {
             
              const qValues : any= await db.query('SELECT * FROM catagories');
              db.close();
              resolve(qValues?.values);
              return qValues?.values;
  
            } else {
              await db.open();
              const qValues : any= await db.query('SELECT * FROM catagories');
              db.close();
              resolve(qValues?.values);
              return qValues?.values;
             
            }
          });
        } else {
          reject("Database is not available");
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const saveCanvas = async (canvasparams: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (db) {
          db.isDBOpen().then(async (result) => {
            console.log(result, "result");
            if (result && result.result) {
              await db.run('INSERT INTO drawing (name,canvasColor,canvasHeight,canvasWidth,liked,designId,designJson,thumbnail,categories) VALUES (?,?,?,?,?,?,?,?,?)', [canvasparams?.name, canvasparams?.canvasColor, canvasparams?.canvasHeight, canvasparams?.canvasWidth, canvasparams?.liked, canvasparams?.designId, canvasparams?.designJson, canvasparams?.thumbnail, canvasparams?.categories]);
              const qValues: any = await db.query('SELECT * FROM drawing');
              console.log(qValues?.values);
              db.close();
              resolve(qValues?.values);
            } else {
              await db.open();
              await db.run('INSERT INTO drawing (name,canvasColor,canvasHeight,canvasWidth,liked,designId,designJson,thumbnail,categories) VALUES (?,?,?,?,?,?,?,?,?)', [canvasparams?.name, canvasparams?.canvasColor, canvasparams?.canvasHeight, canvasparams?.canvasWidth, canvasparams?.liked, canvasparams?.designId, canvasparams?.designJson, canvasparams?.thumbnail, canvasparams?.categories]);
              const qValues: any = await db.query('SELECT * FROM drawing');
              console.log(qValues?.values);
              db.close();
              resolve(qValues?.values);
            }
          });
        } else {
          reject("Database is not available");
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateCanvas = async (id:any, canvasparams:any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (db) {
          db.isDBOpen().then(async (result) => {
            console.log(result, "result");
            if (result && result.result) {
             
              let data = [canvasparams?.name, canvasparams?.canvasColor, canvasparams?.canvasHeight, canvasparams?.canvasWidth, canvasparams?.liked, canvasparams?.designId, canvasparams?.designJson, canvasparams?.thumbnail, canvasparams?.categories];
              await db.run(`UPDATE drawing SET name = ?, canvasColor = ?, canvasHeight = ?, canvasWidth = ?, liked = ?, designId = ?, designJson = ?, thumbnail = ?, categories = ? WHERE id = ${id}`, data);
              
              const qValues: any = await db.query("SELECT * FROM drawing WHERE id = ?",[id]);
              console.log(qValues?.values);
              db.close();
              resolve(qValues?.values);
            } else {
              await db.open();           
              let data = [canvasparams?.name, canvasparams?.canvasColor, canvasparams?.canvasHeight, canvasparams?.canvasWidth, canvasparams?.liked, canvasparams?.designId, canvasparams?.designJson, canvasparams?.thumbnail, canvasparams?.categories];
              await db.run(`UPDATE drawing SET name = ?, canvasColor = ?, canvasHeight = ?, canvasWidth = ?, liked = ?, designId = ?, designJson = ?, thumbnail = ?, categories = ? WHERE id = ${id}`, data);
              
              const qValues: any = await db.query("SELECT * FROM drawing WHERE id = ?",[id]);
              console.log(qValues?.values);
              db.close();
              resolve(qValues?.values);           
            }
          });
        } else {
          reject("Database is not available");
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const LikeUnlikeCanvas = async (id:any, status:any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (db) {
        db.isDBOpen().then(async (result) => {
          console.log(result, "result");
          if (result && result.result) {
           
            let data = [status];
            await db.run(`UPDATE drawing SET liked = ? WHERE id = ${id}`, data);
            const qValues: any = await db.query("SELECT * FROM drawing WHERE id = ?",[id]);
            console.log(qValues?.values);
            db.close();
            resolve(qValues?.values);
          } else {
            await db.open();           
            let data = [status];
            await db.run(`UPDATE drawing SET liked = ? WHERE id = ${id}`, data);
            const qValues: any = await db.query("SELECT * FROM drawing WHERE id = ?",[id]);
            console.log(qValues?.values);
            db.close();
            resolve(qValues?.values);           
          }
        });
      } else {
        reject("Database is not available");
      }
    } catch (error) {
      reject(error);
    }
  });
};

  const getCanvases = async (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (db) {
          db.isDBOpen().then(async (result) => {
            console.log(result, "result");
            if (result && result.result) {
             
              const qValues : any= await db.query('SELECT * FROM drawing'); 
              db.close();
              resolve(qValues?.values);
              return qValues?.values;
  
            } else {
              await db.open();
              const qValues : any= await db.query('SELECT * FROM drawing');
              db.close();
              resolve(qValues?.values);
              return qValues?.values;
             
            }
          });
        } else {
          reject("Database is not available");
        }
      } catch (error) {
        reject(error);
      }
    });
  };

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

        var qValues : any= await db.query("SELECT * FROM drawing WHERE categories IN ?", [categories]);
        

      }
      // await db.close();
      // setOpen(false)
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