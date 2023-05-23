import { useContext,useState,useEffect, useRef } from 'react';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial';
import { IonProgressBar, IonLoading  } from '@ionic/react';
// import { ProgressContext } from './ProgressContext';
// var stInd: any = 0;
// var buffInd: any = 6;
// var pxInd: any = 0;
// var dSize: any = 0;
// var Progress: any = 0;
// var BUFF_SIZE = 256;
// var buffArr = Array();
// var sliceIndex: any = 0;
// var imagepixels: any = [];
// var chunkIndex: 0;
// var chunkArray:any= [];

// // const [xprogress,setXprogress] = useState(0)

// // useEffect(() => {
// // console.log(Progress,"progress from use effrect")
// // },[Progress])



// // export const get_array = (Imgarray: any) => {
// //     // while(sliceIndex <= Imgarray.length){
// //     imagepixels = Imgarray;
// //     buffInd = 0;
// //     pxInd = 0;
// //     dSize = 0;
// //     sliceIndex = 0;
// //     chunkIndex=0;
// //     console.log(Imgarray.length)
// // return u_data(0, 0, 100).then((result)=>{
// // console.log(result)
// // })


// //     //   }

// // }



// const u_data = async(c: any, k1: any, k2: any) => {
//     // pixels' data offset
//     return new Promise(async(resolve, reject) => {
//         buffInd = 6; 
//         while (pxInd < imagepixels.length && buffInd < BUFF_SIZE) {
//             let v = 0;
        
//             for (let i = 0; i < 8; i++) {
//               if (pxInd < imagepixels.length && imagepixels[pxInd] !== c) {
//                 v |= 128 >> i;
//               }
//               pxInd++;
//             }
//              let shiftArray = []
//             shiftArray[0] = v;
//             let byteshift = new Int8Array(shiftArray)
//             buffArr[buffInd++] = byteshift[0];
//           }
        
//           return u_load(k1, k2).then((response) => {
//             buffInd=0;
//             if(pxInd < imagepixels.length){
//                 u_data(0, 0, 100);
//             }else{
//                 console.log("END")
//                     setTimeout(() => {
//                   BluetoothSerial.write([83]).then((showimage) => {
//                 return resolve(true)
//             }).catch((Error_image) => {
//                 return reject(false);
//             })  
//             }, 500);
//             }
//             // return resolve(true)
//         });

//     })
    
//   }



// function u_load(k1:any, k2:any) {
    
//     return new Promise((resolve, reject) => {
//     //  const context = useContext(ProgressContext);
//     //  console.log(context,"context")
//     dSize += buffInd;
//     let x:any = "" + (k1 + k2*pxInd/imagepixels.length);
//     if (x.length > 5) x = x.substring(0, 5);
//     Progress=x;
//     // console.log(context?.updateProgress(x)); 
//     console.log("PROGRESS=", Progress)
//     // Request message contains:
//     //     data (maximum BUFF_SIZE bytes),
//     //     size of uploaded data (4 bytes),
//     //     length of data
//     //     command name "LOAD"
//     //-------------------------------------------------
//     buffArr[0] = 'L'.charCodeAt(0);
  
//     // Size of packet
//     //-------------------------------------------------
//     buffArr[1] = buffInd & 0xFF;
//     buffArr[2] = (buffInd >> 8) & 0xFF;
  
//     // Data size
//     //-------------------------------------------------
//     buffArr[3] = dSize & 0xFF;
//     buffArr[4] = (dSize >> 8) & 0xFF;
//     buffArr[5] = (dSize >> 16) & 0xFF;

//           return u_send(pxInd >= imagepixels.length).then((response) => {
//             return resolve(true);
//         });
//     })
//     // return u_send(pxInd >= array.length);
//   }

// const u_send = async (next: boolean) => {
//     return new Promise((resolve, reject) => {
//         // console.log(buffArr.toString())

//         // setTimeout(() => {
//         //     return BluetoothSerial.write(buffArr).then((img_write) => {
//         //         return BluetoothSerial.clear().then((clearstatus) => {
//         //             buffArr = [];
//         //             return resolve(true)
//         //         })
//         //     }).catch((end_error) => {
//         //         return reject(false);
//         //     })
//         // }, 900);

// setTimeout(() => {
//     // alert(pxInd)
//     console.log(buffArr.toString())
//      return resolve(true)
// }, 1000);
        
//     })

// }

