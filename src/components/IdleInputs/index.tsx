import React, { useEffect, useState } from 'react';
import SetupFocus from './SetupFocus';

enum ScreenState {
  Idle,
  SetupFocus,
  SetupBreak,
}

type IdleInputsProps = {
    startFocus: (description: string, type: string[])=>void,
    startBreak: (duration: number)=>void
}

export default function IdleInputs(props : IdleInputsProps) {
    const [screenState, setScreenState] = useState(ScreenState.Idle);
    switch(screenState){
        case ScreenState.Idle:
            return(
                <React.Fragment>
                    <button onClick={()=>setScreenState(ScreenState.SetupFocus)}>Focus</button>
                    <button onClick={()=>setScreenState(ScreenState.SetupBreak)}>Break</button>
                </React.Fragment>
            );
        case ScreenState.SetupFocus:
            return(
                <SetupFocus startFocus={props.startFocus} cancel={()=>setScreenState(ScreenState.Idle)} />
            );
            break;
        default:
            console.error(`Unknown state for idle inputs: ${screenState}`)
            return(
                <React.Fragment/>
            );
    }
}