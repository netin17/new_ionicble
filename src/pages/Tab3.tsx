import React, {useContext } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, IonTitle, 
  IonToolbar, 
  IonList,
  IonImg,
  IonLabel, } from '@ionic/react';
import {  Link  } from 'react-router-dom';
import sizes from './Sizes.module.css';
import {CanvasStore} from "../Store/CanvasStore";
type Item = {
  src: string;
  text: string;
  width: string;
  height:string;
  type:string;
};


const items: Item[] = [
  { src: '../assets/images/canvasPortrait.png', text: '4.2in - portrait' , width: '300' ,height:'400' ,type:'portrait' } ,
  { src: '../assets/images/canvasLandScape.png', text: '4.2in - landscape' ,width: '400' ,height:'300' ,type:'landscape'} ,
  { src: '../assets/images/canvasExpend.png', text: '7.5in' , width: '800' ,height:'206' ,type:'expend' } ,

];
const Tab3: React.FC = () => {
  const { setDimension,setSelectedSize }:any = useContext(CanvasStore);
    const { isTitleInput ,setTitleInput  }:any = useContext(CanvasStore)
    const { setCanvasDesign }: any = useContext(CanvasStore);
    const { setColorModeIcon}:any = useContext(CanvasStore);
    return (
      <IonPage>
          <IonToolbar className={sizes.sizebg} >
              <IonTitle className ={sizes.sizeTitle}>SELECT YOUR DISPLAY SIZE:</IonTitle>
          </IonToolbar>

          <IonContent className={sizes.overHidden}>
              <IonList lines="none" className={sizes.handleSizesBox}>
                  {items.map((image, i) => (

                      <div className={sizes.handleItem} key={i}  >
                          <Link to="/drawing"  className={sizes.linkBox}  onClick={()=>{
                              setTitleInput("")
                              setCanvasDesign("")
                              setColorModeIcon("dark_mode")
                              setDimension(
                                  {
                                      width:image.width,
                                      height: image.height,
                                      type: image.type
                                  }
                              );
                              setSelectedSize(
                                  {
                                      width:image.width,
                                      height: image.height,
                                      type: image.type
                                  }
                              );
                          }}      >

                              <IonImg src={image.src}  />
                              <IonLabel className ={sizes.boxTitle}  >{image.text}</IonLabel>
                          </Link>
                      </div>

                  ))}
              </IonList>
          </IonContent>
      </IonPage>
  );
};

export default Tab3;
