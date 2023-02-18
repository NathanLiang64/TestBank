import { useState, useEffect } from 'react';
import { countdownTimerFormatter } from 'utilities/Generator';
import CountDownWrapper from './countDown.style';

const CountDown = ({ seconds, onEnd, replay }) => {
  const [countSec, setCountSec] = useState(seconds);
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
      setCountSec(seconds);
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
