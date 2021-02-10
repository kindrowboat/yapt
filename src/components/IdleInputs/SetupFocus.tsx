import React, { useEffect, useState } from 'react';

type SetupFocusProps = {
    startFocus: (description: string, type: string[])=>void,
    cancel: ()=>void
}

enum Type{
    Personal = "personal",
    Work = "work"
}

export default function SetupFocus(props : SetupFocusProps) {
    const [goal, setGoal] = useState("");
    const [type, setType] = useState(Type.Work);

    return(
        <React.Fragment>
            <input type="text" placeholder="Goal" onChange={(e)=>setGoal(e.target.value)} value={goal}/>
            <label><input type="Radio" value={Type.Personal} checked={type === Type.Personal} onChange={()=>{setType(Type.Personal)}}/>Personal</label>
            <label><input type="Radio" value={Type.Work} checked={type === Type.Work} onChange={()=>{setType(Type.Work)}}/>Work</label>
            <button onClick={()=>props.startFocus(goal, [type])}>Start</button>
            <button onClick={props.cancel}>Back</button>
        </React.Fragment>
    )
}