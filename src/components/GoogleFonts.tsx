import React, {useContext  , useState} from 'react';
import {CanvasStore} from "../Store/CanvasStore";
import drawing from '../pages/Drawing.module.css';

const GoogleFonts = () => {

    const {canvas}:any = useContext(CanvasStore);
    const {isFontToggleAdjust}:any = useContext(CanvasStore);
    const {setFontToggle}:any = useContext(CanvasStore);
    const [fontFamily, setFontFamily]:any = useState(canvas?.getActiveObject()?.fontFamily);

    const arrayFonts = [
        "Acme",
                "Artifika",
                "Comic Neue",
                "Just Another Hand",
                "Black Han Sans",
                "Playball",
                "Poppins",
                "Ultra",
                "Rock Salt",
                "Rubik Wet Paint",
                "Titan One",
                "Luckiest Guy",
                "Creepster",
                "Monoton",
                "Audiowide",
                "Atomic Age",
                "Sigmar One",
                "Black Ops One",
                "Slackey",
                "Rammetto One",
                "Knewave",
                "Rye",
                "Bungee Inline",
                "Rubik Moonrocks",
                "Rampart One",
                "Pirata One",
                "UnifrakturMaguntia",
                "Lemon",
                "Silkscreen",
                "Eater",
                "Vast Shadow",
                "Modak",
                "Coiny",
                "Faster One",
                "Frijole",
                "Gorditas",
                "Ranchers",
                "Climate Crisis",
                "Monofett",
                "Miniver",
                "Plaster",
                "Kavoon",
                "Chicle",
                "Sancreek",
                "Sarina",
                "Offside",
                "Kumar One",
                "Vampiro One",
                "Fascinate",
                "Ewert",
                "Rubik Beastly",
                "Oi"
    ]

    const selectFonts = (event:any) => {
        setFontToggle(false)
        if (canvas.getActiveObject().lockMovementX || canvas.getActiveObject().lockMovementY) return

        if (canvas.getActiveObject().type != 'activeSelection') {
            let activeObj = canvas.getActiveObject();
            activeObj.set('fontFamily', event.target.value);
            setFontFamily(event.target.value);
        }

        if (canvas.getActiveObject().type === 'activeSelection') {
            canvas.getActiveObject()._objects.forEach((o: any) => {
                if (o.lockMovementX == false && o.lockMovementY == false) {
                   o.set('fontFamily', event.target.value);
                }
            })
        }

        canvas.renderAll();
        setFontToggle(false)
    }

    return (
        <>
            <div style={isFontToggleAdjust} id="font-list" className={drawing.fontsList}>
                {
                    arrayFonts.map((font:any) => {
                        return  <button className={drawing.fontOption}
                                    value={font}
                                    style={fontFamily === font ?  {fontFamily: font, background : 'rgba(0, 0, 0, .1)'} : {fontFamily: font}}
                                    onClick={selectFonts} >{font}
                                </button>
                    })
                }
            </div>
        </>
    );
}

export { GoogleFonts };