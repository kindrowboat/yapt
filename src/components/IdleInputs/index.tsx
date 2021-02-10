import React, { useEffect, useState } from 'react';
import SetupFocus from './SetupFocus';

enum ScreenState {
  Idle,
  SetupFocus,
}

type IdleInputsProps = {
    startFocus: (description: string, type: string[])=>void,
    startBreak: (duration: number)=>void,
    shortBreakMinutes: number,
    longBreakMinutes: number
}

export default function IdleInputs(props : IdleInputsProps) {
    const {startFocus, startBreak, shortBreakMinutes, longBreakMinutes} = props;
    const [screenState, setScreenState] = useState(ScreenState.Idle);
    switch(screenState){
        case ScreenState.Idle:
            return(
                <React.Fragment>
                    <button onClick={() => setScreenState(ScreenState.SetupFocus)}>Focus</button>
                    <button onClick={() => startBreak(shortBreakMinutes)}>Short Break</button>
                    <button onClick={() => startBreak(longBreakMinutes)}>Long Break</button>
                </React.Fragment>
            );
        case ScreenState.SetupFocus:
            return(
                <SetupFocus startFocus={startFocus} cancel={()=>setScreenState(ScreenState.Idle)} />
            );
        default:
            console.error(`Unknown state for idle inputs: ${screenState}`)
            return(
                <React.Fragment/>
            );
    }
}
