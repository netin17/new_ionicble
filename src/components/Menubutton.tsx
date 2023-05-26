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
    const {isTitleInput, setTitleInput}:any = useContext(CanvasStore);
    const {isIdInput, setIdInput}: any = useContext(CanvasStore);
    const {setColorModeIcon}:any = useContext(CanvasStore);
    const [present] = useIonToast();

    const { db } = useSqlite();
    const {updateCanvas,saveCanvas, isopen } = SqllileQueries();
 
    

    const storeCanvas = async () => {
        if (isCanvasDesign) {
            let designJson: any = JSON.stringify(canvas.toJSON());
            let thumbnail: any = canvas.toDataURL();
            let designId: any = Math.random();
            let canvasColor: any = canvas.backgroundColor;
            let canvasWidth:any = canvas.width;
            let canvasHeight:any = canvas.height;
            let id:any = isIdInput;
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
            //let tempArray: any = [];
            if(db){
                if(typeof id != 'undefined'){

                    await props?.updateCanvas(id,canvasDesign).then((result:any)=>{
                                        
                        history.push({pathname:'/tab4', state:{data:result}});
    
                       // history.push({pathname:'/tab4'});
                    });   

                    
                }
                               
            }

        } else {
            let designJson: any = JSON.stringify(canvas.toJSON());
            let thumbnail: any = canvas.toDataURL();
            let designId: any = Math.random();
            let canvasColor: any = canvas.backgroundColor;
            let canvasWidth:any = canvas.width;
            let canvasHeight:any = canvas.height;
           
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
            //let tempArray: any = [];
            if(db){

                await props?.saveCanvas(canvasDesign).then((result:any)=>{
                                        
                    history.push({pathname:'/tab4', state:{data:result}});

                });                          
                   
            }
           
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
              
            </IonToolbar>
        </>
    );
}

export { Menubutton };