import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import Header from 'components/Header';
import Dialog from 'components/Dialog';
import { FEIBButton, FEIBRadio, FEIBRadioLabel } from 'components/elements';
import Accordion from 'components/Accordion';
import AccordionContent from './accordionContent';

/* Styles */
import InstalmentWrapper from './instalment.style';

const Instalment = () => {
  const [showResultDialog, setShowResultDialog] = useState(true);

  const cardName = 'cardName';

  useCheckLocation();
  usePageInfo('/api/instalment');
  const history = useHistory();

  const renderSelectList = () => {
    const list = ['單筆', '總額'];
    return (
      <div className="selectList">
        { list.map((item, index) => (
          <p>
            <FEIBRadioLabel value={index} control={<FEIBRadio />} label={item} />
          </p>
        )) }
      </div>
    );
  };

  const renderEditCardNameDialog = () => (
    <Dialog
      title="系統訊息"
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <>
          <p style={{ width: '100%', textAlign: 'center' }}>
            您目前沒有可分期的消費
          </p>
          <p style={{ width: '100%', textAlign: 'center' }}>
            (單筆消費限額需達3,000元以上)
          </p>
        </>
      )}
      action={(
        <FEIBButton onClick={() => setShowResultDialog(false)}>
          確定
        </FEIBButton>
      )}
    />
  );

  return (
    <>
      <Header title="晚點付" goBack={() => history.replace('/')} />
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={() => {}}>
          <div>
            <div className="InstalmentWrapperText">
              點選申請晚點付項目
            </div>
            {renderSelectList()}
            <Accordion space="both">
              <AccordionContent />
            </Accordion>
          </div>
          <FEIBButton
            type="submit"
            onClick={() => {
              setShowResultDialog(true);
              history.push('/staging1');
            }}
          >
            下一步
          </FEIBButton>
          { renderEditCardNameDialog(cardName) }
        </form>
      </InstalmentWrapper>
    </>
  );
};

export default Instalment;
