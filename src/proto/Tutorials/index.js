/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useHistory } from 'react-router';
import TutorialsWrapper from './tutorials.style';

/* Styles */
import Tutorials1Bg from '../../assets/images/prototype/tutorial_1_bg.png';
import Tutorials1Content from '../../assets/images/prototype/tutorial_1_content.png';
import Tutorials2 from '../../assets/images/prototype/tutorial_2.png';
import Tutorials3 from '../../assets/images/prototype/tutorial_3.png';
import Tutorials4 from '../../assets/images/prototype/tutorial_4.png';
import Tutorials5 from '../../assets/images/prototype/tutorial_5.png';
import Tutorials6 from '../../assets/images/prototype/tutorial_6.png';

const Tutorials = () => {
  const history = useHistory();
  const [tutorialStep, setTutorialStep] = useState(1);
  const [tutorialImg, setTutorialImg] = useState(Tutorials1Bg);

  const toProvisionPage = () => {
    history.push('/provisioning');
  };

  const changeImage = (num) => {
    switch (num) {
      case 1:
        setTutorialImg(Tutorials1Bg);
        break;
      case 2:
        setTutorialImg(Tutorials2);
        break;
      case 3:
        setTutorialImg(Tutorials3);
        break;
      case 4:
        setTutorialImg(Tutorials4);
        break;
      case 5:
        setTutorialImg(Tutorials5);
        break;
      case 6:
        setTutorialImg(Tutorials6);
        break;
      default:
        toProvisionPage();
        break;
    }
  };

  const nextStep = () => {
    const nextNum = tutorialStep + 1;
    setTutorialStep(nextNum);
    changeImage(nextNum);
  };

  return (
    <TutorialsWrapper>
      <div className="skip" onClick={toProvisionPage}>
        {
          tutorialStep === 1 && (<span>略過</span>)
        }
      </div>
      <img src={tutorialImg} alt="" onClick={nextStep} />
      {
        tutorialStep === 1 && (<img className="tutorial1Content" src={Tutorials1Content} alt="" onClick={nextStep} />)
      }
    </TutorialsWrapper>
  );
};

export default Tutorials;
