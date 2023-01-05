import { useState } from 'react';
import FaceIdImg from '../../assets/images/prototype/faceID.png';
import FaceIdTryAgain from '../../assets/images/prototype/faceIdTryAgain.png';

const FaceIdLoginModal = ({ show, close }) => {
  const [showFaceLoginImg, setShowFaceLoginImg] = useState(true);

  const closeFaceIdLogin = () => close();
  const changeFaceIdImg = (event) => {
    setShowFaceLoginImg(!showFaceLoginImg);
    event.stopPropagation();
  };
  return (
    <div className={`faceIdLogin ${show ? '' : 'hide'}`} onClick={closeFaceIdLogin}>
      <div onClick={changeFaceIdImg}>
        {
          showFaceLoginImg ? (<img className="loginImg" src={FaceIdImg} alt="" />) : (<img className="loginAgainImg" src={FaceIdTryAgain} alt="" />)
        }
      </div>
    </div>
  );
};

export default FaceIdLoginModal;
