import ActionsImg from '../../assets/images/prototype/actions.png';

const RegisterModal = ({ show, close }) => {
  const closeActions = () => close();
  return (
    <div className={`faceIdLogin ${show ? '' : 'hide'}`} onClick={closeActions}>
      <div>
        <img className="actionImg" src={ActionsImg} alt="" />
      </div>
    </div>
  );
};

export default RegisterModal;
