import { useState, useEffect } from 'react';
import { countdownTimerFormatter } from 'utilities/Generator';
import CountDownWrapper from './countDown.style';

const CountDown = ({ minute = 5, onEnd, replay }) => {
  const [countSec, setCountSec] = useState(minute * 60);
  const [triggerCountDown, setTriggerCountDown] = useState(true);

  useEffect(() => {
    const countDown = setInterval(() => {
      if (triggerCountDown) setCountSec((sec) => sec - 1);
    }, 1000);

    return () => clearInterval(countDown);
  }, [triggerCountDown]);

  useEffect(() => {
    if (countSec === 0) {
      setTriggerCountDown(false);
      onEnd();
    }
  }, [countSec]);

  useEffect(() => {
    if (replay) {
      setCountSec(minute * 60);
      setTriggerCountDown(true);
    }
  }, [replay]);

  return (
    <CountDownWrapper>
      { countSec && countdownTimerFormatter(countSec) }
    </CountDownWrapper>
  );
};

export default CountDown;
