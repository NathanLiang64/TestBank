import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout from 'components/Layout/Layout';
import { showDrawer, closeDrawer } from 'utilities/MessageModal';

/* Elements */
import {
  FEIBInputLabel,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
import AddNewItem from 'components/AddNewItem';
import SettingItem from 'components/SettingItem';
import Accordion from 'components/Accordion';
import AccordionContent from './accordionContent';

/* Styles */
import AutomaticBillPaymentWrapper from './automaticBillPayment.style';

const AutomaticBillPayment = () => {
  const appliedAutoBill = [
    {
      cardNum: '00******000000',
      type: '應繳總金額',
      date: '2020/03/03',
    },
  ];

  const todayAppliedAutoBill = [
    {
      cardNum: '00******000000',
      type: '應繳總金額',
    },
  ];

  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    account: yup
      .string()
      .required('請選擇扣款帳號'),
    type: yup
      .string()
      .required('請選擇扣款方式'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCloseDrawer = () => {
    closeDrawer();
  };

  const deleteAutoBillPay = () => {
  };

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    handleCloseDrawer();
  };

  const renderForm = () => (
    <AutomaticBillPaymentWrapper className="drawerContainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FEIBInputLabel>扣款帳號</FEIBInputLabel>
        <Controller
          name="account"
          defaultValue="1"
          control={control}
          render={({ field }) => (
            <FEIBSelect
              {...field}
              id="account"
              name="account"
              error={!!errors.account}
            >
              <FEIBOption value="123456789">123456789</FEIBOption>
            </FEIBSelect>
          )}
        />
        <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
        <FEIBInputLabel>扣款方式</FEIBInputLabel>
        <Controller
          name="type"
          defaultValue="1"
          control={control}
          render={({ field }) => (
            <FEIBSelect
              {...field}
              id="type"
              name="type"
              error={!!errors.type}
            >
              <FEIBOption value="1">方式1</FEIBOption>
              <FEIBOption value="2">方式2</FEIBOption>
            </FEIBSelect>
          )}
        />
        <FEIBButton type="submit">同意條款並送出</FEIBButton>
      </form>
    </AutomaticBillPaymentWrapper>
  );

  const addAutoBillPay = () => {
    showDrawer(
      '新增自動扣繳',
      renderForm(),
    );
  };

  const editAutoBillPay = () => {
    showDrawer(
      '編輯自動扣繳',
      renderForm(),
    );
  };

  const renderAppliedAutoBill = () => appliedAutoBill.map((item) => (
    <SettingItem
      mainLable={item.cardNum}
      subLabel={`扣款方式：${item.type} | 申請日：${item.date}`}
      editClick={editAutoBillPay}
      deleteClick={deleteAutoBillPay}
    />
  ));

  const renderTodayAppliedAutoBill = () => todayAppliedAutoBill.map((item) => (
    <SettingItem
      mainLable={item.cardNum}
      subLabel={`扣款方式：${item.type}`}
      editClick={editAutoBillPay}
      deleteClick={deleteAutoBillPay}
    />
  ));

  return (
    <Layout title="自動扣繳申請">
      <AutomaticBillPaymentWrapper>
        <section>
          <AddNewItem onClick={addAutoBillPay} addLabel="新增自動扣繳" />
        </section>
        <section className="billBlock">
          <div className="blockTitle">您已申辦自動扣繳區</div>
          {
            appliedAutoBill.length > 0
              ? renderAppliedAutoBill() : (<div className="item noData">查無資料</div>)
          }
        </section>
        <section className="billBlock">
          <div className="blockTitle">您當日申辦自動扣繳區</div>
          {
            todayAppliedAutoBill.length > 0
              ? renderTodayAppliedAutoBill() : (<div className="item noData">查無資料</div>)
          }
        </section>
        <Accordion space="both">
          <AccordionContent />
        </Accordion>
      </AutomaticBillPaymentWrapper>
    </Layout>
  );
};

export default AutomaticBillPayment;
