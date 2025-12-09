import { useState, useEffect, useRef } from "react";
import styles from "./CSS/Timer.module.css";

export default function Timer() {
  const [time, setTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [breaks, setBreaks] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const workIntervalRef = useRef(null);
  const breakIntervalRef = useRef(null);
  const workStartTimestamp = useRef(null);
  const breakStartTimestamp = useRef(null);
  const accumulatedWorkTime = useRef(0);
  const accumulatedBreakTime = useRef(0);

  useEffect(() => {
    if (isRunning && !isOnBreak) {
      if (!workStartTimestamp.current) {
        workStartTimestamp.current = Date.now();
      }
      workIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - workStartTimestamp.current;
        setTime(accumulatedWorkTime.current + elapsed);
      }, 10);
    } else {
      if (workStartTimestamp.current) {
        const elapsed = Date.now() - workStartTimestamp.current;
        accumulatedWorkTime.current += elapsed;
        workStartTimestamp.current = null;
      }
      clearInterval(workIntervalRef.current);
    }

    return () => clearInterval(workIntervalRef.current);
  }, [isRunning, isOnBreak]);

  useEffect(() => {
    if (isOnBreak) {
      if (!breakStartTimestamp.current) {
        breakStartTimestamp.current = Date.now();
      }
      breakIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - breakStartTimestamp.current;
        const newBreakTime = accumulatedBreakTime.current + elapsed;
        if (newBreakTime >= time) {
          handlePause();
          setBreakTime(time);
        } else {
          setBreakTime(newBreakTime);
        }
      }, 10);
    } else {
      if (breakStartTimestamp.current) {
        const elapsed = Date.now() - breakStartTimestamp.current;
        accumulatedBreakTime.current += elapsed;
        breakStartTimestamp.current = null;
      }
      clearInterval(breakIntervalRef.current);
    }

    return () => clearInterval(breakIntervalRef.current);
  }, [isOnBreak, time]);

  const handleStart = () => {
    if (!isRunning && !startTime) {
      const now = new Date();
      setStartTime(now.toLocaleTimeString());
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsOnBreak(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsOnBreak(false);
    setTime(0);
    setBreakTime(0);
    setStartTime(null);
    setBreaks([]);
    workStartTimestamp.current = null;
    breakStartTimestamp.current = null;
    accumulatedWorkTime.current = 0;
    accumulatedBreakTime.current = 0;
    clearInterval(workIntervalRef.current);
    clearInterval(breakIntervalRef.current);
  };

  const handleBreak = () => {
    if (isRunning) {
      if (isOnBreak) {
        const breakStart = breaks[breaks.length - 1]?.start || 0;
        const breakDuration = breakTime - breakStart;
        setBreaks((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            end: breakTime,
            duration: breakDuration,
          };
          return updated;
        });
        setIsOnBreak(false);
      } else {
        setBreaks((prev) => [
          ...prev,
          {
            id: Date.now(),
            start: breakTime,
            workTime: time,
            end: null,
            duration: 0,
          },
        ]);
        setIsOnBreak(true);
      }
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const stopwatchContent = (
    <>
      <h2 className={styles.title}>Stopwatch</h2>

      {startTime && (
        <div className={styles.startInfo}>Started at: {startTime}</div>
      )}

      <div className={styles.display}>
        <div className={styles.timeDisplay}>{formatTime(time)}</div>
        <div className={styles.label}>Work Time</div>
      </div>

      <div className={styles.breakDisplay}>
        <div className={styles.breakTime}>{formatTime(breakTime)}</div>
        <div className={styles.label}>
          {isOnBreak ? "On Break" : "Total Break Time"}
        </div>
      </div>

      {breakTime >= time && time > 0 && (
        <div className={styles.warning}>
          Break time has reached work time - Paused!
        </div>
      )}

      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.startBtn}`}
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          className={`${styles.btn} ${styles.pauseBtn}`}
          onClick={handlePause}
          disabled={!isRunning}
        >
          Pause
        </button>
        <button
          className={`${styles.btn} ${styles.breakBtn} ${
            isOnBreak ? styles.activeBreak : ""
          }`}
          onClick={handleBreak}
          disabled={!isRunning}
        >
          {isOnBreak ? "End Break" : "Start Break"}
        </button>
        <button
          className={`${styles.btn} ${styles.resetBtn}`}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {breaks.length > 0 && (
        <div className={styles.breaksList}>
          <h3 className={styles.breaksTitle}>Break History</h3>
          <div className={styles.breaksContainer}>
            {breaks.map((brk, index) => (
              <div key={brk.id} className={styles.breakItem}>
                <span className={styles.breakNumber}>Break {index + 1}</span>
                <span className={styles.breakDetail}>
                  Work: {formatTime(brk.workTime)}
                </span>
                <span className={styles.breakDetail}>
                  Duration: {formatTime(brk.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        className={styles.openTimerBtn}
        onClick={() => setIsFullscreen(true)}
      >
        <i className="bi bi-stopwatch"></i>
      </button>

      {isFullscreen && (
        <div className={styles.fullscreenOverlay}>
          <div className={styles.fullscreenContent}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsFullscreen(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <div className={styles.stopwatch}>{stopwatchContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
