import React, { useContext } from 'react';
import { useIonViewWillLeave } from '@ionic/react';
import {
    IonInput,
    IonTitle,
    IonLabel,
    IonItem,
    IonToolbar,
    IonButtons,
    IonMenuButton,
} from '@ionic/react';
import { useHistory } from "react-router-dom";
import { CanvasStore } from "../Store/CanvasStore";
import drawing from '../pages/Drawing.module.css';
//import app from '../App.module.css';
import { App } from '@capacitor/app';

const Titlebar  = (props:any) => {
    let history = useHistory();
    const {isTitleInput, setTitleInput}:any = useContext(CanvasStore);
    const {isCanvasDesign, setCanvasDesign}:any = useContext(CanvasStore);

    const handleClick = () => {
        props.toggleCancel();       
    }

    useIonViewWillLeave(() => {
        // Save the input value or perform necessary operations
        handleKeyboardHide();
      });

    App.addListener('backButton', ({ canGoBack }) => {
        if(canGoBack){
            console.log('Titlebar page');
            props.toggleCancel();
            
        } 
    });
   
    const handleInput = (event:any) => {
        setTitleInput(event.target.value)
    }

    const handleSave = () => {
        console.log('Input Textttt:', isTitleInput);
        // Perform save operation using inputText
      };

    // Custom event listener for back button click
    const handleBackButtonClick = () => {
        handleSave();
    };

    // Attach the custom event listener to the back button
    document.addEventListener('ionBackButton', handleBackButtonClick);

     
    const handleKeyboardHide = () => {
        // Save the input value when the keyboard is hidden
        var setTitle = (document.getElementById('inputTitle') as HTMLInputElement).value; 
        setTitleInput(setTitle);        
    };

    return (
        <>
            {/* <IonToolbar id={drawing.pageTitleContainer} className={app.pageTitleContainer} color="primary">   
                <IonTitle>
                    Design Editor
                </IonTitle>
                <IonButtons slot="end">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
            </IonToolbar> */}

            <IonToolbar color="tertiary">
                <IonItem>
                    <IonLabel position="floating">Title:</IonLabel>
                    <IonInput
                        className={drawing.titleInput}
                        type="text"
                        onIonChange={(e) => setTitleInput(e.detail.value)}
                        placeholder="Enter Title"
                        onIonBlur={() => {handleKeyboardHide()}}
                        value={isTitleInput}
                        color="tertiary"
                        id="inputTitle"
                    />
                </IonItem>
            </IonToolbar>
        </>
    );
}

export { Titlebar };