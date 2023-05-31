import React, { useContext, useEffect, useState, useRef } from 'react';
//import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
//import ExploreContainer from '../components/ExploreContainer';
import { Link, useHistory ,useLocation} from 'react-router-dom';
import './Tab4.css';
import { SqllileQueries } from '../queries';
//import useSqlite from '../database';
import home from '../Home.module.css';
import app from '../App.module.css';

//Card design implement.
import { DeleteWarning } from "../components/DeleteWarning";
import { ThumbnailCards } from "../components/ThumbnailCards";
import { CanvasStore } from "../Store/CanvasStore";
import { useIonViewWillEnter } from "@ionic/react";
import ImageManipulator from '../Hooks/imageManipulation';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial';

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
import { unescape } from 'lodash';

interface Category {
  id: number;
  name: string;
}


const Tab4: React.FC = () => {

  const modal = useRef<HTMLIonModalElement>(null);
  //const { db } = useSqlite();
  const {deleteCanvas, getCategories, getCanvases, LikeUnlikeCanvas, isopen } = SqllileQueries();
  const [categories, setCategories] = useState<Category[]>([]);
  const [canvases, setCanvases] = useState([]);
  const [currentCategory, setcurrentCategory] = useState<string>();
  
  //const [records, setRecords] = useState<CanvasItems[]>([]);
  const [present] = useIonActionSheet();
  const [query, setQuery] = useState<string>();
  const [shorting, setShorting] = useState<string>();
  const [clearVal, setclearVal] = useState<string>();

  const canvasdesign = useRef<HTMLCanvasElement>(null);
  const printdesign = useRef<HTMLCanvasElement>(null);
  //Card design implement.
  const [isDeleteDesign, setDeleteDesign]: any = useState();


  const [deleteToggle, setDeleteToggle]: any = useState(false);
  
  const [isDesignHome, setDesignHome]: any = useState(true);
  const [thumbnail, setThumbnail]: any = useState([]);
  const [result, setResult]: any = useState([]);
  const { setColorModeIcon }: any = useContext(CanvasStore);
  const { setCanvasDesign }: any = useContext(CanvasStore);
  const { isTitleInput, setTitleInput }: any = useContext(CanvasStore);
  const {isIdInput, setIdInput}: any = useContext(CanvasStore);
  const [ imageArray, setImageArray] = useState<any>([]);
  const [ showloader, setloader ] = useState(false);
  const [ searchResult, setSearchResult ] = useState([]);
  const [ isSearch, setIsSearch ] = useState(false);
  const [presents] = useIonToast();

  let history:any = useHistory();

  const location:any = useLocation();
  const data = location.state?.data;

  useEffect(() => {
    const init = async () => {
      try {
        // if (isopen) {
          categoriesList()
          drawingList()
          
        // }
      } catch (err) {
        console.log(err)
      }
    };
    init();
  }, [isopen,data,showloader]);

  function dismiss() {
    modal.current?.dismiss();
  }

  //get categories data from database and set categories using useState (setCategories) function.
  
  const categoriesList = async () => {
   
    await getCategories().then(function(cat){
      console.log("categories---", cat['values']);
      setCategories(cat['values']);

    }).catch(e => {
      console.log(e)
    });
    
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
   
    await getCanvases().then(function(canvas){
      console.log("canvas---", canvas['values']);
      setCanvases(canvas['values']);
      setResult(canvas['values']);
      setcurrentCategory('all');

      if (canvas['values'].length == 0) {
        setDesignHome(false)
      } else {
        setDesignHome(true)
      }

    }).catch(e => {
      console.log(e)
    });
    
  }



  const loadCanvas = (design: any) => {
    setTitleInput(design.name);
    setIdInput(design.id);

    const designJson: any = JSON.parse(design.designJson);
    if (designJson.background == 'black') {
      setColorModeIcon("light_mode")
    } else {
      setColorModeIcon("dark_mode")
    }
    setCanvasDesign(design);
    history.push("/drawing");
   
  }

  //Filter the "canvases" data by using array filter function and set into empty array result as per selected category from segement.
  
useEffect(()=>{
  
  if (currentCategory === 'all' || typeof currentCategory == "undefined") {
   
    setQuery('');

    if(isSearch === true){setResult(searchResult); setIsSearch(false);}else{setResult(canvases);}
    
    
  } else if (currentCategory === 'favorites') {
 
    setQuery('');
    let filter= canvases?.filter(canvase => canvase['liked'] === 1);
    setResult([...filter as []]);

  } else {

    setQuery('');
    let filter = canvases?.filter(canvase => canvase['categories'] == currentCategory);
    setResult([...filter as []]);
  }

  if (query) {

    console.log('Searching Keyword:::', query)
    
    let searchResult = canvases?.filter(canvase => canvase['name'] == query);
    setcurrentCategory('all');
    setSearchResult(searchResult)
    setIsSearch(true);
    console.log('Searching Result::',searchResult)
    dismiss();

  }


  if (shorting) {
    let shortingArray = [];
    shortingArray = result;

    if (shorting == 'new') {
     let filter = shortingArray.slice(0).reverse().map((element: unknown) => { return element; });
     setResult([...filter as []]);
    }

    if (shorting == 'old') {
      //result;

    }

    if (shorting == 'A') {
      // result = canvases;  
    }

    if (shorting == 'Z') {
      setResult(result);
    }

   

  }

},[currentCategory, query, shorting])
  

  const like_design=async(id:Number,status:Number)=>{
    await LikeUnlikeCanvas(id, status)
    let index:number=result.findIndex((x:any)=>x.id==id);
    if(index != -1){
      result[index].liked=status;
      setResult((oldvalues:any)=>[...oldvalues, oldvalues[index].liked=status])
    }
  }
  
  const deleteCards = async () => {
    console.log("inside deletecard::",isDeleteDesign.id)
   
    await deleteCanvas(isDeleteDesign.id).then((result:any)=>{
                                        
      history.push({pathname:'/tab4', state:{data:result}});
     
      setloader(!showloader);

      presentToast('top','Design deleted successfully')
      setDeleteToggle(false);

  });


  }

  const toggleDelete=(design:any)=>{
    setTimeout(() => {
      
      setDeleteToggle(!deleteToggle);
      !deleteToggle ? setDeleteDesign(design) :setDeleteDesign(null) ;
    }, 500);
     
  }
  
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
       
        {
          deleteToggle &&
            <DeleteWarning deleteCards={deleteCards} toggleDelete={toggleDelete} isOpen={deleteToggle} isDeleteDesign={isDeleteDesign} />
        }
            <IonContent  className={home.savedDesignsContainer} fullscreen={true}>
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

                   
                        return (
                       <>

                          <ThumbnailCards val={index} key={index} design={design} loadCanvas={loadCanvas}  deleteCard={toggleDelete} categoryData={categoriesData} />
                        </>
                      )
                    
                    })
                  )
                    :
                    <Link to="/tab3">
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
        
      </IonPage>

    </>
  );
};

export default Tab4;
