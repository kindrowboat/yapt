import React, { useEffect, useState } from 'react';
import SetupFocus from './SetupFocus';
import SetupBreak from './SetupBreak';
import { BreakType, FocusType } from '../../App';

enum ScreenState {
  Idle,
  SetupFocus,
  SetupBreak,
}

type IdleInputsProps = {
    startFocus: (description: string, duration: number, type: string[])=>void,
    startBreak: (description: string, duration: number, breakType: BreakType)=>void,
    shortBreakMinutes: number,
    longBreakMinutes: number,
    defaultFocusType: FocusType
}

export default function IdleInputs(props : IdleInputsProps) {
    const {startFocus, startBreak, defaultFocusType, shortBreakMinutes, longBreakMinutes} = props;
    const [screenState, setScreenState] = useState(ScreenState.Idle);
    const [suggestedBreakDuration, setSuggestedBreakDuration] = useState(0);
    const [selectedBreakType, setSelectedBreakType] = useState(BreakType.Short);

    function setupBreak(suggestedDuration : number, breakType: BreakType) {
        setSuggestedBreakDuration(suggestedDuration);
        setSelectedBreakType(breakType);
        setScreenState(ScreenState.SetupBreak);
    }

    switch(screenState){
        case ScreenState.Idle:
            return(
                <React.Fragment>
                    <button autoFocus accessKey="o" onClick={() => setScreenState(ScreenState.SetupFocus)}>F<u>o</u>cus</button>
                    <button accessKey="h" onClick={() => setupBreak(shortBreakMinutes, BreakType.Short)}>S<u>h</u>ort Break</button>
                    <button accessKey="l" onClick={() => setupBreak(longBreakMinutes, BreakType.Long)}><u>L</u>ong Break</button>
                </React.Fragment>
            );
        case ScreenState.SetupFocus:
            return(
                <SetupFocus startFocus={startFocus} defaultFocusType={defaultFocusType} cancel={()=>setScreenState(ScreenState.Idle)} />
            );
        case ScreenState.SetupBreak:
            return(
                <SetupBreak startBreak={startBreak} breakType={selectedBreakType} suggestedDuration={suggestedBreakDuration} cancel={()=>setScreenState(ScreenState.Idle)} />
            );
        default:
            console.error(`Unknown state for idle inputs: ${screenState}`)
            return(
                <React.Fragment/>
            );
    }
}
