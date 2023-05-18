import {
    createContext,
    useMemo,
    useState,
} from 'react';
import create from 'zustand/vanilla';
import { subscribeWithSelector } from 'zustand/middleware';


interface Props {

    theme: any;
    setTheme: any;
    setDimension:any;
    canvas:any;
    setCanvas:any;
    baseImage:any;
    setBaseImg:any;
    obj:any;
    isOpacity:any;
    self:any;
    thumbnail:any;
    setThumbnail: any;
    isCanvasDesign: any;
    setCanvasDesign:any;
    OutsideClickHandler:any;

}

export const CanvasStore = createContext<Props |null>(null);

export const useStore = create(subscribeWithSelector(() => ({
    canvasSaving: false,
})));


export function StoreContext({ children }:any) {
    const [dimension, setDimension] = useState({
        width:400,
        height:300
    });
    const [selectedSize, setSelectedSize] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [isToggleAdjust , setToggleAdjust ] = useState({
        top:50
    });
    const [isFontToggleAdjust , setFontToggleAdjust ] = useState({
        top:48
    });
    const [isAlignToggleAdjust , setAlignToggleAdjust ] = useState({
        top:40
    });
    const [isOpacityBold, setOpacityBold] = useState({
        opacity:0.2
    });

    const [isOpacityItalic, setOpacityItalic] = useState({
        opacity:0.2
    });
    const [isFontStyle, setFontStyle] = useState(false);

    const [isCanvasDesign , setCanvasDesign ] = useState(null);
    const [isTitleInput , setTitleInput ] = useState("");
    const [isIdInput , setIdInput ] = useState("");
    const [isDeleteDesign , setDeleteDesign ] = useState(null);
    const [isObjLock, setObjLock] = useState("Lock");
    const [isFontBold, setFontBold] = useState(false);
    const [isTextBoxToggle, setTextBoxToggle] = useState(false);
    const [isAlignBoxToggle, setAlignBoxToggle] = useState(false);
    const [isFontToggle, setFontToggle] = useState(false);
    const [isImageToolbarToggle, setImageToolbarToggle] = useState(false);
    const [isObjLockIcon , setObjLockIcon ] = useState("lock");
    const [formatAlignText , setFormatAlignText ] = useState("format_align_left");
    const [ lockedObj ,setLockedObj  ] = useState(false);
    const [isHide , setHide] =useState(false);
    const [showButtons , setShowButtons] =useState(true);
    const [isColorModeIcon, setColorModeIcon] = useState("dark_mode");

    const canvasProviderValues:any = useMemo(() => ({
        dimension,
        setDimension,
        canvas,
        setCanvas ,
        isToggleAdjust ,
        setToggleAdjust ,
        isCanvasDesign ,
        setCanvasDesign ,
        isTitleInput ,
        setTitleInput,
        isIdInput,
        setIdInput,
        isDeleteDesign,
        setDeleteDesign ,
        isFontToggleAdjust,
        setFontToggleAdjust,
        isAlignToggleAdjust,
        setAlignToggleAdjust ,
        isObjLock ,
        setObjLock ,
        isOpacityBold,
        setOpacityBold ,
        isFontBold ,
        setFontBold,
        isOpacityItalic ,
        setOpacityItalic ,
        isFontStyle ,
        setFontStyle,
        isTextBoxToggle,
        setTextBoxToggle,
        isAlignBoxToggle,
        setAlignBoxToggle,
        isFontToggle,
        setFontToggle,
        isImageToolbarToggle,
        setImageToolbarToggle,
        isObjLockIcon ,
        setObjLockIcon ,
        formatAlignText ,
        setFormatAlignText ,
        lockedObj,
        setLockedObj,
        setHide,
        isHide,
        isColorModeIcon,
        setColorModeIcon,
        showButtons,
        setShowButtons,
        selectedSize,
        setSelectedSize


    }), [
        dimension,
        canvas ,
        isToggleAdjust ,
        isCanvasDesign ,
        isTitleInput ,
        isIdInput,
        isDeleteDesign,
        isFontToggleAdjust,
        isAlignToggleAdjust,
        isObjLock ,
        isOpacityBold ,
        isFontBold ,
        isFontStyle ,
        isOpacityItalic,
        isTextBoxToggle,
        isAlignBoxToggle,
        isFontToggle,
        isImageToolbarToggle,
        isObjLockIcon,
        formatAlignText ,
        lockedObj,
        isHide,
        isColorModeIcon,
        showButtons,
        selectedSize


    ]);

    return (
        <CanvasStore.Provider value={{ ...canvasProviderValues }}>
            { children }
        </CanvasStore.Provider>
    );
}

