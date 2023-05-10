import React, {useContext, useEffect, useRef, useState} from 'react';
import { fabric } from 'fabric';
import {IonButton } from '@ionic/react';
import drawing from '../pages/Drawing.module.css';
import {CanvasStore} from "../Store/CanvasStore";
import { ObjProperties } from './ObjProperties';
import 'fabric-history';

const Imagetoolbar = () => {
    const { canvas }:any = useContext(CanvasStore);
    const [isimgInverted  , setimgInverted] = useState(false);
    const {isImageToolbarToggle, setImageToolbarToggle}:any = useContext(CanvasStore);
    const styles = {
        transform: 'rotate(90deg)'
    };


    const  showImageToolbar = () => {
        setImageToolbarToggle(!isImageToolbarToggle)
    }


    const  flipHorizontal = () => {

        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return


        if(canvas.getActiveObject().type != 'activeSelection') {
            if (canvas.getActiveObject().flipX === false) {
                canvas.getActiveObject().set('flipX', true);
            } else {
                canvas.getActiveObject().set('flipX', false);
            }
        }


        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {

                    if (o.flipX === false) {
                        o.set('flipX', true);

                    } else {
                        o.set('flipX', false);

                    }
                }
            })
        }

        canvas.renderAll();
        canvas.fire('object:modified');
    }


    const flipVertical = () => {


        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return

        if(canvas.getActiveObject().type != 'activeSelection') {
            let obj = canvas.getActiveObject()
            if (obj.flipY === false) {
                obj.set('flipY', true);
            } else {
                obj.set('flipY', false);
            }
        }


        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {

                    if (o.flipY === false) {

                        o.set('flipY', true);

                    } else {

                        o.set('flipY', false);

                    }
                }
            })
        }


        canvas.renderAll();
        canvas.fire('object:modified');
    }


    const imgInverted = () =>  {
        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return


        if(canvas.getActiveObject().type != 'activeSelection') {
            let filter:any ;
            if(isimgInverted === false) {

                filter = new fabric.Image.filters.Invert();

                canvas.getActiveObject().filters.push(filter);

                canvas.getActiveObject().applyFilters();
                setimgInverted(true);

            } else {
                canvas.getActiveObject().filters.pop(filter);
                canvas.getActiveObject().applyFilters();
                setimgInverted(false);
            }
        }

        let filtering:any ;

        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {
                    if (isimgInverted === false) {
                        filtering = new fabric.Image.filters.Invert();
                        o.filters.push(filtering);
                        o.applyFilters();

                        setimgInverted(true);

                    } else {
                        o.filters.pop(filtering);
                        o.applyFilters();

                        setimgInverted(false);
                    }
                }
            })
        }
        canvas.renderAll();
    }


    // 👇️ check if user click outside of specific container

    function useOutsideAlerter(ref:any) {
        useEffect(() => {

            function handleClickOutside(event:any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setImageToolbarToggle(false);

                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
        <>
            <div className={drawing.imgToolbarContainer} ref={wrapperRef}>
                    <div className={drawing.toolbar}>
                        <button onClick={flipHorizontal } className={drawing.toolbarButton} color="undefined">
                            <span className={drawing.materialSymbol}>flip</span>
                        </button>
                        <button onClick={flipVertical} className={drawing.toolbarButton} color="undefined">
                            <span style={styles} className={drawing.materialSymbol}>flip</span>
                        </button>
                        <button id="test1" onClick={imgInverted} className={drawing.toolbarButton} color="undefined">
                            <span className={drawing.materialSymbol}>invert_colors</span>
                        </button>
                        <button className={drawing.toolbarButton} onClick={showImageToolbar} color="undefined">
                            <span className={drawing.materialSymbol}>more_horiz</span>
                        </button>
                    </div>
                    {
                        isImageToolbarToggle ?
                            <ObjProperties/>
                        : null
                    }
            </div>
        </>
    );
}

export {  Imagetoolbar };