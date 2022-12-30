import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import SettingItem from 'components/SettingItem';
import { DropdownField } from 'components/Fields';
import { FEIBButton, FEIBSwitch, FEIBSwitchLabel} from 'components/elements';
import { AuthCode } from 'utilities/TxnAuthCode';
import { accountFormatter } from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';
import {
  showDrawer, closeDrawer, showCustomPrompt, showAnimationModal,
} from 'utilities/MessageModal';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import uuid from 'react-uuid';
// eslint-disable-next-line no-unused-vars
import { useNavigation } from 'hooks/useNavigation';
import { CancelAutoBillAlert, AccordionContent } from './utils';
import {
  getAutoDebits, setAutoDebit, getAccountsList, getCards,
} from './api';
import AutomaticBillPaymentWrapper from './R00500.style';
import { validationSchema } from './validationSchema';

const AutomaticBillPayment = () => {
  const { closeFunc } = useNavigation();
  const [appliedAutoBill, setAppliedAutoBill] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const isFullPayOptions = [{label: '應繳總金額', value: 'Y'}, {label: '最低應繳金額', value: 'N'}];
  const active = !!appliedAutoBill.length;
  const dispatch = useDispatch();

  const {
    handleSubmit, control, reset,
  } = useForm({
    defaultValues: {
      account: '',
      isFullPay: '',
      bank: '805',
    },
    resolver: yupResolver(validationSchema),
  });

  // 確認有無信用卡
  const getCardsData = async () => {
    const cardRes = await getCards();
    if (!cardRes.cards.length) {
      showCustomPrompt({
        message: '您尚未持有Bankee信用卡，請在系統關閉此功能後，立即申請。',
        onClose: closeFunc,
      });
    }
  };

  // 取得帳號清單
  const getAccountsArray = async () => {
    // TODO 後續改以 utilities/CacheDataget/AccountsList 去拿
    const accountsListRes = await getAccountsList();
    if (!accountsListRes.length) return;

    const options = accountsListRes.map((item) => ({label: item.account, value: item.account}));
    setAccountOptions(options);
    // TODO 如何去判斷 options 內哪一個帳戶屬於 bankee 母帳戶
    reset((formValues) => ({...formValues, account: options[0].value}));
  };

  // 查詢自動扣繳資訊
  const getAutoDebitData = async () => {
    const autoDebitsRes = await getAutoDebits();
    setAppliedAutoBill(autoDebitsRes);
  };

  // 產生狀態
  const renderStatusText = (status) => {
    switch (status) {
      case '1':
        return '申請';
      case '2':
        return '生效';
      case '3':
        return '取消';
      case '4':
        return '退件';
      case '5':
        return '待生效';
      default:
        return '';
    }
  };

  const onSubmit = async (values) => {
    dispatch(setWaittingVisible(true));
    const auth = await transactionAuth(AuthCode.R00500);
    if (auth.result) {
      const { result, message } = await setAutoDebit(values);
      showAnimationModal({
        isSuccess: result,
        successTitle: '設定成功',
        errorTitle: '設定失敗',
        successDesc: message,
        errorDesc: message,
      });
      getAutoDebitData(); // TODO 可改為直接變動 appliedAutoBill 不再打一次 API
      closeDrawer();
    }
    dispatch(setWaittingVisible(false));
  };

  const handleApplyAutoBill = () => {
    if (active) {
      showCustomPrompt({
        message: <CancelAutoBillAlert />,
        onOk: () => {},
      });
    } else showDrawer('新增自動扣繳', <AddForm />);
  };

  const AddForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="drawerContainer">
      <DropdownField
        labelName="扣款帳號"
        name="account"
        control={control}
        options={accountOptions}
      />
      <DropdownField
        labelName="扣款方式"
        name="isFullPay"
        control={control}
        options={isFullPayOptions}
      />
      <Accordion space="both" title="自動扣繳約定條款">
        自動扣繳約定條款
      </Accordion>
      <FEIBButton type="submit">同意條款並送出</FEIBButton>
    </form>
  );

  const renderAppliedAutoBill = () => appliedAutoBill.map((item) => (
    <SettingItem
      key={uuid()}
      mainLable={accountFormatter(item.account)}
      subLabel={`扣款方式：${item.isFullPay === '100' ? '應繳總金額' : '最低應繳金額'} | 狀態：${renderStatusText(item.status)}`}
    />
  ));

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    await getCardsData();
    await getAutoDebitData();
    await getAccountsArray();
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="自動扣繳申請/查詢">
      <AutomaticBillPaymentWrapper>
        <div className="switchContainer">
          <FEIBSwitchLabel
            control={<FEIBSwitch checked={active} onClick={handleApplyAutoBill} />}
            label="自動扣繳"
          />
        </div>
        {active && (
          <section className="billBlock">
            <div className="blockTitle">您已申辦自動扣繳</div>
            {renderAppliedAutoBill()}
          </section>
        )}
        <Accordion space="both">
          <AccordionContent />
        </Accordion>
      </AutomaticBillPaymentWrapper>
    </Layout>
  );
};

export default AutomaticBillPayment;
