import React, { useState, useEffect, useRef } from "react";
import "./output.css";

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const beepSound = useRef(null);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            beepSound.current.play();
            setIsSession((prevIsSession) => !prevIsSession); // Toggle session state
            setTimerLabel((prevLabel) =>
              prevLabel === "Session" ? "Break" : "Session"
            ); // Toggle timer label
            return isSession ? breakLength * 60 : sessionLength * 60;
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, isSession, sessionLength, breakLength]);

  const resetTimer = () => {
    beepSound.current.pause();
    beepSound.current.currentTime = 0;
    setIsRunning(false);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <section className='relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20' />
      <div className='absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center' />
      <div className='mx-auto max-w-2xl lg:max-w-4xl flex flex-col justify-evenly gap-10'>
        <div className='border border-purple-900 p-3 text-center font-semibold text-3xl text-purple-950'>
          25 + 5 Clock
        </div>
        <div className='flex justify-between flex-row gap-9 p-6'>
          <div className='font-medium'>
            <p id='break-label'>Break Length</p>
            <div className='d-flex flex-row justify-between text-2xl'>
              <button
                id='break-decrement'
                className='p-1 m-1'
                onClick={() => setBreakLength((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <span id='break-length' className='p-1 m-1'>
                {breakLength}
              </span>
              <button
                id='break-increment'
                className='p-1 m-1'
                onClick={() => setBreakLength((prev) => Math.min(prev + 1, 60))}
              >
                +
              </button>
            </div>
          </div>
          <div className='font-medium'>
            <p id='session-label'>Session Length</p>
            <div className='d-flex flex-row justify-between text-2xl'>
              <button
                id='session-decrement'
                className='p-1 m-1'
                onClick={() =>
                  setSessionLength((prev) => Math.max(prev - 1, 1))
                }
              >
                -
              </button>
              <span id='session-length' className='p-1 m-1'>
                {sessionLength}
              </span>
              <button
                id='session-increment'
                className='p-1 m-1'
                onClick={() =>
                  setSessionLength((prev) => Math.min(prev + 1, 60))
                }
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className='border border-purple-800 justify-center flex flex-col self-center p-7 rounded-2xl'>
          <p id='timer-label' className='text-2xl text-center'>
            {timerLabel}
          </p>
          <span id='time-left' className='font-bold text-4xl'>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className='flex flex-row justify-evenly m-3 p-3'>
          <button id='start_stop' onClick={toggleTimer}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button id='reset' onClick={resetTimer}>
            Reset
          </button>
        </div>
      </div>
      <audio id='beep' ref={beepSound} src='../beep.wav' />
    </section>
  );
}

export default App;
