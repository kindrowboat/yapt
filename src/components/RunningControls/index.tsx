import React, { useEffect, useState } from 'react';
import { DistractionType } from '../../App';
import AddDistraction from './AddDistraction';

type RunningControlsProps = {
    addDistraction: (description: string, type: DistractionType)=>void,
    stopActivity: (time: number)=>void,
    defaultDistractionType: DistractionType,
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
    const {addDistraction, stopActivity, defaultDistractionType} = props;

    const [screenState, setScreenState] = useState(ScreenState.Default);

    const [stopTimeString, setStopTimeString] = useState("");
    
    function handleStopActivity(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const stopTime = Date.parse(stopTimeString);
        if(stopTime) {
            stopActivity(Math.floor(stopTime / 1000));
        } else {
            setStopTimeString((new Date()).toLocaleString());
        }
    }

    function handleAddDistraction(distractionDescription: string, distractionType: DistractionType) {
        addDistraction(distractionDescription, distractionType);
        setScreenState(ScreenState.Default);
    }

    switch(screenState) {
        case ScreenState.Default:
            return(
                <React.Fragment>
                    <button autoFocus accessKey="d" onClick={()=>setScreenState(ScreenState.AddingDistraction)}>A<u>d</u>d Distraction</button>
                    <button
                      accessKey="n"
                      onClick={()=>{setScreenState(ScreenState.StoppingActivity); setStopTimeString((new Date()).toLocaleString())}}>
                      E<u>n</u>d Activity
                    </button>
                </React.Fragment>
            );
        case ScreenState.AddingDistraction:
            return(
                <AddDistraction
                  addDistraction={handleAddDistraction}
                  cancel={()=>setScreenState(ScreenState.Default)}
                  defaultDistractionType={defaultDistractionType}/>
            );
        case ScreenState.StoppingActivity:
            return(
                <form onSubmit={handleStopActivity}>
                    <label htmlFor="stopTime" accessKey="t">S<u>t</u>op time:</label>
                    <input autoFocus id="stopTime" type="text" placeholder="Stop time..." value={stopTimeString} onChange={e=>setStopTimeString(e.target.value)}/>
                    <button accessKey="c" type="submit"><u>C</u>onfirm</button>
                    <button accessKey="b" onClick={()=>setScreenState(ScreenState.Default)}><u>B</u>ack</button>
                </form>
            )
    }
}
