import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { showError } from 'utilities/MessageModal';
import { getThisMonth } from 'utilities/MonthGenerator';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import { RadioGroupField } from 'components/Fields/radioGroupField';

import { queryCardBill } from './api';
import InstalmentWrapper from './R00200.style';
import { entranceSchema } from './validationSchema';
import { R00200AccordionContent2 } from './utils';

/**
 * R00200 晚點付首頁
 */

const R00200 = () => {
  const history = useHistory();

  const {handleSubmit, control, reset } = useForm({
    defaultValues: {installmentType: '1', NewBalance: 0 },
    resolver: yupResolver(entranceSchema),
  });

  const installmentTypeOptions = [{label: '單筆', value: '1'}, {label: '總額', value: '2'}];

  const showInsufficientContent = (type) => (
    <div style={{ textAlign: 'center' }}>
      <p>您目前沒有可分期的消費</p>
      <p>
        (
        {type === '1' ? '消費全額' : '單筆消費限額'}
        需達3,000元以上)
      </p>
    </div>
  );

  const onSubmit = async ({ newBalance, installmentType }) => {
    if (!newBalance || newBalance < 3000) {
      showError(showInsufficientContent(installmentType));
      return;
    }

    history.push('/R002001', { installmentType, installmentData: '' }); // TODO: 需帶參數進下一頁
  };

  useEffect(async () => {
    const { newBalance } = await queryCardBill(getThisMonth());
    reset({ newBalance, installmentType: '1' });
  }, []);

  return (
    <Layout title="晚點付">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="InstalmentWrapperText">點選申請晚點付項目</div>
            <RadioGroupField
              name="installmentType"
              control={control}
              options={installmentTypeOptions}
            />
            <Accordion space="both">
              {/* TODO 目前 hardcode，注意事項是否應從後端取得 */}
              <R00200AccordionContent2 />
            </Accordion>
          </div>
          <FEIBButton type="submit">下一步</FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200;
