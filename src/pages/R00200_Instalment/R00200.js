/** @format */

// import {useEffect} from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import Layout from 'components/Layout/Layout';
// TODO: 移除
// import Dialog from 'components/Dialog';
import { FEIBButton, FEIBRadio, FEIBRadioLabel } from 'components/elements';
import { showError } from 'utilities/MessageModal';
import Accordion from 'components/Accordion';
import { RadioGroup } from '@material-ui/core';
import R00200AccordionContent2 from './R00200_accordionContent_2';

/* Styles */
import InstalmentWrapper from './R00200.style';

/**
 * R00200 晚點付首頁
 */

const R00200 = () => {
  // TODO: 移除
  // const [showResultDialog, setShowResultDialog] = useState(true);

  // TODO: 移除
  // const cardName = 'cardName';

  /* showError 內容: 單筆消費未達3000 */
  const errorMessage = (
    <div style={{ textAlign: 'center' }}>
      <p>您目前沒有可分期的消費</p>
      <p>(單筆消費限額需達3,000元以上)</p>
    </div>
  );

  useCheckLocation();
  usePageInfo('/api/instalment');
  const history = useHistory();

  /* 資料驗證 */
  const schema = yup.object().shape({
    installmentType: yup.string().required('請選擇欲申請之晚點付項目'),
  });
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  const renderSelectList = () => {
    const list = ['單筆', '總額'];
    return (
      <div className="selectList">
        <Controller
          name="installmentType"
          control={control}
          defaultValue="1"
          render={({field}) => (
            <RadioGroup
              {...field}
              id="installmentType"
              name="installmentType"
              defaultValue="1"
            >
              <FEIBRadioLabel value="1" control={<FEIBRadio />} label={list[0]} />
              <FEIBRadioLabel value="2" control={<FEIBRadio />} label={list[1]} />
            </RadioGroup>
          )}
        />
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

  const handleOnSubmit = (data) => {
    console.log('R00200 handleOnSubmit() data: ', data);

    // TODO: 是否在此檢查有無符合條件，有則push、無則showError
    showError(errorMessage);
    history.push('/R002001'); // TODO: 需帶參數進下一頁
  };

  return (
    <Layout title="晚點付">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit((data) => handleOnSubmit(data))}>
          <div>
            <div className="InstalmentWrapperText">點選申請晚點付項目</div>
            {renderSelectList()}
            <Accordion space="both">
              <R00200AccordionContent2 />
            </Accordion>
          </div>
          <FEIBButton type="submit">
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
