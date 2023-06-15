import React, { useEffect, useState } from 'react';
import { IonAlert } from '@ionic/react';
// import cancelwarning from './CancelWarning.module.css'
import { App } from '@capacitor/app';

const CancelWarning = (props:any) => {
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
        console.log('Cancel Warning page');        
      } 
    });



    return (
        <>
         <>
           <IonAlert
           isOpen={showpopupp}
           header="Confirm cancel"
           message={`Are you sure want to cancel and discard your changes?`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: ()=>{props.toggleCancel()},
          },
          {
            text: 'Yes',
            role: 'confirm',
            handler: props.yesCancel
          },
        ]}
        onDidDismiss={()=>setpopup(false)}
      ></IonAlert>

        </>
            {/* <IonContent className={cancelwarning.cancelBg} >
                <IonGrid>

                    <IonRow className={cancelwarning.cancelRowOne} >
                        <IonCol size="9"   >
                            <h2 className={cancelwarning.headWarning }>
                                DO YOU REALLY WANT TO CANCEL AND DISCARD YOUR CHANGES?</h2>
                        </IonCol>
                    </IonRow>

                    <IonRow className={cancelwarning.cancelRowTwo} >
                        <IonCol size="6">
                            <IonButton  className={cancelwarning.btnCanceNo } onClick={props.toggleCancel} >NO , I WANT TO SAVE FIRST</IonButton>
                        </IonCol>
                    </IonRow>

                    <IonRow className={cancelwarning.cancelRowThree} >
                        <IonCol size="3">
                           <IonButton className={cancelwarning.btnCanceYes } onClick={props.yesCancel } >YES</IonButton>
                        </IonCol>
                    </IonRow>

                </IonGrid>
            </IonContent> */}

        </>
    );

}

export { CancelWarning };