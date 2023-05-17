import React, { useContext,useEffect, useState,useRef  } from 'react';
//import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import { SqllileQueries } from '../queries';
import useSqlite from '../database';
import home from '../Home.module.css';
import app from '../App.module.css';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonMenu,
  IonFabButton,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonFab,
  IonIcon,
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

  IonAvatar,
  IonImg,
  IonModal,

} from '@ionic/react';

interface Category {
  id: number;
  name: string;  
}

interface CanvasItems {
  id:number,
  name: string;
  canvasColor: string;
  canvasHeight: number;
  canvasWidth: number;
  liked: number;
  designId: string;
  designJson: string;
  thumbnail: string;
  categories: string;
}



const Tab4: React.FC = () => {

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }
  
  
  const { db } = useSqlite();
  const {getCategories, getCanvases, isopen } = SqllileQueries();
  const [categories, setCategories] = useState<Category[]>([]);
  const [canvases, setCanvases] = useState([]);
  const [currentCategory, setcurrentCategory] = useState<string>();
  //const [records, setRecords] = useState<CanvasItems[]>([]);
  const [present] = useIonActionSheet();
  const [query, setQuery] = useState<string>();
  const [shorting, setShorting] = useState<string>();
  const [clearVal, setclearVal] = useState<string>();
 

  useEffect(() => {
    const init = async () => {
      
      try {
        console.log(isopen)
        if (isopen) {
          categoriesList()
          drawingList()
         
        }
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, [isopen])

  //get categories data from database and set categories using useState (setCategories) function.
  const categoriesList = async () => {
    let cat = await getCategories();
    console.log(cat);
    setCategories(cat);
  }
  
  
  //get drawing data from database and set canvases  using useState (setCanvases) function.
  const drawingList = async () => {
    let canvas = await getCanvases();
    console.log(canvas);
    setCanvases(canvas);
    
  }

  //Filter the "canvases" data by using array filter function and set into empty array result as per selected category from segement.
  let result =[];
 
  if(currentCategory === 'all' || typeof currentCategory == "undefined" ){
    
  
    //setQuery(undefined);
    result = canvases;
    console.log(result);

  }else if(currentCategory === 'favorites'){

    //setQuery('');
    result = canvases?.filter(canvase => canvase['liked'] === 1);
    console.log(result);

  }else{

    //setQuery('');
    result = canvases?.filter(canvase => canvase['categories'] == currentCategory);
    console.log(result);
   
  }

  // Searching AS per 3 dots searching input.
  if(query){
    
    
    console.log(query);
    //let canvasesObj = Object.assign({}, canvases);
    result = canvases?.filter(canvase =>   canvase['name'] == query);
    console.log(result)
    dismiss();
 
 }
//  console.log('--------------------------------------');
//  console.log(query);
//  console.log('--------------------------------------');

 // Shorting By "New","Old","A-Z","Z-A"
 if(shorting){

    let shortingArray = [];

    shortingArray = result;
  if(shorting == 'new'){
    
    result = shortingArray.slice(0).reverse().map(element => {  return element;});

  }

  if(shorting == 'old'){

   // result = result;

  }

  if(shorting == 'A'){

   // result = canvases;
  
  }

  if(shorting == 'Z'){

    result = result;

  }
  
 }


  //If result array is empty then set by default all. 
  // if(result.length === 0){
  //   result =  canvases;
  // }

  const [menuType, setMenuType] = useState('overlay');
  return (

    <>       
      <IonPage  id="main-content">
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
                    <IonLabel onClick={() => {setShorting('new')}}>Newest</IonLabel>
                </IonItem>
                <IonItem button detail={false}>
                    <IonLabel onClick={() => {setShorting('old')}}>Oldest</IonLabel>
                </IonItem>
                <IonItem button detail={false}>
                    <IonLabel onClick={() => {setShorting('A')}}>A to Z</IonLabel>
                </IonItem>
                <IonItem button detail={false}>
                    <IonLabel onClick={() => {setShorting('Z')}}>Z to A</IonLabel>
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

                  {categories?.map((value:any, index)=>{
                    return(
                     
                        <IonSegmentButton value={value?.name} key={index}>
                          <IonLabel>{value?.name}</IonLabel>                          
                        </IonSegmentButton>
                     
                    )
                  })}


              </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
         
        {result?.map((value:any, index)=>{
          return(
            <div key={index}>
              <img src={value?.thumbnail} width="50px" height="50px" />
            </div>
          )
        })}
        </IonContent>
      </IonPage>
    
    </>
  );
};

export default Tab4;
