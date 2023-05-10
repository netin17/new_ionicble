import React, { useContext, useState } from 'react';
import { CanvasStore } from "../Store/CanvasStore";
import drawing from '../pages/Drawing.module.css';

const ObjProperties = () => {
    const { canvas }:any = useContext(CanvasStore);
    const { isToggleAdjust, setToggleAdjust }:any = useContext(CanvasStore);
    const { isObjLock, setObjLock }:any = useContext(CanvasStore);
    const { isObjLockIcon, setObjLockIcon }:any = useContext(CanvasStore);
    const { setTextBoxToggle }:any = useContext(CanvasStore);
    const { isImageToolbarToggle, setImageToolbarToggle }:any = useContext(CanvasStore);
    const { lockedObj, setLockedObj } :any = useContext(CanvasStore);


    const objectClone = () => {

        setTextBoxToggle(false)
        setImageToolbarToggle(false)
        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return

        let cloned = canvas.getActiveObject()

        // clone again, so you can do multiple copies.
        cloned.clone(function(clonedObj:any) {
            canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 15,
                top: clonedObj.top + 15,

                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = canvas;
                clonedObj.forEachObject(function(obj:any) {
                    canvas.add(obj);
                });
                // this should solve the unselectability
                clonedObj.setCoords();
            } else {
                canvas.add(clonedObj);
            }
            clonedObj.top += 15;
            clonedObj.left += 15;

            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
        });



        setTextBoxToggle(false)
        setImageToolbarToggle(false)
    }






    const objectDelete = () => {

        canvas.getActiveObjects().forEach((obj:any) => {
            canvas.remove(obj)
        });
        canvas.discardActiveObject().renderAll()
        setTextBoxToggle(false)
        setImageToolbarToggle(false)
    }

  const objectLock = () => {

      let activeObject = canvas.getActiveObject();
      if(activeObject.lockMovementX && activeObject.lockMovementY ) {

          activeObject.set({isLocked:false})

          activeObject.set({lockMovementX: false, lockMovementY: false, editable:true , hasControls: true, borderDashArray: [0]})


          setObjLock("Lock");
          setObjLockIcon("lock")


      }else{
          activeObject.set({isLocked:true})
          activeObject.set({lockMovementX: true, lockMovementY: true ,editable:false , hasControls:false , borderDashArray:[3]})

          setObjLock("UnLock");
          setObjLockIcon("lock_open")


      }


      canvas.renderAll();
      setTextBoxToggle(false)
      setImageToolbarToggle(false)


      activeObject._objects.forEach((o:any) => {

          if(o.lockMovementX && o.lockMovementY ) {
              setLockedObj(true)
              o.set({lockMovementX: false, lockMovementY: false, editable:true , hasControls: true, borderDashArray: [0]})
              activeObject.set({lockMovementX: false, lockMovementY: false, editable:true , hasControls: true, borderDashArray: [0]})

          } else{

              setLockedObj(false)
              o.set({lockMovementX: true, lockMovementY: true ,  editable:false , hasControls:false , borderDashArray:[3]})
              activeObject.set({lockMovementX: true, lockMovementY: true ,  editable:false , hasControls:false , borderDashArray:[3]})

          }
      })


      canvas.renderAll();
      setTextBoxToggle(false)
      setImageToolbarToggle(false)
  }

    const bringToFronts = () => {
        setTextBoxToggle(false)
        setImageToolbarToggle(false)
        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return

        if(canvas.getActiveObject().type != 'activeSelection') {
            canvas.getActiveObject().bringToFront()

        }

        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {

                if(o.lockMovementX == false && o.lockMovementY == false) {

                    canvas.bringToFront(o)
                }
            })
        }

        canvas.discardActiveObject().renderAll()
        setTextBoxToggle(false)
        setImageToolbarToggle(false)
    }


    const sendToBacks = () => {
        setTextBoxToggle(false)
        setImageToolbarToggle(false)
        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return


        if(canvas.getActiveObject().type != 'activeSelection') {
            canvas.getActiveObject().sendToBack()

        }




        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {

                    canvas.sendToBack(o)
                }
            })
        }

        canvas.discardActiveObject().renderAll()
        setTextBoxToggle(false)
        setImageToolbarToggle(false)
    }






    return (
        <>
            <div className={drawing.optionsContainer} style={isToggleAdjust}>
                <button onClick={objectClone} className={drawing.optionsOption} color="undefined">
                    <span className={drawing.materialSymbol}>content_copy</span>
                    Duplicate
                </button>
                <button onClick={objectLock} className={drawing.optionsOption} color="undefined">
                    <span className={drawing.materialSymbol}>{isObjLockIcon}</span>
                    {isObjLock}
                </button>
                <button onClick={bringToFronts} className={drawing.optionsOption} color="undefined">
                    <span className={drawing.materialSymbol}>move_up</span>
                    Bring to front
                </button>
                <button onClick={sendToBacks} className={drawing.optionsOption} color="undefined">
                    <span className={drawing.materialSymbol}>move_down</span>
                    Send to back
                </button>
                <button onClick={objectDelete} className={drawing.optionsOption} color="undefined">
                    <span className={drawing.materialSymbol}>delete</span>
                    Delete
                </button>
            </div>
        </>
    );

}
export { ObjProperties };