import React, { useState, useRef, useEffect } from 'react';
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonCheckbox,
  useIonToast
} from '@ionic/react';
//import useSqlite from '../database';
import { OverlayEventDetail } from '@ionic/core/components';
import { SqllileQueries } from '../queries';
import cate from './Categories.module.css'

import { App } from '@capacitor/app';
interface Category {
  id: number;
  name: string;
  // Add other properties as needed
}
type CheckboxChangeEventDetail = {
  checked: boolean;
  value: any;
};
interface CategoriesProps {
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
}
const Categories: React.FC<CategoriesProps> = ({setSelectedCategories, selectedCategories}) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const { db } = useSqlite();
  const { insertCategory, getCategories, isopen } = SqllileQueries();
  const [presents] = useIonToast();

  useEffect(() => {
    const init = async () => {
      try {
        console.log(isopen)
        if (isopen) {
          categoriesList();
          setIsModalOpen(false);
        }
      } catch (err) {
        console.log(err)
      }
    };
    init();
  }, [isopen])

  App.addListener('backButton', ({ canGoBack }) => {
    if(canGoBack){
      setIsModalOpen(false);
    } 
  });

  const categoriesList = async () => {
    let cat = await getCategories();
    console.log(JSON.stringify(setCategories(cat['values'])));
    setCategories(cat['values'])
  }


  const confirm = () => {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  const cancel = () => {
    modal.current?.dismiss();
    setIsModalOpen(false);
  }



  const onWillDismiss = async (ev: CustomEvent<OverlayEventDetail>) => {
    
    if (ev.detail.role === 'confirm') {

      if(ev.detail.data){

        await insertCategory(ev.detail.data)
        await categoriesList()
        setIsModalOpen(false)
      }else{

        presentToast('top','Kindly enter the category name.')
        setIsModalOpen(false)
      }
      
    }
  }

  const presentToast = (position:any, message:any) => {
    presents({
        message: message,
        duration: 1500,
        position: position
    });
  };

  const handleCheckboxChange = (e: CustomEvent<CheckboxChangeEventDetail>, category: string) => {
    const isChecked = e.detail.checked;

    // Update the selected categories based on the checkbox state
    if (isChecked) {
      setSelectedCategories((prevSelected: string[]) => [...prevSelected, category.toString()]);
    } else {
      setSelectedCategories((prevSelected: string[]) => prevSelected.filter((cat) => cat !== category));
    }
  };


  return (
    <IonContent className="ion-padding">
      <IonTitle>Categories</IonTitle>
      <IonList className='cate_lists'>
        {categories?.map((cat, index) => {
          return (
            <IonItem key={index}>
           <IonLabel className={cate.label}>   <IonCheckbox
                value={cat.name}
                checked={selectedCategories.includes(cat.name)}
                onIonChange={(e) => handleCheckboxChange(e, cat.name)}
                slot="start"></IonCheckbox> {cat.name}</IonLabel>
            </IonItem>
          )
        })}
      </IonList>
      <IonButton onClick={() => setIsModalOpen(true)} expand="block"> Add New</IonButton>
      <IonModal ref={modal} isOpen={isModalOpen} onWillDismiss={(ev) => onWillDismiss(ev)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => cancel()}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Welcome</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => confirm()}>
                Confirm
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="stacked">Enter name</IonLabel>
            <IonInput ref={input} type="text" placeholder="Your name" />
          </IonItem>
        </IonContent>
      </IonModal>
    </IonContent>
  )
}


export default Categories;