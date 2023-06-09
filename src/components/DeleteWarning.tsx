import React, {useEffect, useState} from 'react';
import { IonAlert } from '@ionic/react';
import { App } from '@capacitor/app';

const DeleteWarning = (props:any) => {
   const [showpopupp, setpopup]=useState(false);
   const [isMounted, setIsMounted] = useState(true);
   useEffect(() => {
      if (isMounted) {
        setpopup(true)
      }

    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);


  App.addListener('backButton', ({ canGoBack }) => {
    if(canGoBack){
      console.log('Delete Warning page');
      props.toggleDelete();
    } 
  });

    return (
        <>
           <IonAlert
           isOpen={showpopupp}
           header="Confirm delete"
           message={`Are you sure you want to delete this design?`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: ()=>{props.toggleDelete();},
          },
          {
            text: 'Yes',
            role: 'confirm',
            handler: props.deleteCards
          },
        ]}
        onDidDismiss={()=>setpopup(false)}
      ></IonAlert>

        </>
    );

}

export { DeleteWarning };