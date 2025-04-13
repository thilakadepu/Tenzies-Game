import React from "react";

export default function MessageOrTimer({ gameWon, rollCount}) {
  const [seconds, setSeconds] = React.useState(0);
  const intervalRef = React.useRef(null);
  const [completedTime, setCompletedTime] = React.useState(null);

  React.useEffect(() => {
    if (!gameWon) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setSeconds(prev => prev + 1);
        }, 1000);
      }
      setCompletedTime(null);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCompletedTime(seconds);
      setSeconds(0)
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [gameWon]);

  const formatTime = (secs) => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, '0');
    const seconds = String(secs % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  const completedInSecondsElement = <p className="instructions completed-time">Completed in {rollCount} rolls in {completedTime} seconds!</p>
  const rollCountAndTimer = <div className="roll-count-timer-container">
    <p className="instructions roll-count">Rolls : {rollCount}</p>
    <p className="instructions timer">{formatTime(seconds)}</p>
  </div>

  return (
    gameWon && completedTime !== null ?  completedInSecondsElement : rollCountAndTimer
  )
}