import React, { useContext, useEffect, useState, useRef } from 'react';
//import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
//import ExploreContainer from '../components/ExploreContainer';
import { Link, useHistory } from 'react-router-dom';
import './Tab4.css';
import { SqllileQueries } from '../queries';
import useSqlite from '../database';
import home from '../Home.module.css';
import app from '../App.module.css';

//Card design implement.
import { DeleteWarning } from "../components/DeleteWarning";
//import { ThumbnailCards } from "../components/ThumbnailCards";
import { CanvasStore } from "../Store/CanvasStore";
import { useIonViewWillEnter } from "@ionic/react";

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial';
import ImageManipulator from '../Hooks/imageManipulation';
import { ThumbnailCards } from "../components/ThumbnailCards";


import {
  IonHeader,
  IonToolbar,
  IonTitle,
  //IonMenu,
  //IonFabButton,
  IonButtons,
  IonButton,
  // IonMenuButton,
  // IonFab,
  // IonIcon,
  IonContent,
  IonSearchbar,
  IonList,
  useIonToast,
  IonPage,
  IonItem,
  IonLabel,
  IonListHeader,
  IonSegment,
  IonSegmentButton,
  useIonActionSheet,

  //IonAvatar,
  IonImg,
  IonModal,

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonChip,


} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';

interface Category {
  id: number;
  name: string;
}

// interface CanvasItems {
//   id: number,
//   name: string;
//   canvasColor: string;
//   canvasHeight: number;
//   canvasWidth: number;
//   liked: number;
//   designId: string;
//   designJson: string;
//   thumbnail: string;
//   categories: string;
// }



