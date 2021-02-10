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
    
    function handleStopActivity() {
        const stopTime = Date.parse(stopTimeString);
        if(stopTime) {
            stopActivity(Math.floor(stopTime / 1000));
        } else {
            setStopTimeString((new Date()).toLocaleString());
        }
    }

    switch(screenState) {
        case ScreenState.Default:
            return(
                <React.Fragment>
                    <button onClick={()=>setScreenState(ScreenState.AddingDistraction)}>Add Distraction</button>
                    <button
                      onClick={()=>{setScreenState(ScreenState.StoppingActivity); setStopTimeString((new Date()).toLocaleString())}}>
                      End Activity
                    </button>
                </React.Fragment>
            );
        case ScreenState.AddingDistraction:
            return(
                <React.Fragment>
                    <input type="text" placeholder="Distraction description..." onChange={(e)=>setDistractionDescription(e.target.value)} value={distractionDescription}/>
                    <label><input type="radio" value={DistractionType.Internal} checked={distractionType === DistractionType.Internal} onChange={()=>setDistractionType(DistractionType.Internal)}/>Internal</label>
                    <label><input type="radio" value={DistractionType.External} checked={distractionType === DistractionType.External} onChange={()=>setDistractionType(DistractionType.External)}/>External</label>
                    <button 
                    onClick={()=>{addDistraction(distractionDescription, distractionType); setScreenState(ScreenState.Default)}}>
                    Add
                    </button>
                    <button onClick={()=>setScreenState(ScreenState.Default)}>Back</button>
                </React.Fragment>
            );
        case ScreenState.StoppingActivity:
            return(
                <React.Fragment>
                    <input type="text" placeholder="Stop time..." value={stopTimeString} onChange={e=>setStopTimeString(e.target.value)}/>
                    <button onClick={()=>handleStopActivity()}>Confirm</button>
                    <button onClick={()=>setScreenState(ScreenState.Default)}>Back</button>
                </React.Fragment>
            )
    }
}
