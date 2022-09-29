/** @format */

import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBRadioLabel, FEIBRadio } from 'components/elements';
import Accordion from 'components/Accordion';
import { RadioGroup } from '@material-ui/core';
// TODO: 移除
// import InstallmentTerms from './installmentTerms';
import R00200AccordionContent1 from './R00200_accordionContent_1';
import R00200AccordionContent2 from './R00200_accordionContent_2';

/* Styles */
import InstalmentWrapper from './R00200.style';

const R00200_2 = () => {
  const stagingPercentage = '6%';

  useCheckLocation();
  usePageInfo('/api/instalment');
  const history = useHistory();

  /* 資料驗證 */
  const schema = yup.object().shape({
    installmentNumber: yup.string().required('請選擇欲申請之晚點付期數'),
  });
  const { handleSubmit, control } = useForm({
    defaultValues: {
      installmentNumber: '1',
    },
    resolver: yupResolver(schema),
  });

  const renderSelectList = () => {
    const list = ['1 期', '3 期', '6 期', '9 期', '12 期'];
    return (
      <div className="selectList">
        <div>選擇晚點付期數</div>
        <Controller
          name="installmentNumber"
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
    console.log('R002002 handleOnSubmit() data: ', data);
    history.push('/R002003');
  };

  return (
    <Layout title="晚點付 (總額)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit((data) => handleOnSubmit(data))}>
          <div>
            <div className="messageBox2">
              <p style={{ width: '100%', textAlign: 'center' }}>分期利率</p>
              <h2 className="titleText">{stagingPercentage}</h2>
            </div>
            {renderSelectList()}
            {/* TODO: 晚點付約定條款 與 注意事項 之內容 */}
            <Accordion title="晚點付約定條款" space="both">
              {/* TODO: 移除 */}
              {/* <InstallmentTerms /> */}
              <R00200AccordionContent1 />
            </Accordion>
            <Accordion space="both">
              <R00200AccordionContent2 />
            </Accordion>
          </div>
          <FEIBButton
            type="submit"
            // onClick={() => {
            //   history.push('/R002003');
            // }}
          >
            同意條款並繼續
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_2;
