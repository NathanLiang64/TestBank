/* eslint-disable no-unused-vars */

import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import Layout from 'components/Layout/Layout';
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
    defaultValues: {
      installmentType: '1',
    },
    resolver: yupResolver(schema),
  });

  const renderSelectList = () => {
    const list = ['單筆', '總額'];
    return (
      <div className="selectList">
        <Controller
          name="installmentType"
          control={control}
          render={({field}) => (
            <RadioGroup
              {...field}
              value={field.value}
            >
              {list.map((item, index) => (
                <FEIBRadioLabel key={item} value={(index + 1).toString()} control={<FEIBRadio />} label={item} />
              ))}
            </RadioGroup>
          )}
        />
      </div>
    );
  };

  const handleOnSubmit = (data) => {
    console.log('R00200 handleOnSubmit() data: ', data);

    // TODO: 是否在此檢查有無符合條件，有則push、無則showError
    // showError(errorMessage);

    // 有符合條件會帶回清單？
    // Debug: 以下為 hardcode
    const list = [
      {
        id: '001', name: '中和環球', date: '消費日期：2021/06/15', cost: 3700,
      },
      {
        id: '002', name: 'SOGO 台北忠孝店', date: '消費日期：2021/06/15', cost: 8000,
      },
      {
        id: '003', name: '板橋大遠百', date: '消費日期：2021/06/15', cost: 10000,
      },
      {
        id: '004', name: '中和環球', date: '消費日期：2021/06/15', cost: 9000,
      },
    ];
    history.push('/R002001', { installmentType: data, installmentData: list }); // TODO: 需帶參數進下一頁
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
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200;
