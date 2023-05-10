import React, {useContext ,   useState , useEffect ,  useRef} from 'react';
import { IonButton } from '@ionic/react';
import { CanvasStore } from "../Store/CanvasStore";
import { GoogleFonts } from "./GoogleFonts";
import { ObjProperties } from './ObjProperties';
import drawing from '../pages/Drawing.module.css';

const Texttoolbar = () => {
    console.log("text toolbar call")
    const { isTextBoxToggle, setTextBoxToggle }:any = useContext(CanvasStore);
    const { isAlignBoxToggle, setAlignBoxToggle } :any= useContext(CanvasStore);
    const { isFontToggle, setFontToggle }:any = useContext(CanvasStore);
    const { isOpacityBold, setOpacityBold }:any = useContext(CanvasStore);
    const { isOpacityItalic, setOpacityItalic }:any = useContext(CanvasStore);
    const { canvas }:any = useContext(CanvasStore);
    const { isAlignToggleAdjust }:any = useContext(CanvasStore);
    const { formatAlignText, setFormatAlignText }:any = useContext(CanvasStore);

    const ref = useRef(null);

    const showFontToggle = () => {
        setFontToggle(!isFontToggle)
        setAlignBoxToggle(false)
        setTextBoxToggle(false);
    }

    const showToggleTextBox = () => {
        setTextBoxToggle(!isTextBoxToggle)
        setAlignBoxToggle(false)
        setFontToggle(false);
    }

    const showAlignTextBox = () => {
        setAlignBoxToggle(!isAlignBoxToggle)
        setTextBoxToggle(false);
        setFontToggle(false);

    }

    const textColorInverted = () => {
        const activeObj = canvas.getActiveObject();
        if(activeObj.fill === 'rgb(0,0,0)') {
            activeObj.set('fill' , 'rgb(255,255,255)');
        } else {
            activeObj.set('fill' , 'rgb(0,0,0)');
        }
        canvas.renderAll();
    }

    const fontBold = () => {

        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return

        if(canvas.getActiveObject().fontWeight == 'bold') {
            setOpacityBold({opacity: 0.2});
            canvas.getActiveObject().set("fontWeight","400");
        } else {
            setOpacityBold({opacity: 1});
            canvas.getActiveObject().set("fontWeight","bold");
        }

        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {
                    if (o.fontWeight == 'bold') {
                        setOpacityBold({opacity: 0.2});
                        o.set("fontWeight", "400");
                    } else {
                        setOpacityBold({opacity: 1});
                        o.set("fontWeight", "bold");
                    }
                }
            })
        }
        canvas.renderAll();
    }

    const fontStyle = () => {

        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return
        if(canvas.getActiveObject().fontStyle == 'italic') {
            setOpacityItalic({opacity: 0.2});
            canvas.getActiveObject().set("fontStyle","normal");
        } else {
            setOpacityItalic({opacity: 1});
            canvas.getActiveObject().set("fontStyle","italic");
        }

        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {
                    if (o.fontStyle == 'italic') {

                        setOpacityItalic({opacity: 0.2});
                        o.set("fontStyle", "normal");
                    } else {
                        setOpacityItalic({opacity: 1});
                        o.set("fontStyle", "italic");
                    }
                }
            })
        }
        canvas.renderAll();

    }

    const alignLeft = () => {
        setAlignBoxToggle(false)
        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return
        let activeObj = canvas.getActiveObject();
        activeObj.set('textAlign', 'left');

        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {
                    o.set('textAlign', 'left');
                }
            })
        }

        canvas.renderAll();
        setAlignBoxToggle(false)
        setFormatAlignText('format_align_left')
    }

    const alignCenter = () => {
        setAlignBoxToggle(false)
        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return
        let activeObj = canvas.getActiveObject();
        activeObj.set('textAlign', 'center');

        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {
                    o.set('textAlign', 'center');
                }
            })
        }

        canvas.renderAll();
        setAlignBoxToggle(false)
        setFormatAlignText('format_align_center')
    }

    const alignRight = () => {
        setAlignBoxToggle(false)
        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return
        let activeObj = canvas.getActiveObject();
        activeObj.set('textAlign', 'right');

        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {
                    o.set('textAlign', 'right');
                }
            })
        }

        canvas.renderAll();
        setAlignBoxToggle(false)
        setFormatAlignText('format_align_right')
    }

    const alignJustify = () => {
        setAlignBoxToggle(false)
        if(canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return
        let activeObj = canvas.getActiveObject();
        activeObj.set('textAlign', 'justify');

        if(canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o:any) => {
                if(o.lockMovementX == false && o.lockMovementY == false) {
                    o.set('textAlign', 'justify');
                }
            })
        }
        canvas.renderAll();
        setAlignBoxToggle(false)
        setFormatAlignText('format_align_justify')
    }


