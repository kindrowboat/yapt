import React, { useState } from 'react';
import { BreakType } from '../../App';

type SetupBreakProps = {
    startBreak: (description: string, minutes: number, breakType: BreakType)=>void,
    breakType: BreakType,
    suggestedDuration: number,
    cancel: ()=>void,
}

export default function SetupBreak(props : SetupBreakProps) {
    const {startBreak, breakType, suggestedDuration, cancel} = props;

    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(suggestedDuration);

    return(
        <form onSubmit={e => {e.preventDefault(); startBreak(description, duration, breakType)}}>
            <label htmlFor="break-description" accessKey="c">Des<u>c</u>ription:</label>
            <input autoFocus id="break-description" type="text" onChange={(e)=>setDescription(e.target.value)} value={description}/>
            <label htmlFor="pom-duration" accessKey="d"><u>D</u>uration:</label>
            <input id="pom-duration" type="text" onChange={(e)=>setDuration(parseInt(e.target.value) || 0)} value={duration}/>
            <button accessKey="s" type="submit"><u>S</u>tart</button>
            <button accessKey="b" onClick={cancel}><u>B</u>ack</button>
        </form>
    )
}