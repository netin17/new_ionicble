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
  IonCheckbox
} from '@ionic/react';
import useSqlite from '../database';
import { OverlayEventDetail } from '@ionic/core/components';
import { SqllileQueries } from '../queries';
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

  const { db } = useSqlite();
  const { insertCategory, getCategories, isopen } = SqllileQueries();

  useEffect(() => {
    const init = async () => {
      try {
        console.log(isopen)
        if (isopen) {
          categoriesList()
        }
      } catch (err) {
        console.log(err)
      }
    };
    init();
  }, [isopen])

  const categoriesList = async () => {
    let cat = await getCategories();
    setCategories(cat)
  }

  const confirm = () => {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  const onWillDismiss = async (ev: CustomEvent<OverlayEventDetail>) => {
    if (ev.detail.role === 'confirm') {
      await insertCategory(ev.detail.data)
      categoriesList()
    }
  }
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
      <IonList>
        {categories?.map((cat, index) => {
          return (
            <IonItem>
              <IonCheckbox
                value={cat.name}
                checked={selectedCategories.includes(cat.name)}
                onIonChange={(e) => handleCheckboxChange(e, cat.name)}
                slot="start"><IonLabel>{cat.name}</IonLabel></IonCheckbox>
            </IonItem>
          )
        })}
      </IonList>
      +<IonButton id="open-modal" expand="block"> Add New</IonButton>
      <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
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