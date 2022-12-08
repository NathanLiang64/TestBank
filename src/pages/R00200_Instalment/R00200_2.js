/* eslint-disable no-unused-vars */
/** @format */

import { useHistory, useLocation } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBRadioLabel, FEIBRadio } from 'components/elements';
import Accordion from 'components/Accordion';
import { RadioGroup } from '@material-ui/core';

import { RadioGroupField } from 'components/Fields/radioGroupField';
import { R00200AccordionContent1, R00200AccordionContent2 } from './utils';
/* Styles */
import InstalmentWrapper from './R00200.style';
import { installmentNumberSchema } from './validationSchema';

/**
 * R002002 晚點付 (單筆/總額_選擇期數&約定同意書)
 */
const R00200_2 = () => {
  // TOOD: 目前利率是 hardcode
  const stagingPercentage = '6';
  const history = useHistory();
  const location = useLocation();

  const { handleSubmit, control } = useForm({
    defaultValues: { installmentNumber: '1' },
    resolver: yupResolver(installmentNumberSchema),
  });

  const options = [
    {label: '1期', value: '1'},
    {label: '3期', value: '3'},
    {label: '6期', value: '6'},
    {label: '9期', value: '9'},
    {label: '12期', value: '12'}];

  const onSubmit = (data) => {
    console.log('R002002 handleOnSubmit() data: ', data);
    // history.push('/R002003', {
    //   installmentSum: location.state.sum,
    //   installmentNumber: data.installmentNumber,
    //   installmentPercentage: stagingPercentage,
    // });
  };

  // ★備註說明:
  //   依與作業部核簽之分期設定表。
  //   各分期換算之每月利率如下:
  //   1期:年化利率0%(每月利率0%)
  //   3期:年化利率0%(每月利率0%)
  //   6期:年化利率6%(每月利率0.29%)
  //   9期:年化利率9%(每月利率0.42%)
  // 12期:年化利率12%(每月利率0.55%)

  return (
    // For 測試需求 目前 title＝總額
    <Layout title="晚點付 (總額)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="messageBox2">
              <p>分期利率</p>
              <h2 className="titleText">
                {stagingPercentage}
                %
              </h2>
            </div>
            <RadioGroupField
              labelName={(
                <div style={{ fontSize: '1.6rem', margin: '1rem' }}>
                  選擇晚點付期數
                </div>
              )}
              control={control}
              options={options}
              name="installmentNumber"
            />
            {/* TODO: 晚點付約定條款 與 注意事項 之內容 */}
            <Accordion title="晚點付約定條款" space="both">
              <R00200AccordionContent1 />
            </Accordion>
            <Accordion space="both">
              <R00200AccordionContent2 />
            </Accordion>
          </div>
          <FEIBButton type="submit">同意條款並繼續</FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_2;
