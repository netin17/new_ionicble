import { Storage, Drivers  } from "@ionic/storage";




export  const storage   = new Storage  ({
    name: 'ionicdb',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});


storage.create();


