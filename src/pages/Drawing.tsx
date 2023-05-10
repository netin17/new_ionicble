import React, {useState,useContext, useRef, useEffect} from 'react';
import { fabric } from 'fabric';
import { 
  IonContent,
   IonHeader,
    IonButton,
    useIonToast,
     IonPage,
      IonTitle,
       IonToolbar,
        IonRouterOutlet,
         IonPopover,
          IonButtons,
          IonIcon  } from '@ionic/react';
import { ellipsisVertical} from 'ionicons/icons';
import Categories from '../components/Categories';
import ExploreContainer from '../components/ExploreContainer';
import { Toolbar } from "../components/Toolbar";
import {
  TransformWrapper,
  TransformComponent ,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useHistory } from "react-router-dom";
import drawing from './Drawing.module.css';
import './Drawing.css';
import 'fabric-history';
import * as _ from 'lodash';
import { CanvasStore } from "../Store/CanvasStore";
declare global {
  interface Window {
      canvas: any;

  }
}

interface AppContextInterface {
  name: string;
  author: string;
  url: string;
  isTextToolbar: any;
  isImageToolbar: any;
  isControls: any;
  pausePanning:any;
  PinchToZoom:any;
}

type Props = {
  style?: any;
  className?: any;
  contentStyle?: React.CSSProperties;
};

const Drawing: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { dimension, setCanvas }:any = useContext(CanvasStore);
    const { canvas }:any = useContext(CanvasStore);
  const { isCanvasDesign , setShowButtons, showButtons  }:any = useContext(CanvasStore);
  const [disablePanning, setDisablePanning]: any = useState(false);
  const [cancelToggle, setCancelToggle]: any = useState(false)
  const [tempCanvas, setTempCanvas]: any = useState();
  const [present] = useIonToast();
  let history = useHistory();
  const ref:any = useRef<ReactZoomPanPinchRef | null>(null);


  useEffect(() => {

    initCanvas();


}, [cancelToggle]);

const initCanvas = () => {

  let canvasWidth = parseInt(dimension.width);
  let canvasHeight= 0;
  if(isCanvasDesign) {
      console.log(isCanvasDesign);
      canvasWidth=parseInt(isCanvasDesign.canvasWidth);
      canvasHeight = canvasWidth * (isCanvasDesign.canvasHeight/isCanvasDesign.canvasWidth);
  } else {
      canvasHeight = canvasWidth * (dimension.height/dimension.width);
  }

  console.log(dimension)
  console.log(canvasWidth, canvasHeight)
  let fabricCanvas:any = new fabric.Canvas('canvas', {
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor : "#fff" ,
          allowTouchScrolling: true
      }
  );

  window.canvas =  fabricCanvas;

  setCanvas(fabricCanvas);

  if(isCanvasDesign?.designJson && !tempCanvas)
  {

      fabricCanvas.loadFromJSON(isCanvasDesign?.designJson, fabricCanvas.renderAll.bind(fabricCanvas), ()=>{
      });
  }
  else if(tempCanvas?.designJson)
  {

      fabricCanvas.loadFromJSON(tempCanvas?.designJson, fabricCanvas.renderAll.bind(fabricCanvas), ()=>{
      });
  }
  fabricCanvas.historyUndo = [];
}


document.addEventListener('ionBackButton', (ev:any) => {
  ev.detail.register(10, () => {
      if(window.location.href.includes('drawing')) {
          toggleCancel();
      } else {
          history.go(-1);
      }

  });
});

const toggleCancel = () => {

  let designJson: any = JSON.stringify(canvas.toJSON());
  let thumbnail: any = canvas.toDataURL();
  let designId: any ;
  if(isCanvasDesign?.designJson)
  {
      if(_.isEqual(JSON.parse(isCanvasDesign.designJson), JSON.parse(designJson)) === true) {
          history.go(-1);
          return;
      }
      designId= isCanvasDesign?.designId;
  }
  else {
      designId= Math.random();
  }

  let canvasDesign = {
      designJson,
      thumbnail,
      designId,
  }
  setTempCanvas(canvasDesign);
  setCancelToggle(!cancelToggle);

}


  
  const handleDeactivateObjClick = (event:any) => {
    console.log(event)
    if(event.target.className === 'Drawing_HandleCanvas__RjfdC') {
        setShowButtons(true);
        canvas.discardActiveObject()
        canvas.renderAll()
    }
}

const presentToast = (position:any, message:any) => {
  present({
    message: message,
    duration: 1500,
    position: position
  });
};

  const save_canvas=()=>{
    console.log(selectedCategories)
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Drawing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Drawing</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonToolbar>
        <IonButtons slot="primary">
          <IonButton id="category-trigger">
            <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonPopover trigger="category-trigger" triggerAction="click">
        <IonContent class="ion-padding">
          <Categories setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories} />
        </IonContent>
      </IonPopover>
        {showButtons && <Toolbar />}
        <div className={drawing.canvas} onClick={handleDeactivateObjClick}>
                            <TransformWrapper
                                ref={ref}
                                minScale={0.25}
                                maxScale={7}
                                doubleClick={{disabled: true}}
                                pinch={{disabled: false }}
                                panning={{disabled: disablePanning}}
                            >
                                <TransformComponent>
                                    <canvas id="canvas" />
                                </TransformComponent>

                            </TransformWrapper>
                        </div>
      <IonButton onClick={save_canvas}>save</IonButton>
      </IonContent>
      <IonRouterOutlet hidden />
    </IonPage>
  );
};

export default Drawing;
