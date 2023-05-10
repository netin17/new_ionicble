import React, { useContext } from 'react';
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
import app from '../App.module.css';

const Titlebar  = (props:any) => {
    let history = useHistory();
    const {isTitleInput, setTitleInput}:any = useContext(CanvasStore)
    const {isCanvasDesign, setCanvasDesign}:any = useContext(CanvasStore);
    const handleClick = () => {
        props.toggleCancel();
        /*history.goBack();
        setCanvasDesign(null);*/
    }
    const handleInput = (event:any) => {
        setTitleInput(event.target.value)
    }
    return (
        <>
            <IonToolbar id={drawing.pageTitleContainer} className={app.pageTitleContainer} color="primary">   
                <IonTitle>
                    Design Editor
                </IonTitle>
                <IonButtons slot="end">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
            </IonToolbar>

            <IonToolbar color="tertiary">
                <IonItem>
                    <IonLabel position="floating">Title:</IonLabel>
                    <IonInput
                        className={drawing.titleInput}
                        type="text"
                        onIonChange={handleInput}
                        placeholder="Enter Title"
                        value={isTitleInput}
                        color="tertiary"
                    />
                </IonItem>
            </IonToolbar>
        </>
    );
}

export { Titlebar };