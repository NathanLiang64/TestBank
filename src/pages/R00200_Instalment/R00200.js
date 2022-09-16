/** @format */

// import {useEffect} from 'react';
import {useHistory} from 'react-router';
import {useCheckLocation, usePageInfo} from 'hooks';

/* Elements */
import Layout from 'components/Layout/Layout';
// TODO: 移除
// import Dialog from 'components/Dialog';
import {FEIBButton, FEIBRadio, FEIBRadioLabel} from 'components/elements';
import {showError} from 'utilities/MessageModal';
import Accordion from 'components/Accordion';
import R00200AccordionContent2 from './R00200_accordionContent_2';

/* Styles */
import InstalmentWrapper from './R00200.style';

const R00200 = () => {
  // TODO: 移除
  // const [showResultDialog, setShowResultDialog] = useState(true);

  // TODO: 移除
  // const cardName = 'cardName';

  /* showError 內容: 單筆消費未達3000 */
  const errorMessage = `您目前沒有可分期的消費
  (單筆消費限額需達3,000元以上)`;

  useCheckLocation();
  usePageInfo('/api/instalment');
  const history = useHistory();

  // TODO: 現狀：只能選擇、不能取消；可複選
  const renderSelectList = () => {
    const list = ['單筆', '總額'];
    return (
      <div className="selectList">
        {list.map((item, index) => (
          <p key={item}>
            <FEIBRadioLabel value={index} control={<FEIBRadio />} label={item} />
          </p>
        ))}
      </div>
    );
  };

  // TODO: 移除
  // const renderEditCardNameDialog = () => (
  //   <Dialog
  //     title="系統訊息"
  //     isOpen={showResultDialog}
  //     onClose={() => setShowResultDialog(false)}
  //     content={
  //       <>
  //         <p style={{width: '100%', textAlign: 'center'}}>
  //           您目前沒有可分期的消費
  //         </p>
  //         <p style={{width: '100%', textAlign: 'center'}}>
  //           (單筆消費限額需達3,000元以上)
  //         </p>
  //       </>
  //     }
  //     action={
  //       <FEIBButton onClick={() => setShowResultDialog(false)}>確定</FEIBButton>
  //     }
  //   />
  // );

  return (
    <Layout title="晚點付">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={() => {}}>
          <div>
            <div className="InstalmentWrapperText">點選申請晚點付項目</div>
            {renderSelectList()}
            <Accordion space="both">
              <R00200AccordionContent2 />
            </Accordion>
          </div>
          <FEIBButton
            type="submit"
            onClick={() => {
              // TODO: 檢查有無符合條件，有則push(依照條件)、無則showError
              showError(errorMessage);
              history.push('/R002001');
            }}
          >
            下一步
          </FEIBButton>
          {/* TODO: 移除 */}
          {/* {renderEditCardNameDialog(cardName)} */}
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200;
