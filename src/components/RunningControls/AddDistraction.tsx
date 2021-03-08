import React, { useState } from 'react';
import { DistractionType } from '../../App';

type AddDistractionProps = {
    addDistraction: (distractionDescription: string, distractionType: DistractionType)=>void,
    cancel: ()=>void,
    defaultDistractionType: DistractionType
}

export default function AddDistraction(props : AddDistractionProps) {
    const {addDistraction, defaultDistractionType, cancel} = props;
    const [selectedDistrictionType, setSelectedDistractionType] = useState(defaultDistractionType);
    const [distractionDescription, setDistractionDescription] = useState("");
    return (
        <form onSubmit={e => {e.preventDefault(); addDistraction(distractionDescription, selectedDistrictionType)}}>
            <label accessKey="d" htmlFor="distraction-description"><u>D</u>istraction description:</label>
            <input autoFocus id="distraction-description" type="text" onChange={e => setDistractionDescription(e.target.value)}/>
            <label accessKey="i">
                <input type="radio" checked={selectedDistrictionType === DistractionType.Internal} onClick={()=>setSelectedDistractionType(DistractionType.Internal)}></input>
                <u>I</u>nternal
            </label>
            <label accessKey="x">
                <input type="radio" checked={selectedDistrictionType === DistractionType.External} onClick={()=>setSelectedDistractionType(DistractionType.External)}></input>
                E<u>x</u>ternal
            </label>
            <button type="submit"><u>A</u>dd</button>
            <button onClick={cancel}><u>B</u>ack</button>
        </form>
    )
}