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
                    <button autoFocus accessKey="o" onClick={() => setScreenState(ScreenState.SetupFocus)}>F<u>o</u>cus</button>
                    <button accessKey="s" onClick={() => startBreak(shortBreakMinutes)}><u>S</u>hort Break</button>
                    <button accessKey="l" onClick={() => startBreak(longBreakMinutes)}><u>L</u>ong Break</button>
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