// 👇️ check if user click outside of specific container

    function useOutsideAlerter(ref:any) {
        useEffect(() => {
            function handleClickOutside(event:any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    // console.log(event.target);
                    setAlignBoxToggle(false)
                    setTextBoxToggle(false);
                    setFontToggle(false);
                    // console.log("nill");
                    // canvas.discardActiveObject()
                    // canvas.renderAll()
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
            <div className={drawing.fontsToolbarContainer} ref={wrapperRef}>
                {/*
                <div className={toolbarmodule.toolbarContainer}>
                */}
                    <div className={drawing.toolbar}>
                        {/*
                        <strong className={toolbarmodule.dragArea}>
                            <button class="red" className={ toolbarmodule.dragBtn } color="undefined">
                                <span className={ toolbarmodule.materialSymbol }>drag_indicator</span>
                            </button>
                        </strong>
                        */}
                        <div id="font" className={drawing.fontOptions} onClick={showFontToggle}>
                            <button className={drawing.fontOptionsBtn}>
                                <span style={ {fontFamily : canvas?.getActiveObject()?.fontFamily } }>Font</span>
                                {/*{ canvas?.getActiveObject() ? canvas?.getActiveObject().fontFamily  : 'Font' }*/}
                            </button>
                        </div>
                        <button onClick={fontBold} className={drawing.toolbarButton} color="undefined">
                            <span style={isOpacityBold} className={drawing.materialSymbol}>format_bold</span>
                        </button>
                        <button onClick={fontStyle} className={drawing.toolbarButton} color="undefined">
                            <span style={isOpacityItalic} className={drawing.materialSymbol}>format_italic</span>
                        </button>
                        <button className={drawing.toolbarButton} onClick={showAlignTextBox} color="undefined">
                            <span className={drawing.materialSymbol}>{formatAlignText}</span>
                        </button>
                        <button onClick={textColorInverted} className={drawing.toolbarButton} color="undefined">
                            <span className={drawing.materialSymbol}>invert_colors</span>
                        </button>

                        <button className={drawing.toolbarButton} onClick={showToggleTextBox} color="undefined">
                            <span className={drawing.materialSymbol}>more_horiz</span>
                        </button>
                    </div>
                    {
                        isFontToggle ?
                            < GoogleFonts/>
                        : null
                    }
                    {
                        isTextBoxToggle ?
                            <ObjProperties/>
                        : null
                    }
                    {
                        isAlignBoxToggle ?
                            <div className={drawing.alignOptionsContainer}>
                                <div className={drawing.alignOptions} style={isAlignToggleAdjust}>
                                    <button onClick={alignLeft} className={drawing.toolbarButton} color="undefined">
                                        <span className={drawing.materialSymbol}>format_align_left</span>
                                    </button>
                                    <button onClick={alignCenter} className={drawing.toolbarButton} color="undefined">
                                        <span className={drawing.materialSymbol}>format_align_center</span>
                                    </button>
                                    <button onClick={alignRight} className={drawing.toolbarButton} color="undefined">
                                        <span className={drawing.materialSymbol}>format_align_right</span>
                                    </button>
                                    <button onClick={alignJustify} className={drawing.toolbarButton} color="undefined">
                                        <span className={drawing.materialSymbol}>format_align_justify</span>
                                    </button>
                                </div>
                            </div>
                        : null
                    }
                {/*
                </div>
                */}
            </div>
        </>
    );
}

export {  Texttoolbar };