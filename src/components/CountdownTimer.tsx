import React, { useEffect, useState } from 'react';

type CountdownTimerProps = {
    end : number,
    current : number
}

function formatTimeRemaining(totalSecondsRemaining : number) {
    const pastDue = totalSecondsRemaining < 0;
    totalSecondsRemaining = Math.abs(totalSecondsRemaining);
    const minutesRemaining = Math.floor(totalSecondsRemaining / 60);
    const secondsRemaining = totalSecondsRemaining % 60;
    const paddedMinutesRemaining = minutesRemaining < 10 ? ("0" + minutesRemaining) : ("" + minutesRemaining);
    const paddedSecondsRemaining = secondsRemaining < 10 ? ("0" + secondsRemaining) : ("" + secondsRemaining);
    return `${pastDue ? "-" : ""}${paddedMinutesRemaining}:${paddedSecondsRemaining}`;
}

export default function CountdownTimer(props : CountdownTimerProps) {
    const {end, current} = props;
    const timeRemaining = formatTimeRemaining(end - current);
    return (
        <pre>
            {timeRemaining}
        </pre>
    )
}