const ImageManipulator=(props:any)=> {
 const {updateProgress, progress, imgarray, setloader, showloader }=props;

 const loadingRef = useRef<HTMLIonLoadingElement | null>(null);


 var stInd: any = 0;
var buffInd: any = 6;
var pxInd: any = 0;
var dSize: any = 0;
var Progress: any = 0;
var BUFF_SIZE = 256;
var buffArr = Array();
var sliceIndex: any = 0;
var imagepixels: any = [];
var chunkIndex: 0;
var chunkArray:any= [];


useEffect(()=>{
  console.log("CALLED")
  get_array(imgarray)
},[])
useEffect(()=>{
 if(showloader){
  loadingRef.current?.present();
 }else{
  loadingRef.current?.dismiss();
 }
},[showloader])
useEffect(() => {
  if (loadingRef.current) {
    loadingRef.current.message = `${(progress * 100).toFixed(2)}%`;
  }
}, [progress]);

const get_array = (Imgarray: any) => {
  // while(sliceIndex <= Imgarray.length){
  imagepixels = Imgarray;
  buffInd = 0;
  pxInd = 0;
  dSize = 0;
  sliceIndex = 0;
  chunkIndex=0;
  console.log(Imgarray.length)
return u_data(0, 0, 100).then((result)=>{
console.log(result)
})
}

const u_data = async(c: any, k1: any, k2: any) => {
  // pixels' data offset
  return new Promise(async(resolve, reject) => {
      buffInd = 6; 
      while (pxInd < imagepixels.length && buffInd < BUFF_SIZE) {
          let v = 0;
      
          for (let i = 0; i < 8; i++) {
            if (pxInd < imagepixels.length && imagepixels[pxInd] !== c) {
              v |= 128 >> i;
            }
            pxInd++;
          }
           let shiftArray = []
          shiftArray[0] = v;
          let byteshift = new Int8Array(shiftArray)
          buffArr[buffInd++] = byteshift[0];
        }
      
        return u_load(k1, k2).then((response) => {
          buffInd=0;
          if(pxInd < imagepixels.length){
              u_data(0, 0, 100);
          }else{
            setloader(false)
              console.log("END")
                  setTimeout(() => {
                BluetoothSerial.write([83]).then((showimage) => {
              return resolve(true)
          }).catch((Error_image) => {
            alert("Error_image="+Error_image)
              return reject(false);
          })  
          }, 500);
          }
          // return resolve(true)
      });

  })
  
}

function u_load(k1:any, k2:any) {
    
  return new Promise((resolve, reject) => {
  //  const context = useContext(ProgressContext);
  //  console.log(context,"context")
  dSize += buffInd;
  let x:any = "" + (k1 + k2*pxInd/imagepixels.length);
  if (x.length > 5) x = x.substring(0, 5);
  Progress=x;
  updateProgress(x/100)
  // console.log(context?.updateProgress(x)); 
  console.log("PROGRESS=", Progress)
  // Request message contains:
  //     data (maximum BUFF_SIZE bytes),
  //     size of uploaded data (4 bytes),
  //     length of data
  //     command name "LOAD"
  //-------------------------------------------------
  buffArr[0] = 'L'.charCodeAt(0);

  // Size of packet
  //-------------------------------------------------
  buffArr[1] = buffInd & 0xFF;
  buffArr[2] = (buffInd >> 8) & 0xFF;

  // Data size
  //-------------------------------------------------
  buffArr[3] = dSize & 0xFF;
  buffArr[4] = (dSize >> 8) & 0xFF;
  buffArr[5] = (dSize >> 16) & 0xFF;

        return u_send(pxInd >= imagepixels.length).then((response) => {
          return resolve(true);
      });
  })
  // return u_send(pxInd >= array.length);
}

const u_send = async (next: boolean) => {
  return new Promise((resolve, reject) => {
      // console.log(buffArr.toString())

      // setTimeout(() => {
      //     return BluetoothSerial.write(buffArr).then((img_write) => {
      //       if(img_write=="OK!"){
      //         return BluetoothSerial.clear().then((clearstatus) => {
                
      //           buffArr = [];
      //           return resolve(true)
      //       })
      //       }else{
      //         alert(JSON.stringify(img_write))
      //       }
             
      //     }).catch((end_error) => {
      //       alert(end_error)
      //         return reject(false);
      //     })
      // }, 400);
   

setTimeout(() => {
  // alert(pxInd)
  console.log(buffArr.toString())
   return resolve(true)
}, 1000);
      
  })

}

      return (
       <>
         <IonLoading
        cssClass='custom-loading'
        message='Loading...'
        spinner='dots'
        duration={0}
        isOpen={showloader}
        ref={loadingRef}
      /> 
       </>
        );
  }
 
export default ImageManipulator;

