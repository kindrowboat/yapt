import React, { useEffect, useState } from 'react';
import { FocusType } from '../../App';

type SetupFocusProps = {
    startFocus: (description: string, duraction: number, type: string[])=>void,
    cancel: ()=>void,
    defaultFocusType: FocusType
}

export default function SetupFocus(props : SetupFocusProps) {
    const {startFocus, cancel, defaultFocusType} = props;

    const [goal, setGoal] = useState("");
    const [duration, setDuration] = useState(25);
    const [type, setType] = useState(defaultFocusType);

    function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        startFocus(goal, duration, [type])
    }

    return(
        <form onSubmit={e => handleSubmit(e)}>
            <label htmlFor="pomGoal" accessKey="g"><u>G</u>oal:</label>
            <input autoFocus id="pomGoal" type="text" onChange={(e)=>setGoal(e.target.value)} value={goal}/>
            <label htmlFor="pomDuration" accessKey="d"><u>D</u>uration:</label>
            <input id="pomDuration" type="text" onChange={(e)=>setDuration(parseInt(e.target.value) || 0)} value={duration}/>
            <label accessKey="p"><input type="Radio" value={FocusType.Personal} checked={type === FocusType.Personal} onChange={()=>{setType(FocusType.Personal)}}/><u>P</u>ersonal</label>
            <label accessKey="o"><input type="Radio" value={FocusType.Work} checked={type === FocusType.Work} onChange={()=>{setType(FocusType.Work)}}/>W<u>o</u>rk</label>
            <button accessKey="s" type="submit"><u>S</u>tart</button>
            <button accessKey="b" onClick={cancel}><u>B</u>ack</button>
        </form>
    )
}