import { useSelector, useDispatch } from 'react-redux';
import Dialog from 'components/Dialog';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { setIsOpen } from './stores/actions';

const ResultDialog = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(({ resultDialog }) => resultDialog.isOpen);
  const resultContent = useSelector(({ resultDialog }) => resultDialog.resultContent);
  const closeCallBack = useSelector(({ resultDialog }) => resultDialog.closeCallBack);
  const closeDialog = () => {
    try {
      closeCallBack();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsOpen(false));
    }
  };
  return (
    <Dialog
      isOpen={isOpen}
      onClose={closeDialog}
      title=" "
      content={(
        <div className="dialogResultContent">
          <SuccessFailureAnimations
            isSuccess={resultContent.isSuccess}
            successTitle={resultContent.successTitle}
            successDesc={resultContent.successDesc}
            errorTitle={resultContent.errorTitle}
            errorCode={resultContent.errorCode}
            errorDesc={resultContent.errorDesc}
          />
        </div>
      )}
    />
  );
};

export default ResultDialog;
