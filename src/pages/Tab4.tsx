import React, { useContext,useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import { SqllileQueries } from '../queries';
import useSqlite from '../database';

const Tab4: React.FC = () => {
  const { db } = useSqlite();
  const {getCanvases, isopen } = SqllileQueries();
  const [canvases, setCanvases] = useState([]);
  useEffect(() => {
    const init = async () => {
      try {
        console.log(isopen)
        if (isopen) {
          drawingList()
        }
      } catch (err) {
        console.log(err)
      }
    };
    init();
  }, [isopen])
  
  const drawingList = async () => {
    let canvas = await getCanvases();
    setCanvases(canvas)
    console.log(canvas)
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 4</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 4</IonTitle>
          </IonToolbar>
        </IonHeader>
       {canvases?.map((value:any, index)=>{
        return(
<div key={index}>
  <img src={value?.thumbnail} width="50px" height="50px" />
</div>
        )
       })}
      </IonContent>
    </IonPage>
    
  );
};

export default Tab4;
