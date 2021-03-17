import React, { useEffect, useState } from 'react';
import { Activity, ActivityType } from '../App';
import { formatTimeRemaining } from './CountdownTimer';
import './Status.css';

type StatusProps = {
    activity: Activity | null
    currentTime: number
}

let favicon = "";
function updateFavicon(emoji : string) {
    if (favicon !== emoji) {
        favicon = emoji;
        const iconLink = document.querySelector<HTMLLinkElement>("link[rel=icon]");
        if (iconLink) {
            iconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${favicon}</text></svg>`
        } else {
            console.error("Could not find favicon link tag");
        }
    }
}

let title = "";
function updateTitle(newTitle : string) {
    if (newTitle !== title) {
        title = newTitle;
        document.title = newTitle;
    }
}

export default function Status(props : StatusProps) {
    const {activity, currentTime} = props;

    let icon = "";
    if(activity === null) {
        icon = "💤";
    } else if(activity.scheduledEnd > currentTime) {
        icon = activity.type === ActivityType.Focus ? "🤔" : "😎";
    } else {
        icon = "⌛";
    }

    let status = "";
    if(activity === null) {
        status = "Idling..."
    } else if(activity.type === ActivityType.Break) {
        status = "Relaxing..."
    } else if(activity.type === ActivityType.Focus) {
        status = `Focusing on ${activity.goal}...`
    }

    let timeRemaining = "";
    if(activity !== null) {
        timeRemaining = `${formatTimeRemaining(activity.scheduledEnd - currentTime)} `
    }

    updateFavicon(icon);
    updateTitle(`${timeRemaining}${status}`);
    return(
        <h1 className="Status">{`${icon} ${status}`}</h1>
    );
}