const Tab4: React.FC = () => {

  console.log('Tab4 render');
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }


  const { db } = useSqlite();
  const {deleteCanvas, getCategories, getCanvases,LikeUnlikeCanvas, isopen } = SqllileQueries();
  const [categories, setCategories] = useState<Category[]>([]);
  const [canvases, setCanvases] = useState([]);
  const [currentCategory, setcurrentCategory] = useState<string>();
  //const [records, setRecords] = useState<CanvasItems[]>([]);
  const [present] = useIonActionSheet();
  const [query, setQuery] = useState<string>();
  const [shorting, setShorting] = useState<string>();
  const [clearVal, setclearVal] = useState<string>();

  //Card design implement.
  const [deleteToggle, setDeleteToggle]: any = useState(false);
  const [isDeleteDesign, setDeleteDesign]: any = useState();
  const [isDesignHome, setDesignHome]: any = useState(true);
  const [thumbnail, setThumbnail]: any = useState([]);
  const [result, setResult]: any = useState([]);
  const { setColorModeIcon }: any = useContext(CanvasStore);
  const { setCanvasDesign }: any = useContext(CanvasStore);
  const { isTitleInput, setTitleInput }: any = useContext(CanvasStore);
  const {isIdInput, setIdInput}: any = useContext(CanvasStore);
  const [presents] = useIonToast();

  const canvasdesign = useRef<HTMLCanvasElement>(null);
  const printdesign = useRef<HTMLCanvasElement>(null);
  const [ progress, updateProgress ] = useState(0);
  const [ showloader, setloader ] = useState(false);
  const [ imageArray, setImageArray ] = useState<any>([]);

  const { setCanvasDesignPrint }: any = useContext(CanvasStore);
 

  var epdArr:any,epdInd:any,palArr:any, curPal:any;
  var pxInd:any,stInd:any;
  var dispW,dispH;
  var xhReq,dispX;
  var rqPrf,rqMsg;



  let history = useHistory();
  console.log('Tab4 Page Start::');

  useEffect(() => {
    console.log('Step 0');
    const init = async () => {

      console.log('Step 1');
      try {
        console.log('Step 3');
        console.log(isopen);
        console.log('Step 4');
        if (isopen) {
          console.log('Step 5');
          categoriesList()
          drawingList()
          console.log('Step 6');
          
        }
      } catch (err) {
        console.log('Step 7');
        console.log(err);
        console.log('Step 8');
      }
    };
    console.log('Step 9');
    init();
    console.log('Step 10');
  }, [isopen]);
  console.log('Step 11');

  useEffect(() =>{
    console.log('Step 12');
    categoriesList();
  },[]);
  //get categories data from database and set categories using useState (setCategories) function.
  
  const categoriesList = async () => {
    console.log('categoriesList');
    let cat = await getCategories();
    console.log(cat);
    setCategories(cat);
  }

  const openactionsheet = (design:any) => {
    present({
      header: 'Actions',
      buttons: [
        {
          text: 'Send to display',
          handler: () => {
            modal?.current?.present()

          },
        },
        {
          text: 'Add to favorites',
          handler: () => {
            like_design(design.id, design.liked==1 ? 0 : 1)
          },
        },
        {
          text: 'Edit',
          handler: () => {
            loadCanvas(design);
          },
        },
        {
          text: 'Duplicate',
          handler: () => {

          },
        },
        {
          text: 'Invert',
          handler: () => {

          },
        },
        {
          text: 'Share',
          handler: () => {

          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            
            deleteCanvas(design.id);
            
            let filteredArray = canvases.filter((des:any)=> des.id !== design.id);
            setCanvases([...filteredArray as []]);
            setCanvases(filteredArray);
            setcurrentCategory('all');
            console.log(filteredArray);

            presentToast('top','Design deleted successfully')
            history.push("/tab4");


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
    });

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
  }

  const presentToast = (position:any, message:any) => {
    presents({
        message: message,
        duration: 1500,
        position: position
    });
  };

  //get drawing data from database and set canvases  using useState (setCanvases) function.
  const drawingList = async () => {
    console.log('drawingList')
    let canvas = await getCanvases();
    console.log(canvas);
    setCanvases(canvas);
    setcurrentCategory('all')
    if (canvas.length == 0) {
      setDesignHome(false)
    } else {
      setDesignHome(true)
    }

  }

  function fetchAllCategoryData(){
    categoriesList();
    drawingList();

  }

  const loadCanvas = (design: any) => {


    const designJson: any = JSON.parse(design.designJson);
    if (designJson.background == 'black') {
      setColorModeIcon("light_mode")
    } else {
      setColorModeIcon("dark_mode")
    }
    setCanvasDesign(design);
    history.push("/drawing");
    setTitleInput(design.name);
    setIdInput(design.id);
  }

  useEffect(() => {

    if (isopen) {

      console.log('connection available');
      getCanvases().then(function(CanvasResult){
        setResult(CanvasResult);
      });

      getCategories().then(function(CatResult){
        setCategories(CatResult);
      });


    }

  },[])

  //   const deleteCards = async () => {
  //     let filteredArray = thumbnail.filter((des:any)=> des.designId !== isDeleteDesign.designId);
  //     setThumbnail([...filteredArray as []]);
  //     await storage.set('myDesign', JSON.stringify(filteredArray));

  //     if(filteredArray.length == 0 ) {
  //          setDesignHome(false)
  //     }

  //     presentToast('top','Design deleted successfully')
  //     setDeleteToggle(false);
  //     history.push("/");
  // }
  // const toggleDelete=(design:any)=>{
  //     setDeleteToggle(!deleteToggle);
  //     !deleteToggle ? setDeleteDesign(design) :setDeleteDesign(null) ;
  // }
  // const presentToast = (position:any, message:any) => {
  //   present({
  //       message: message,
  //       duration: 1500,
  //       position: position
  //   });
  // };

  //Filter the "canvases" data by using array filter function and set into empty array result as per selected category from segement.
  
useEffect(()=>{
  
  if (currentCategory === 'all' || typeof currentCategory == "undefined") {

    //fetchAllCategoryData();
    //setQuery(undefined);
    setQuery('');
    console.log(canvases)

    if (isopen) {

      console.log('connection available');
      getCanvases().then(function(result){
        setResult(result);
      })

    }else{

      setResult(canvases);
    }
    

   
    console.log(result);

  } else if (currentCategory === 'favorites') {
    //setQuery('');
   let filter= canvases?.filter(canvase => canvase['liked'] === 1);
   setResult(filter)

  } else {
    //setQuery('');
   let filter = canvases?.filter(canvase => canvase['categories'] == currentCategory);
   setResult(filter)
  }

  if (query) {
    console.log(query);
    //let canvasesObj = Object.assign({}, canvases);
    let filter = canvases?.filter(canvase => canvase['name'] == query);
    setResult(filter)
    //setCanvases(filter);
   
    dismiss();

  }


  if (shorting) {
    let shortingArray = [];
    shortingArray = result;

    if (shorting == 'new') {
     let filter = shortingArray.slice(0).reverse().map((element: unknown) => { return element; });
     setResult(filter)
    }

    if (shorting == 'old') {
      // result = result;
    }

    if (shorting == 'A') {
      // result = canvases;  
    }

    if (shorting == 'Z') {
      setResult(result);
    }

  }
},[currentCategory, query, shorting])
  

  // Searching AS per 3 dots searching input.
  
  //  console.log('--------------------------------------');
  //  console.log(query);
  //  console.log('--------------------------------------');

  // Shorting By "New","Old","A-Z","Z-A"
  


  const like_design=async(id:Number,status:Number)=>{
    console.log(id, status)
    await LikeUnlikeCanvas(id, status)
    let index:number=result.findIndex((x:any)=>x.id==id);
    if(index != -1){
      result[index].liked=status;
      setResult((oldvalues:any)=>[...oldvalues, oldvalues[index].liked=status])
      console.log("result", result)
    }
  }
  //If result array is empty then set by default all. 
  // if(result.length === 0){
  //   result =  canvases;
  // }

  const [menuType, setMenuType] = useState('overlay');
  
  //******************************************************************************************************************************************* */

 


  const onWillDismiss =(ev: CustomEvent<OverlayEventDetail>)=>{
      console.log(ev.detail.role)
      // if (ev.detail.role === 'confirm') {

      // }
    }

  const convertImage = async(image: any) => {
      let array_buffer = _base64ToArrayBuffer(image);
  }
  
 

const handleOpenModal = () => {
    console.log(canvasdesign.current?.width)
    console.log(canvasdesign.current?.height)
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
    
console.log(errArr)
if(pDst){

    printdesign.current?.getContext('2d')?.putImageData(pDst,0,0)
//    alert("width="+printdesign.current?.width)
//    alert("height="+printdesign.current?.height)
//     // uploadImage()
}

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
    // canvas.height=dH;
    // var index=0;
    // var pSrc=source.getContext('2d').getImageData(0,0,sW,sH);
    // var pDst=canvas.getContext('2d').getImageData(0,0,dW,dH);

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

var c:any = document.getElementById('printimage');
var w=dispW=c.width;
var h=dispH=c.height;
console.log(w, h)
var p=c.getContext('2d').getImageData(0,0,w,h);
var a=new Array(w*h);
var i=0;
for(var y=0;y<h;y++)for(var x=0;x<w;x++,i++) {
    a[i]=getVal(p, i<<2);
}
dispX=0;
pxInd=0;
stInd=0;
// setImageArray(a);
// setloader(true)
// get_array(a);
// console.log(a.toString());
BluetoothSerial.discoverUnpaired().then((devices:any) => {
let epaperdisplayindex = devices.findIndex((x: any) => x.name == "epaperDisplay");
if (epaperdisplayindex != -1) {
    let deviceId = devices[epaperdisplayindex].address;
    BluetoothSerial.connect(deviceId).subscribe((status:any) => {
        let initilize_screen = [73, 13];
        BluetoothSerial.write(initilize_screen).then((write_success:any) => {
            const chunkSize = 256;
            setImageArray(a);
            setloader(true)
        }).catch((write_error:any) => {
            alert(write_error)
        })
    })

} else {
    alert("device with name epaperDisplay not found")
}
}).catch((error:any) => {
alert(error)
})

}
  //******************************************************************************************************************************************* */
  return (

    <>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar id={home.pageTitleContainer} className="header">
            <IonTitle id={home.pageTitle} className={app.pageTitle}>
              Saved Designs
              {/*<img className={home.logo} alt="logo" width="80" src="./assets/images/logo.svg" />*/}
            </IonTitle>
            <IonButtons id="open-modal"><span className={app.materialSymbol}>more_vert</span></IonButtons>


          </IonToolbar>

          <IonModal id="example-modal" ref={modal} trigger="open-modal">

            <IonHeader>
              <IonToolbar className={app.menuTitleContainer}>
                <IonTitle className={app.menuTitle}>Options</IonTitle>
                {/* <IonButton color="light" onClick={() => dismiss()}> Close</IonButton> */}
              </IonToolbar>

              <IonToolbar className="pageSearchbarContainer">
                <IonSearchbar className="custom" value={query} onIonChange={e => setQuery(e.detail.value?.toString())} placeholder="Search" showClearButton="focus" animated={false} ></IonSearchbar>
                {/* <IonSearchbar value={query} onIonChange={e => setQuery(e.detail.value)} /> */}
              </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
              <IonList >
                <IonListHeader>
                  <IonLabel>Sort</IonLabel>
                </IonListHeader>
                <IonItem button detail={false}>
                  <IonLabel onClick={() => { setShorting('new') }}>Newest</IonLabel>
                </IonItem>
                <IonItem button detail={false}>
                  <IonLabel onClick={() => { setShorting('old') }}>Oldest</IonLabel>
                </IonItem>
                <IonItem button detail={false}>
                  <IonLabel onClick={() => { setShorting('A') }}>A to Z</IonLabel>
                </IonItem>
                <IonItem button detail={false}>
                  <IonLabel onClick={() => { setShorting('Z') }}>Z to A</IonLabel>
                </IonItem>
              </IonList>
            </IonContent>

          </IonModal>

          <IonToolbar className={home.pageSearchbarContainer}>
            <IonSegment
              value={currentCategory}
              scrollable={true}
              onIonChange={(e) => setcurrentCategory(e.detail.value)}
            >
              <IonSegmentButton value="all">
                <IonLabel>All</IonLabel>
              </IonSegmentButton>

              <IonSegmentButton value="favorites">
                <IonLabel>Favorites</IonLabel>
              </IonSegmentButton>

              {categories?.map((value: any, index) => {
                return (

                  <IonSegmentButton value={value?.name} key={index}>
                    <IonLabel>{value?.name}</IonLabel>
                  </IonSegmentButton>

                )
              })}


            </IonSegment>
          </IonToolbar>
        </IonHeader>
        {/* <IonContent fullscreen>
         
        {result?.map((value:any, index)=>{
          return(
            <div key={index}>
              <img src={value?.thumbnail} width="50px" height="50px" />
            </div>
          )
        })}
        </IonContent> */}


        {
          deleteToggle ?
            <DeleteWarning isOpen={deleteToggle} isDeleteDesign={isDeleteDesign} />
            // deleteCards={deleteCards} toggleDelete={toggleDelete} 
            :
            <IonContent className={home.savedDesignsContainer} fullscreen={true}>
              <IonList
                className='card_outer'
                inset={false}
                lines="none">


                {
                  isDesignHome ? (

                    result?.map((design: any, index:number) => {  
                    
                      let categoriesData =[];
                      if(design.categories != undefined){
                        categoriesData = design.categories.split(','); 
                      }

                     // if(design.id > 0){

                        return (
                       <>
                          <IonCard className={home.savedDesignCard} key={index}>
                            <div className={home.thumbnailContainer} onClick={() => { loadCanvas(design) }}>
                              <IonImg  src={design.thumbnail} />

                              <canvas hidden ref={canvasdesign} height={design.canvasHeight} width={design.canvasWidth} />

                              
                            </div>
                            <IonButton className={home.favoritesButton} onClick={()=>{like_design(design.id, design.liked==1 ? 0 : 1)}}>
                                <span className={app.materialSymbol}>favorite</span>
                                {design.liked==1 ? 'liked': 'unliked'}
                              </IonButton>

                            <div >
                              <IonToolbar className={home.savedDesignTitleContainer}>
                               <div className='cate_wrapper'>
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
                                    onClick={() => { openactionsheet(design) }}
                                  >
                                    <span className={app.materialSymbol}>cast</span>
                                  </IonButton>

                                  <IonButton
                                    className={home.cardOptionsButton}
                                    fill="solid"
                                    size="small"
                                    color="secondary"
                                    onClick={() => { openactionsheet(design) }}
                                  >
                                    <span className={app.materialSymbol}>more_vert</span>
                                  </IonButton>
                                </IonButtons>
                                {/* {
                                              isSaveBoxToggle ?
                                                  <button className={home.toggleBtn} color="undefined" onClick={() => {deleteCard(design)}}>
                                                      <span className={app.material_symbols_outlined_box}>delete</span>
                                                      DELETE DESIGN
                                                  </button>
                                              : null
                                              } */}
                               </div>
                              </IonToolbar>
                              <div>
                                <IonToolbar className={home.categoriesToolbar}>
                                { categoriesData.map((category:any) => (<IonChip className={home.categoryChip}>{category.trim()}</IonChip>))}
                                
                                </IonToolbar>
                              </div>
                            </div>

                          </IonCard>
                        
  <IonModal ref={modal} trigger={`open-modal${design.id}`} onWillDismiss={(ev) => onWillDismiss(ev)} onIonModalDidPresent={handleOpenModal}>

    <IonHeader>
      <IonToolbar>
      <IonButtons slot="start">
      <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
      </IonButtons>
      <IonTitle>Print Preview</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent className="ion-padding">
      <canvas ref={printdesign} id="printimage"/>
      <IonButton onClick={()=>uploadImage()}>Upload </IonButton>
      {showloader &&
      <>
      <ImageManipulator updateProgress={updateProgress} progress={progress} imgarray={imageArray} setloader={setloader} showloader={showloader} />
      </>

      }
    </IonContent>
  </IonModal>
                        </>
                      )
                     // }

                     


                    })
                  )
                    :
                    <Link to="/sizes">
                      <IonButton className={home.savedDesignCard}>
                        Create New
                      </IonButton>
                    </Link>
                }



              </IonList>

              {/* <IonFab slot="fixed" vertical="bottom" horizontal="end">
                            <Link to="/sizes" >
                                <IonFabButton>
                                    <IonIcon icon={add}></IonIcon>
                                </IonFabButton>
                            </Link>
                        </IonFab> */}


            </IonContent>
        }
      </IonPage>

    </>
  );
};

export default Tab4;
