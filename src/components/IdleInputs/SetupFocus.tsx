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

    function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        props.startFocus(goal, [type])
    }

    return(
        <form onSubmit={e => handleSubmit(e)}>
            <input autoFocus type="text" placeholder="Goal" onChange={(e)=>setGoal(e.target.value)} value={goal}/>
            <label accessKey="p"><input type="Radio" value={Type.Personal} checked={type === Type.Personal} onChange={()=>{setType(Type.Personal)}}/><u>P</u>ersonal</label>
            <label accessKey="o"><input type="Radio" value={Type.Work} checked={type === Type.Work} onChange={()=>{setType(Type.Work)}}/>W<u>o</u>rk</label>
            <button accessKey="s" type="submit"><u>S</u>tart</button>
            <button accessKey="b" onClick={props.cancel}><u>B</u>ack</button>
        </form>
    )
}