import React, { useEffect, useState } from 'react';
import { DistractionType } from '../../App';

type RunningControlsProps = {
    addDistraction: (description: string, type: DistractionType)=>void,
    stopActivity: (time: number)=>void
}

enum ScreenState {
    Default,
    AddingDistraction,
    StoppingActivity
}

function getCurrentTime() {
    return Math.floor(Date.now() / 1000 );
}

export default function RunningControls(props : RunningControlsProps){
    const {addDistraction, stopActivity} = props;

    const [screenState, setScreenState] = useState(ScreenState.Default);

    const [distractionDescription, setDistractionDescription] = useState("");
    const [distractionType, setDistractionType] = useState(DistractionType.Internal);

    const [stopTimeString, setStopTimeString] = useState("");
    
    function handleStopActivity(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const stopTime = Date.parse(stopTimeString);
        debugger;
        if(stopTime) {
            stopActivity(Math.floor(stopTime / 1000));
        } else {
            setStopTimeString((new Date()).toLocaleString());
        }
    }

    function handleAddDistraction(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        addDistraction(distractionDescription, distractionType);
        setDistractionDescription("");
        setDistractionType(DistractionType.Internal);
        setScreenState(ScreenState.Default);
    }

    switch(screenState) {
        case ScreenState.Default:
            return(
                <React.Fragment>
                    <button autoFocus accessKey="a" onClick={()=>setScreenState(ScreenState.AddingDistraction)}><u>A</u>dd Distraction</button>
                    <button
                      accessKey="n"
                      onClick={()=>{setScreenState(ScreenState.StoppingActivity); setStopTimeString((new Date()).toLocaleString())}}>
                      E<u>n</u>d Activity
                    </button>
                </React.Fragment>
            );
        case ScreenState.AddingDistraction:
            return(
                <form onSubmit={handleAddDistraction}>
                    <input autoFocus type="text" placeholder="Distraction description..." onChange={(e)=>setDistractionDescription(e.target.value)} value={distractionDescription}/>
                    <label accessKey="i"><input type="radio" value={DistractionType.Internal} checked={distractionType === DistractionType.Internal} onChange={()=>setDistractionType(DistractionType.Internal)}/><u>I</u>nternal</label>
                    <label accessKey="x"><input type="radio" value={DistractionType.External} checked={distractionType === DistractionType.External} onChange={()=>setDistractionType(DistractionType.External)}/>E<u>x</u>ternal</label>
                    <button accessKey="a" type="submit"><u>A</u>dd</button>
                    <button accessKey="b" onClick={()=>setScreenState(ScreenState.Default)}><u>B</u>ack</button>
                </form>
            );
        case ScreenState.StoppingActivity:
            return(
                <form onSubmit={handleStopActivity}>
                    <input autoFocus type="text" placeholder="Stop time..." value={stopTimeString} onChange={e=>setStopTimeString(e.target.value)}/>
                    <button accessKey="c" type="submit"><u>C</u>onfirm</button>
                    <button accessKey="b" onClick={()=>setScreenState(ScreenState.Default)}><u>B</u>ack</button>
                </form>
            )
    }
}
