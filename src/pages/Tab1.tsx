import React, { useContext,useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import useSqlite from '../database';
import { SqllileQueries } from '../queries';

interface Category {
  id: number;
  name: string;
  // Add other properties as needed
}

const Tab1: React.FC = () => {
 
  const { db } = useSqlite();
  const { getCanvases, getCategories, isopen } = SqllileQueries();
  const [categories, setCategories] = useState<Category[]>([]);
  const [canvases, setCanvases] = useState([]);
  useEffect(() => {
    const init = async () => {
      try {
        console.log(isopen)
        if (isopen) {
          categoriesList()
          drawingList()
        }
      } catch (err) {
        console.log(err)
      }
    };
    init();
  }, [isopen])


  const categoriesList = async () => {
    let cat = await getCategories();
    console.log(cat);
    setCategories(cat)
  }
  
  const drawingList = async () => {
    let canvas = await getCanvases();
    console.log(canvas)
    setCanvases(canvas)
    
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
