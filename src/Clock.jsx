import { useEffect, useRef } from "react";
import styles from "./CSS/Clock.module.css";

export default function Clock() {
  const timeRef = useRef(null);
  const dateRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const radius = 115;

    function updateDate() {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      dateRef.current.textContent = now.toLocaleDateString(undefined, options);
    }

    function updateClock() {
      const now = new Date();
      let hours = now.getHours() % 12;
      hours = hours || 12;
      hours = String(hours).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      timeRef.current.textContent = `${hours}:${minutes}`;
      dotRef.current.querySelector(`.${styles.tooltip}`).textContent = String(
        now.getSeconds()
      ).padStart(2, "0");

      updateDate();

      const deg = (seconds / 60) * 360;
      const rad = (deg * Math.PI) / 180;

      dotRef.current.style.transform = `translate(
        ${radius * Math.sin(rad)}px,
        ${-radius * Math.cos(rad)}px
      )`;

      requestAnimationFrame(updateClock);
    }

    updateClock();
  }, []);

  return (
    <div className={styles.clockContainer}>
      <div className={styles.hoursMinutes} ref={timeRef}>
        00:00
      </div>
      <h6 ref={dateRef} className={styles.date}></h6>

      <div ref={dotRef} className={styles.dot}>
        <div className={styles.tooltip}></div>
      </div>
    </div>
  );
}
