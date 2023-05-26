import React, { useContext, useState, useRef, useEffect } from 'react';
import { trash, send, close } from 'ionicons/icons';
import {
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonButton,
        IonLabel,
        IonIcon,
        IonModal,
        IonButtons,
        IonItemSliding,
        IonItemOptions,
        IonItemOption,
        IonItem,
        IonHeader,
        IonContent,
        IonToolbar,
        IonTitle,
        useIonActionSheet,
        IonImg,
        IonChip,
        IonCardContent,
    } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import home from "../Home.module.css";
import app from "../App.module.css";
import { CanvasStore } from "../Store/CanvasStore";
import { BleClient, numbersToDataView, numberToUUID, textToDataView } from '@capacitor-community/bluetooth-le';
import { disconnect } from 'process';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial';
import ImageManipulator from '../Hooks/imageManipulation';
import { ProgressContext } from '../Hooks/ProgressContext';

import favoriteIcon from '../assets/icons/heart-rounded.svg';

import { SqllileQueries } from '../queries';
import useSqlite from '../database';
interface Category {
    id: number;
    name: string;
  }


const ThumbnailCards = ({ val, design, loadCanvas, deleteCard, categoryData}: any) => {
    const [isSaveBoxToggle, setSaveBoxToggle] = useState(false);
    const [present] = useIonActionSheet();
    //console.log(design)
    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);
    const canvasdesign = useRef<HTMLCanvasElement>(null);
    const printdesign = useRef<HTMLCanvasElement>(null);
    const [ progress, updateProgress ] = useState(0);
    const [ showloader, setloader ] = useState(false);
    const [ imageArray, setImageArray ] = useState<any>([]);

    const { db } = useSqlite();
    const {LikeUnlikeCanvas, isopen } = SqllileQueries();
   const [currentDesing, setcurrentDesing]: any = useState([]);
    const [Liked, setLiked]: any = useState(false);
    useEffect(() => {
        const init = async () => {
    
          try {
            console.log(isopen);
            if (isopen) {
              setcurrentDesing(design);
            }
          } catch (err) {
            console.log(err);
          }
        };
        init();
      }, [isopen]);
     
      const like_design=async(id:Number,status:Number)=>{
      
        let data = await LikeUnlikeCanvas(id, status);
        currentDesing.liked=data[0].liked;
        setcurrentDesing(currentDesing);
        setLiked(!Liked);
    
      }
   

    var epdArr:any,epdInd:any,palArr:any, curPal:any;
    var pxInd:any,stInd:any;
    var dispW,dispH;
    var xhReq,dispX;
    var rqPrf,rqMsg;




    const onWillDismiss =(ev: CustomEvent<OverlayEventDetail>)=>{
        console.log(ev.detail.role)
        // if (ev.detail.role === 'confirm') {

        // }
      }

    const convertImage = async(image: any) => {
        let array_buffer = _base64ToArrayBuffer(image);
    }

    const openactionsheet=(design:any) => {
        present({
            header: 'Actions',
            buttons: [
                {
                    text: 'Send to display',
                    handler: ()=> {
                        handleOpenModal();
                    },
                },
                {
                    text: 'Add to favorites',
                    handler: ()=> {
                       like_design(design.id, design.liked==1 ? 0 : 1);
                    },
                },
                {
                    text: 'Edit',
                    handler: ()=> {
                        
                        loadCanvas(design);
                    },
                },
                {
                    text: 'Duplicate',
                    handler: ()=> {
                        
                    },
                },
                {
                    text: 'Invert',
                    handler: ()=> {
                        
                    },
                },
                {
                    text: 'Share',
                    handler: ()=> {
                        
                    },
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: ()=> {
                        deleteCard(design)
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    data: {
                        action: 'cancel',
                    },
                },
            ],
        })
    }
    useEffect(()=>{

        const context = canvasdesign.current?.getContext('2d');
        draw(context)

        
    },[])
    const draw = (context:any) => {
        var imagebmp = new Image();
        imagebmp.src = design.thumbnail;
        imagebmp.onload = () => {
            // Set the canvas size to match the image size
    if (canvasdesign.current) {
        canvasdesign.current.width = imagebmp.width;
        canvasdesign.current.height = imagebmp.height;
    }

    // Draw the image to the canvas
    context.drawImage(imagebmp, 0, 0);

    // Rotate the canvas context by 60 degrees
    if(design.canvasHeight > design.canvasWidth){
        if (canvasdesign.current) {
    const temp = canvasdesign.current.width;
    canvasdesign.current.width = canvasdesign.current.height;
    canvasdesign.current.height = temp;

    // Rotate the canvas 90 degrees clockwise
    context.rotate(Math.PI / 2);

    // Draw the image to the canvas
    context.drawImage(imagebmp, 0, -canvasdesign.current.width);

    // Reset the canvas rotation
    context.rotate(-Math.PI / 2);
        }
    }
    
         }
        // Insert your canvas API code to draw an image
      };

    const handleOpenModal = () => {
        //console.log(canvasdesign.current?.width)
        //console.log(canvasdesign.current?.height)
        canvasdesign.current?.getContext('2d')?.rotate(Math.PI / 2);
        epdInd = 0;
        palArr = [[[0, 0, 0], [255, 255, 255]],
        [[0, 0, 0], [255, 255, 255], [127, 0, 0]],
        [[0, 0, 0], [255, 255, 255], [127, 127, 127]],
        [[0, 0, 0], [255, 255, 255], [127, 127, 127], [127, 0, 0]],
        [[0, 0, 0], [255, 255, 255]],
        [[0, 0, 0], [255, 255, 255], [220, 180, 0]],
        [[0, 0, 0]],
        [[0, 0, 0], [255, 255, 255], [0, 255, 0], [0, 0, 255], [255, 0, 0], [255, 255, 0], [255, 128, 0]]];
        epdArr = [[200, 200, 0], [200, 200, 3], [152, 152, 5],
        [122, 250, 0], [104, 212, 1], [104, 212, 5], [104, 212, 0],
        [176, 264, 0], [176, 264, 1],
        [128, 296, 0], [128, 296, 1], [128, 296, 5], [128, 296, 0],
        [400, 300, 0], [400, 300, 1], [400, 300, 5],
        [600, 448, 0], [600, 448, 1], [600, 448, 5],
        [640, 384, 0], [640, 384, 1], [640, 384, 5],
        [800, 480, 0], [800, 480, 1], [880, 528, 1],
        [600, 448, 7], [880, 528, 0], [280, 480, 0],
        [152, 296, 0], [648, 480, 1], [128, 296, 1],
        [200, 200, 1], [104, 214, 1], [128, 296, 0],
        [400, 300, 1], [152, 296, 1], [648, 480, 0],
        [640, 400, 7], [176, 264, 1], [122, 250, 0],
        [122, 250, 1], [240, 360, 0], [176, 264, 0]];
        procImg(false, false)
    };
    
    function procImg(isLvl:any,isRed:any){
        //console.log("process")
        var dX:any, dY:any, dW:any, dH:any, sW:any, sH:any;
        const printcanvas = printdesign.current;
        const printcontaxt= printcanvas?.getContext('2d');
        var palInd=epdArr[epdInd][2];
        if (isRed&&((palInd&1)==0)){
            alert('This white-black display');
            return;
        }
        if (!isRed)palInd=palInd&0xFE;
        curPal=palArr[palInd];
        sW=canvasdesign.current?.width;
        sH=canvasdesign.current?.height;
        dX=0;
        dY=0;
        dW=parseInt("400");
        dH=parseInt("300");
        if((dW<3)||(dH<3)){
            alert('Image is too small');
            return;
        }
        if(printcanvas){
            //console.log("print")
            printcanvas.width=dW
            printcanvas.height=dH
            var index=0;
            var pSrc=canvasdesign.current?.getContext('2d')?.getImageData(0,0,sW,sH);
            var pDst=printdesign.current?.getContext('2d')?.getImageData(0,0,dW,dH);
            
            var aInd=0;
            var bInd=1;
            var errArr=new Array(2);
            errArr[0]=new Array(dW);
            errArr[1]=new Array(dW);
            
            for (var i=0;i<dW;i++)
                errArr[bInd][i]=[0,0,0];
                
            for (var j=0;j<dH;j++){
                var y=dY+j;
                
                if ((y<0)||(y>=sH)){
                    for (var i=0;i<dW;i++,index+=4) setVal(pDst,index,(i+j)%2==0?1:0);  
                    continue;
                }
                
                aInd=((bInd=aInd)+1)&1;
                for (var i=0;i<dW;i++)errArr[bInd][i]=[0,0,0];
                
                for (var i=0;i<dW;i++){
                    var x=dX+i;
                    
                    if ((x<0)||(x>=sW)){
                        setVal(pDst,index,(i+j)%2==0?1:0);
                        index+=4;
                        continue;
                    }
                    
                    var pos=(y*sW+x)*4;
                    var old=errArr[aInd][i];
                    var r=pSrc?.data[pos  ]+old[0];
                    var g=pSrc?.data[pos+1]+old[1];
                    var b=pSrc?.data[pos+2]+old[2];
                    var colVal = curPal[getNear(r,g,b)];
                    if(pDst){
                        pDst.data[index++]=colVal[0];
                        pDst.data[index++]=colVal[1];
                        pDst.data[index++]=colVal[2];
                        pDst.data[index++]=255;
                    }
                    r=(r-colVal[0]);
                    g=(g-colVal[1]);
                    b=(b-colVal[2]);
                    
                    if (i==0){
                        errArr[bInd][i  ]=addVal(errArr[bInd][i  ],r,g,b,7.0);
                        errArr[bInd][i+1]=addVal(errArr[bInd][i+1],r,g,b,2.0);
                        errArr[aInd][i+1]=addVal(errArr[aInd][i+1],r,g,b,7.0);
                    }else if (i==dW-1){
                        errArr[bInd][i-1]=addVal(errArr[bInd][i-1],r,g,b,7.0);
                        errArr[bInd][i  ]=addVal(errArr[bInd][i  ],r,g,b,9.0);
                    }else{
                        errArr[bInd][i-1]=addVal(errArr[bInd][i-1],r,g,b,3.0);
                        errArr[bInd][i  ]=addVal(errArr[bInd][i  ],r,g,b,5.0);
                        errArr[bInd][i+1]=addVal(errArr[bInd][i+1],r,g,b,1.0);
                        errArr[aInd][i+1]=addVal(errArr[aInd][i+1],r,g,b,7.0);
                    }
                }
            }
        
    //console.log(errArr)
    if(pDst){
    
        printdesign.current?.getContext('2d')?.putImageData(pDst,0,0)
       alert("width="+printdesign.current?.width)
       alert("height="+printdesign.current?.height)
        uploadImage()
    }
   
}

       
        // canvas.height=dH;
        // var index=0;
        // var pSrc=source.getContext('2d').getImageData(0,0,sW,sH);
        // var pDst=canvas.getContext('2d').getImageData(0,0,dW,dH);

    }
    function setVal(p:any,i:any,c:any){
        p.data[i]=curPal[c][0];
        p.data[i+1]=curPal[c][1];
        p.data[i+2]=curPal[c][2];
        p.data[i+3]=255;
    }
    function getErr(r:any,g:any,b:any,stdCol:any){
        r-=stdCol[0];
        g-=stdCol[1];
        b-=stdCol[2];
        return r*r + g*g + b*b;
    }
    function getNear(r:any,g:any,b:any){
        var ind=0;
        var err=getErr(r,g,b,curPal[0]);
        for (var i=1;i<curPal.length;i++)
        {
            var cur=getErr(r,g,b,curPal[i]);
            if (cur<err){err=cur;ind=i;}
        }
        return ind;
    }
    function addVal(c:any,r:any,g:any,b:any,k:any){
        return[c[0]+(r*k)/32,c[1]+(g*k)/32,c[2]+(b*k)/32];
    }
    const _base64ToArrayBuffer = async(base64: any) => {




        
        // return false;
        // fetch(base64)
        //     .then(res => res.arrayBuffer())
        //     .then(buffer => {
        //         console.log("CLICKED")

        //         let buffer_val = new Uint8Array(buffer);
        //         //   console.log(buffer_val.buffer);
        //         //  alert(buffer_val.length)
        //         //   get_array(buffer_val);
        //         // for (let i = 0; i < buffer_val.length; i += 256) {
        //         //     const chunk = buffer_val.slice(i, i + 256);
        //         //     handleUploadingStage(chunk);
        //         //     // do whatever
        //         // }

                // BleClient.initialize({ androidNeverForLocation: true }).then((success) => {
                //     console.log("success", success)
                //     BleClient.isBonded('CF:40:4C:5C:57:2E').then((success_status) => {
                //         console.log("success_status", success_status)
                //         if (!success_status) {
                //             BleClient.createBond('CF:40:4C:5C:57:2E').then((connect) => {
                //                 alert(JSON.stringify(connect))
                //             }).catch((bonderror) => {
                //                 alert(bonderror)
                //             })
                //         } else {
                //             BleClient.connect('CF:40:4C:5C:57:2E', (onDisconnect) => {
                //                 console.log("DISCONNECTED")
                //             }, { timeout: 10000 }).then((connecd_device) => {
                //                 BleClient.write('CF:40:4C:5C:57:2E', "6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400002-b5a3-f393-e0a9-e50e24dcca9e", textToDataView('1')).then((written) => {
                //                     setTimeout(() => {
                //                         BleClient.disconnect('CF:40:4C:5C:57:2E').then((disconnected) => {
                                            // BluetoothSerial.discoverUnpaired().then((devices) => {
                                            //     let epaperdisplayindex = devices.findIndex((x: any) => x.name == "epaperDisplay");
                                            //     if (epaperdisplayindex != -1) {
                                            //         let deviceId = devices[epaperdisplayindex].address;
                                            //         BluetoothSerial.connect(deviceId).subscribe((status) => {
                                            //             let initilize_screen = [73, 13];
                                            //             BluetoothSerial.write(initilize_screen).then((write_success) => {                                            const chunkSize = 256;
                                            //                 get_array(array);
                                            //             }).catch((write_error) => {
                                            //                 alert(write_error)
                                            //             })
                                            //         })

                                            //     } else {
                                            //         alert("device with name epaperDisplay not found")
                                            //     }
                                            // }).catch(error => {
                                            //     alert(error)
                                            // })
                //                         }).catch((disconnect_error) => {
                //                             alert(disconnect_error)
                //                         })
                //                     }, 2000);
                //                 }).catch((write_error) => {
                //                     alert(write_error)
                //                 })

                //             }).catch((connect_error) => {
                //                 alert(JSON.stringify(connect_error));
                //             })
                //         }
                //     })

                // }).catch((error) => {
                //     alert(error)
                // })


        //     })
    }
    function getVal(p:any, i:any){
        if((p.data[i]==0x00) && (p.data[i+1]==0x00))return 0;
        if((p.data[i]==0xFF) && (p.data[i+1]==0xFF))return 1;
        if((p.data[i]==0x7F) && (p.data[i+1]==0x7F))return 2;
        return 3;
    }


function getPixel(bitmap:any, x:any, y:any) {
    var imageData = bitmap.getContext('2d').getImageData(x, y, 1, 1).data;
    var alpha = imageData[3];
    var red = imageData[0];
    var green = imageData[1];
    var blue = imageData[2];
    var color = (alpha << 24) | (red << 16) | (green << 8) | blue;
    return color;
}
const uploadImage=() => {
    // var c:any = document.getElementById('can');
//     var w:any=dispW=printdesign.current?.width;
//     var h:any=dispH=printdesign.current?.height;
//     console.log(w,h)
//     var p=printdesign.current?.getContext('2d')?.getImageData(0,0,w,h);
//     var a=new Array(w*h);
//     var i=0;
//     for(var y=0;y<h;y++)for(var x=0;x<w;x++,i++) {
		
// 			a[i]=getVal(p, i<<2);
// 	}
//     dispX=0;
//     pxInd=0;
//     stInd=0;
//  console.log(a.toString());
//  get_array(a);

    var c:any = document.getElementById(`printimage${design.id}`);
    var w=dispW=c.width;
    var h=dispH=c.height;
    //console.log(w, h)
    var p=c.getContext('2d').getImageData(0,0,w,h);
    var a=new Array(w*h);
    var i=0;
    for(var y=0;y<h;y++)for(var x=0;x<w;x++,i++) {
        a[i]=getVal(p, i<<2);
}
dispX=0;
pxInd=0;
stInd=0;

//Need to comment setImageArray(a) & setloader(true) both function when you create build for this App.
setImageArray(a);
setloader(true)
//Need to uncomment below function when you create build for this app.

// BluetoothSerial.discoverUnpaired().then((devices) => {
//     let epaperdisplayindex = devices.findIndex((x: any) => x.name == "epaperDisplay");
//     if (epaperdisplayindex != -1) {
//         let deviceId = devices[epaperdisplayindex].address;
//         BluetoothSerial.connect(deviceId).subscribe((status) => {
//             let initilize_screen = [73, 13];
//             BluetoothSerial.write(initilize_screen).then((write_success) => {
//                 const chunkSize = 256;
//                 setImageArray(a);
//                 setloader(true)
//             }).catch((write_error) => {
//                 alert(write_error)
//             })
//         })

//     } else {
//         alert("device with name epaperDisplay not found")
//     }
// }).catch(error => {
//     alert(error)
// })
 
}

return (
        <>
            <IonCard className={home.card} key={val}>
                <div className={home.thumbnailContainer} onClick={() => {loadCanvas(design)}}>
                    <IonImg className={home.thumbnail} src={design.thumbnail} />
                    {/*
                    <canvas className={home.designImg} id='canvas' />
                    */}
                    <canvas hidden ref={canvasdesign} height={design.canvasHeight} width={design.canvasWidth} />
                    <canvas hidden ref={printdesign} id={`printimage${design.id}`}/>
                    {/*
                    <button className={home.cardLikeButton} onClick={() => {openactionsheet()}} color="undefined">
                        <span className={app.materialSymbol}>favorite</span>
                    </button>
                    */}
                     {showloader &&
                    <>
                    <ImageManipulator updateProgress={updateProgress} progress={progress} imgarray={imageArray} setloader={setloader} showloader={showloader} />
                    </>
           
              
                    }
                    
                </div>

                <IonButton className={home.favoritesButton} onClick={()=>{like_design(currentDesing.id, currentDesing.liked==1 ? 0 : 1)}}>
                    <span className={app.materialSymbol}>favorite</span>
                    {currentDesing.liked==1 ? 'liked': 'unliked'}
                </IonButton>

                <IonCardHeader>
                    <IonToolbar>
                        <IonCardTitle className={home.savedDesignTitle}>
                            {design.name?.length != 0 ?
                            design.name : "Untitled"}
                        </IonCardTitle>

                        <IonButtons slot="end">
                            <IonButton
                                className={home.cardSendButton}
                                fill="solid"
                                size="small"
                                color="primary"
                                onClick={() => {openactionsheet(design)}}
                            >
                                <span className={app.materialSymbol}>cast</span>
                            </IonButton>
                        
                            <IonButton
                                className={home.cardOptionsButton}
                                fill="solid"
                                size="small"
                                color="secondary"
                                onClick={() => {openactionsheet(design)}}
                            >
                                <span className={app.materialSymbol}>more_vert</span>
                            </IonButton>
                        </IonButtons>
                        {
                        isSaveBoxToggle ?
                            <button className={home.toggleBtn} color="undefined" onClick={() => {deleteCard(design)}}>
                                <span className={app.material_symbols_outlined_box}>delete</span>
                                DELETE DESIGN
                            </button>
                        : null
                        }
                    </IonToolbar>
                </IonCardHeader>


                <IonCardContent className={home.categoriesToolbar}>
                    { categoryData.map((category:any) => (<IonChip className={home.categoryChip}>{ category?.length != 0 ? category.trim():'No Category'}</IonChip>))}
                </IonCardContent>


              
            </IonCard>

            <IonModal ref={modal} trigger={`open-modal${design.designId}`} onWillDismiss={(ev) => onWillDismiss(ev)} onIonModalDidPresent={handleOpenModal}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Print Preview</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
           
            <IonButton onClick={()=>uploadImage()}>Upload </IonButton>
            {showloader &&
            <>
             <ImageManipulator updateProgress={updateProgress} progress={progress} imgarray={imageArray} setloader={setloader} showloader={showloader} />
            </>
           
              
                    }
                </IonContent>
            </IonModal>
        </>
    );
}

export { ThumbnailCards };