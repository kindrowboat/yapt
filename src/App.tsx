import React, { ReactElement, useEffect, useState } from 'react';
import './App.css';
import IdleInputs from './components/IdleInputs/index';
import CountdownTimer from './components/CountdownTimer';
import RunningControls from './components/RunningControls';
import Status from './components/Status';

const POM_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;


export enum ActivityType {
  Focus = "focus",
  Break = "break" 
};
export enum DistractionType { 
  Internal = 'internal',
  External = 'external'
};

type Distraction = {
  description: string,
  type: DistractionType
}

export type Activity = {
  start: number,
  scheduledEnd: number;
  end: number | null,
  type: ActivityType,
  goal?: string,
  distractions?: Distraction[],
  tags?: string[]
}

enum CurrentState {
  Idling = 'idling',
  Focusing = 'focusing',
  Relaxing = 'relaxing',
};

function getUnixTime() : number {
  return Math.floor(Date.now() / 1000);
}

function minutesToSeconds(minutes : number) {
  return minutes * 60;
}

function deepCopy<T>(thing: T): T {
  return JSON.parse(JSON.stringify(thing));
}

function prettifyTimes(key : string, value : any) {
  if((key === 'start' || key === 'scheduledEnd' || key === 'end') && value) {
    return (new Date(value * 1000)).toLocaleString();
  }
  return value;
}

let intervalId : undefined | number = undefined;

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentTime, setCurrentTime] = useState(getUnixTime());
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  //load from local storage on page load
  useEffect(()=>{
    const activitiesJson = localStorage.getItem('activities');
    if(activitiesJson) {
      const parsedActivities = JSON.parse(activitiesJson) as Activity[];
      setActivities(parsedActivities);
    }

    const currentActivityJson = localStorage.getItem('currentActivity');
    if(currentActivityJson) {
      const parsedActivity = JSON.parse(currentActivityJson) as Activity;
      setCurrentActivity(parsedActivity);
    }
  }, []);

  //save activities when updated
  useEffect(()=>{
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  //save currentActivity when updated
  useEffect(()=>{
    localStorage.setItem("currentActivity", JSON.stringify(currentActivity));
  }, [currentActivity]);

  let currentState : CurrentState;
  if(currentActivity && currentActivity.end === null){
    switch(currentActivity.type){
      case ActivityType.Focus:
        currentState = CurrentState.Focusing;
        break;
      case ActivityType.Break:
        currentState = CurrentState.Relaxing;
        break;
      default:
        console.error(`Unknown activity type: ${currentActivity.type}`);
        currentState = CurrentState.Idling;
    }
  } else {
    currentState = CurrentState.Idling;
  }

  // set the internal timer
  useEffect(() => {
    if(intervalId === undefined) {
      intervalId = window.setInterval(()=>{
        const newTime = getUnixTime();
        if(newTime > currentTime){
          setCurrentTime(newTime);
        }
      }, 500);
    }
    return () => {
      window.clearInterval(intervalId);
      intervalId = undefined;
    };
  });

  // check that notifications are setup
  const [checkedNotificationPermissions, setCheckedNotificationPermissions] = useState(false);
  useEffect(() => {
    if(!checkedNotificationPermissions) {
      if(Notification.permission !== "granted"){
        Notification.requestPermission();
      }
      setCheckedNotificationPermissions(true);
    }
  });

  //send notification if time has expired
  const [hasNotifiedTimout, setHasNotifiedTimout] = useState(false);
  useEffect(() => {
    if(currentState !== CurrentState.Idling && currentActivity && currentTime > currentActivity.scheduledEnd && !hasNotifiedTimout) {
      new Notification(`${currentActivity.type} time complete`, {requireInteraction: true});
      setHasNotifiedTimout(true);
    }
  });

  //set current activity to focus
  function startFocus(goal: string, tags: string[]){
    const start = getUnixTime();
    const scheduledEnd = start + minutesToSeconds(POM_MINUTES);
    const activity : Activity = {
      start,
      end: null,
      scheduledEnd,
      goal,
      tags,
      type: ActivityType.Focus,
      distractions: []
    }
    setCurrentActivity(activity);
    setHasNotifiedTimout(false);
  }

  //set current activity to a break
  function startBreak(minutes: number){
    const start = getUnixTime();
    const scheduledEnd = start + minutesToSeconds(minutes);
    const activity : Activity = {
      start,
      end: null,
      scheduledEnd,
      type: ActivityType.Break
    }
    setCurrentActivity(activity);
    setHasNotifiedTimout(false);
  }

  function addDistraction(description: string, type: DistractionType) {
    if(!currentActivity) {
      console.error("trying to add a distraction when no activity is in progress");
      return;
    }
    const activityCopy = deepCopy(currentActivity);
    if(!activityCopy.distractions) {
      activityCopy.distractions = [];
    }
    activityCopy.distractions.push({
      description,
      type
    });
    setCurrentActivity(activityCopy);
  }

  function stopActivity(stopTime: number) {
    if(!currentActivity) {
      console.error("trying to stop an activity when no activity is in progress");
      return;
    }
    const activityCopy = deepCopy(currentActivity);
    const activitiesCopy = Array.from(activities);
    activityCopy.end = stopTime;
    activitiesCopy.push(activityCopy);
    setActivities(activitiesCopy);
    setCurrentActivity(null);
  }

  let controls : JSX.Element;
  switch(currentState) {
    case CurrentState.Idling:
      controls = (
        <IdleInputs
          startFocus={startFocus}
          startBreak={startBreak}
          shortBreakMinutes={SHORT_BREAK_MINUTES}
          longBreakMinutes={LONG_BREAK_MINUTES} 
        />
      )
      break;
    case CurrentState.Focusing:
    case CurrentState.Relaxing:
      controls = <RunningControls addDistraction={addDistraction} stopActivity={stopActivity} />
      break;
    default:
      console.error(`Unsupported currentState: ${currentState}`)
      controls = <React.Fragment/>
  }

  let timer : JSX.Element;
  if(currentActivity && currentState != CurrentState.Idling) {
      timer = (<CountdownTimer end={currentActivity.scheduledEnd} current={currentTime}/>);
  } else {
      timer = ( <CountdownTimer end={0} current={0}/> );
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          yapt: yet another pomodoro timer
        </p>
      </header>
      <div className="App-body">
        <Status activity={currentActivity} currentTime={currentTime}/>
        <div className="Timer-controls">
          {timer}
          {controls}
        </div>
        <hr/>
        <h2>Current Activity</h2>
        <pre>
          {JSON.stringify(currentActivity, prettifyTimes, 2)}
        </pre>
        <hr/>
        <h2>Previous Activities</h2>
        <pre>
          {JSON.stringify(Array.from(activities).reverse(), prettifyTimes, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;
