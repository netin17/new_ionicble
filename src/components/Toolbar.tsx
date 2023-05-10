import React, {useContext , useEffect , useState} from 'react';
import {Toolbarmodule} from "./Toolbarmodule";
import {CanvasStore} from "../Store/CanvasStore";
import {fabric} from "fabric";


const Toolbar = () => {
    return (
        <>
            <Toolbarmodule/>
        </>
    );

}

export { Toolbar };