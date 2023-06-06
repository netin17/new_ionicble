import { useEffect, useState } from 'react';
//import useSqlite from './database';
import { sqlite } from './App';
import { SQLiteDBConnection} from 'react-sqlite-hook';


//const [isModalOpen, setIsModalOpen] = useState(false);


export const SqllileQueries = () => {
  
  const [isopen, setIsOpen] = useState(true);
 
  const insertCategory = async (name: string): Promise<any> => {

    try {
      console.log('insert categoty step 1')
      const ret = await sqlite.checkConnectionsConsistency();
      let db: SQLiteDBConnection;
      if(ret.result){
        db = await sqlite.retrieveConnection("db_ionicble", false);
      }else{

        db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
      }
      
      console.log('insert categoty step 2',db)
      setIsOpen(true)
      console.log('insert categoty step 3',db)
      await db.open();
      console.log('insert categoty step 4',db)
      await db.run('INSERT INTO catagories (name) VALUES (?)', [name]);
      const qValues: any = await db.query('SELECT * FROM catagories');
      console.log('insert categoty step 5',qValues)
      
      await db.close();
      //sqlite.closeConnection("db_ionicble");
      return ;
    }
    catch (err) {
      console.log(`Error: ${err}`);
      return ;
    }
  };

  const getCategories = async (): Promise<any> => {

    try {
      const ret = await sqlite.checkConnectionsConsistency();
      let db: SQLiteDBConnection;
      if(ret.result){
        db = await sqlite.retrieveConnection("db_ionicble", false);
      }else{
        db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
      }

      if(db){
        await db.open();
        const qValues : any= await db.query('SELECT * FROM catagories');
        console.log(qValues);
        return qValues;
        
        //await db.close();
        // sqlite.closeConnection("db_ionicble");
        // return qValues;
      }else{

        console.log('db not  available....');
      }
    
      
      setIsOpen(true)
      
      return ;
    }
    catch (err) {
      console.log(`Error: ${err}`);
      return err;
    }
  };

  const getCanvases = async (): Promise<any> => {

    try {
      const ret = await sqlite.checkConnectionsConsistency();
      let db: SQLiteDBConnection;

      if(ret.result){
        db = await sqlite.retrieveConnection("db_ionicble", false);
        await db.open();
        const qValues : any= await db.query('SELECT * FROM drawing');
        console.log(qValues);
        return qValues;
       
        //await db.close();
        //await sqlite.closeConnection("db_ionicble");
      }
      
      if(!ret.result){
        sqlite.closeConnection("db_ionicble");
        db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
        await db.open();
        const qValues : any= await db.query('SELECT * FROM drawing');
        console.log(qValues);
        return qValues;
      }
      
      setIsOpen(true)      
      return ;
    }
    catch (err) {
      console.log(`Error: ${err}`);

      return err;
    }
  };

  const saveCanvas = async (canvasparams: any): Promise<any> => {

    console.log('save Canvas::')
    try {
       const ret = await sqlite.checkConnectionsConsistency();
       let db: SQLiteDBConnection;
      if(ret.result){
        db = await sqlite.retrieveConnection("db_ionicble", false);
      }else{

        db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
      }

      console.log('dababase connection at save Canvas::',db)
      setIsOpen(true)
      await db.open();
      await db.run('INSERT INTO drawing (name,canvasColor,canvasHeight,canvasWidth,liked,designId,designJson,thumbnail,categories) VALUES (?,?,?,?,?,?,?,?,?)', [canvasparams?.name, canvasparams?.canvasColor, canvasparams?.canvasHeight, canvasparams?.canvasWidth, canvasparams?.liked, canvasparams?.designId, canvasparams?.designJson, canvasparams?.thumbnail, canvasparams?.categories]);
      const qValues: any = await db.query('SELECT * FROM drawing');
      console.log('dababase connection at save Canvas::',qValues)
      await db.close();
      //sqlite.closeConnection("db_ionicble");
      return qValues;
    }
    catch (err) {
      console.log(`Error: ${err}`);
      return err;
    }
  };


  const updateCanvas = async (id:any, canvasparams:any): Promise<any> => {

    try {
       const ret = await sqlite.checkConnectionsConsistency();
       let db: SQLiteDBConnection;
      if(ret.result){
        db = await sqlite.retrieveConnection("db_ionicble", false);
      }else{

        db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
      }
      setIsOpen(true)
      await db.open();
      let data = [canvasparams?.name, canvasparams?.canvasColor, canvasparams?.canvasHeight, canvasparams?.canvasWidth, canvasparams?.liked, canvasparams?.designId, canvasparams?.designJson, canvasparams?.thumbnail, canvasparams?.categories];
      await db.run(`UPDATE drawing SET name = ?, canvasColor = ?, canvasHeight = ?, canvasWidth = ?, liked = ?, designId = ?, designJson = ?, thumbnail = ?, categories = ? WHERE id = ${id}`, data);
      
      const qValues: any = await db.query("SELECT * FROM drawing WHERE id = ?",[id]);
      
      await db.close();
      //sqlite.closeConnection("db_ionicble");
      return qValues;
    }
    catch (err) {
      console.log(`Error: ${err}`);
      return err;
    }
  };


const LikeUnlikeCanvas = async (id:any, status:any): Promise<any> => {

  try {
    const ret = await sqlite.checkConnectionsConsistency();
    let db: SQLiteDBConnection;
    if(ret.result){
      db = await sqlite.retrieveConnection("db_ionicble", false);
    }else{

      db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
    }

    setIsOpen(true)
    await db.open();
    let data = [status];
    await db.run(`UPDATE drawing SET liked = ? WHERE id = ${id}`, data);
    const qValues: any = await db.query("SELECT * FROM drawing WHERE id = ?",[id]);
    
    await db.close();
    //sqlite.closeConnection("db_ionicble");
    return qValues;
  }
  catch (err) {
    console.log(`Error: ${err}`);
    return err;
  }
};


const deleteCanvas = async (id:any): Promise<any> => {

  try {
     const ret = await sqlite.checkConnectionsConsistency();
     let db: SQLiteDBConnection;
      if(ret.result){
        db = await sqlite.retrieveConnection("db_ionicble", false);
      }else{
        db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
      }

    setIsOpen(true)
    await db.open();
    await db.run(`Delete FROM drawing WHERE id = ${id}`);
    let qValuess: any =[]
    qValuess = await db.query("SELECT * FROM drawing"); 
    await db.close();
    return qValuess; 
    
    //sqlite.closeConnection("db_ionicble");
    
  }
  catch (err) {
    console.log(`Error: ${err}`);
    return err;
  }
};

  const getCanvasesByCategories = async (categories: string): Promise<any> => {

    try {
       const ret = await sqlite.checkConnectionsConsistency();
       let db: SQLiteDBConnection;
      if(ret.result){
        db = await sqlite.retrieveConnection("db_ionicble", false);
      }else{

        db = await sqlite.createConnection("db_ionicble", false, "no-encryption", 1, false);
      }

      setIsOpen(true)
      await db.open();
     
      if(categories === 'all'){

        var qValues : any= await db.query("SELECT * FROM drawing");

      }else if(categories === 'favorites'){

        var qValues : any= await db.query("SELECT * FROM drawing WHERE liked= ?", [1]);

      }else{

        var qValues : any= await db.query("SELECT * FROM drawing WHERE categories IN ?", [categories]);
        

      }

      await db.close();
      //sqlite.closeConnection("db_ionicble");
      return qValues;
    }
    catch (err) {
      console.log(`Error: ${err}`);
      return err;
    }
  };



  return {
    //initialize,
    insertCategory,
    getCategories,
    saveCanvas,
    getCanvases,
    getCanvasesByCategories,
    updateCanvas,
    LikeUnlikeCanvas,
    deleteCanvas,
    isopen
  };
};