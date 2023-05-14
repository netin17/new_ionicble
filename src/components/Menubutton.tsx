import React, { useContext,useEffect } from 'react';
import { useIonToast, IonSelect, IonSelectOption, IonToolbar, IonButton } from '@ionic/react';
import { CanvasStore } from "../Store/CanvasStore";
import { useHistory } from "react-router-dom";
// import { storage } from "../Hooks/useStorage";
import drawing from '../pages/Drawing.module.css';
import { SqllileQueries } from '../queries';
import useSqlite from '../database';
const Menubutton = (props:any) => {

    const {canvas, selectedSize}:any = useContext(CanvasStore);
    const {isCanvasDesign, setCanvasDesign}:any = useContext(CanvasStore);
    let history = useHistory();
    const {isTitleInput, setTitleInput}:any = useContext(CanvasStore)
    const {setColorModeIcon}:any = useContext(CanvasStore);
    const [present] = useIonToast();

    const { db } = useSqlite();
    const {saveCanvas, isopen } = SqllileQueries();

    useEffect(() => {
        const init = async () => {
          try {
            console.log(isopen)
            }catch (err) {
            console.log(err)
          }
        };
        init();
      }, [isopen])

    const storeCanvas = async () => {
console.log(canvas.toJSON())
        if (isCanvasDesign) {

            // let getID = isCanvasDesign.designId;

            // let localArray: [] = JSON.parse(await storage.get('myDesign') || '[]');
            // localArray.forEach((obj: any) => {
            //     if (obj.designId == getID) {
            //         obj.designJson = JSON.stringify(canvas.toJSON());
            //         obj.thumbnail = canvas.toDataURL();
            //         obj.isTitleInput = isTitleInput;
            //     }
            // })
            // setCanvasDesign(null);

            // await storage.set('myDesign', JSON.stringify(localArray));
            // canvas.renderAll();
            // history.go(-1);

        } else {
            let designJson: any = JSON.stringify(canvas.toJSON());
            let thumbnail: any = canvas.toDataURL();
            let designId: any = Math.random();
            let canvasColor: any = canvas.backgroundColor;
            let canvasWidth:any = selectedSize.width;
            let canvasHeight:any = selectedSize.height;
            let canvasDesign = {
                designJson,
                thumbnail,
                designId,
                name: isTitleInput,
                liked:null,
                canvasColor,
                canvasWidth,
                canvasHeight,
                categories: props?.selectedCategories.toString()
            }

            let tempArray: any = [];
            console.log(isopen)
            if(db){
                saveCanvas(canvasDesign)
                console.log(canvasDesign)
            }
           
            // if (await storage.get('myDesign')) {
            //     let getLocalArray: any = JSON.parse(await storage.get('myDesign') || '[]');
            //     tempArray.push(...getLocalArray);
            // }

            // tempArray.push(canvasDesign);

            // await storage.set('myDesign', JSON.stringify(tempArray));
            // canvas.renderAll();
            // history.go(-2);
        }
        // presentToast('top','Design saved successfully')
        // canvas.clearHistory();
    }
    const presentToast = (position:any, message:any) => {
        present({
            message: message,
            duration: 1500,
            position: position
        });
    };

    return (
        <>
            <IonToolbar className={drawing.cancelSaveContainer}>
                <IonButton
                    id={drawing.cancel}
                    className={drawing.menuButton}
                    onClick={props.toggleCancel}>
                    Cancel
                </IonButton>
                <IonButton
                    id={drawing.save}
                    className={drawing.menuButton}
                    onClick={() => {storeCanvas()}}>
                    Save
                </IonButton>
                {/*
                <button className={drawing.send}>
                    <span className={drawing.materialSymbol}>cast</span>
                </button>
                */}
            </IonToolbar>
        </>
    );
}

export { Menubutton };