import React, { useContext, useEffect, useState, useRef } from 'react';
//import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Link, useHistory } from 'react-router-dom';
import './Tab4.css';
import { SqllileQueries } from '../queries';
import useSqlite from '../database';
import home from '../Home.module.css';
import app from '../App.module.css';

//Card design implement.
import { DeleteWarning } from "../components/DeleteWarning";
import { ThumbnailCards } from "../components/ThumbnailCards";
import { CanvasStore } from "../Store/CanvasStore";


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

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonChip,


} from '@ionic/react';

interface Category {
  id: number;
  name: string;
}

interface CanvasItems {
  id: number,
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
  const { getCategories, getCanvases,LikeUnlikeCanvas, isopen } = SqllileQueries();
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

  //get categories data from database and set categories using useState (setCategories) function.
  const categoriesList = async () => {
    console.log('categoriesList');
    let cat = await getCategories();
    console.log(cat);
    setCategories(cat);
  }

  const openactionsheet = () => {
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

          },
        },
        {
          text: 'Edit',
          handler: () => {

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
            // deleteCard(design)
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

    fetchAllCategoryData();
    //setQuery(undefined);
    console.log(canvases)
     setResult(canvases);
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
                      
                      
                      const categoriesData = design.categories.split(','); 







                      return (
                       
                          <IonCard className={home.savedDesignCard} key={index}>
                            <div className={home.thumbnailContainer} onClick={() => { loadCanvas(design) }}>
                              <IonImg  src={design.thumbnail} />

                              {/* <canvas hidden ref={canvasdesign} height={design.canvasHeight} width={design.canvasWidth} /> */}

                              
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
                                    onClick={() => { openactionsheet() }}
                                  >
                                    <span className={app.materialSymbol}>cast</span>
                                  </IonButton>

                                  <IonButton
                                    className={home.cardOptionsButton}
                                    fill="solid"
                                    size="small"
                                    color="secondary"
                                    onClick={() => { openactionsheet() }}
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
                        
                      )
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
