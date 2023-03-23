import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountFormatter } from 'utilities/Generator';
import { showAnimationModal } from 'utilities/MessageModal';
import { FEIBButton } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { txUsageOptions } from '../utils/usgeType';
import PageWrapper from './InvoiceSending.style';
import { cardImage } from '../utils/images';
import { chargeOwner } from './api';

const InvoiceSending = () => {
  const [imgId, setImgId] = useState(0);
  const history = useHistory();
  const goBackFunc = () => history.goBack();

  const { state } = useLocation(); // partner 自前頁(明細列表頁)點擊“要錢”按鈕後帶入帳戶資料及txType

  const schema = yup.object().shape({
    usage: yup.string(),
    memo: yup.string().max(12), // 字數上限: 12
    amount: yup.string().required('請輸入金額'),
  });
  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      usage: '1',
      memo: '',
      amount: '',
      account: '',
    },
    resolver: yupResolver(schema),
  });

  const renderRequestCardPic = () => {
    const imageIdList = [1, 2, 3, 4, 5];

    return imageIdList.map((id) => cardImage(id));
  };

  const onSlideChange = async (swiper) => {
    console.log('onSlideChange', swiper.activeIndex);
    setImgId(swiper.activeIndex + 1);
  };

  const onSubmit = async (data) => {
    const requestData = {
      txType: state.txType,
      txUsage: data.usage,
      txAmount: data.amount,
      txDesc: data.memo,
      bankAccount: {
        bankCode: state.bankCode,
        account: state.bankAccount,
      },
      messageCard: `WO${imgId}`,
    };
    console.log('onSubmit', requestData);

    const response = await chargeOwner(requestData);

    await showAnimationModal({
      isSuccess: response.data,
      successTitle: '要錢卡建立成功',
      successDesc: '',
      errorTitle: '要錢卡建立失敗',
      errorCode: '',
      errorDesc: response.message,
    });

    goBackFunc();
  };

  useEffect(() => {
    /* 自動填入綁定帳號 */
    reset((formValues) => ({
      ...formValues,
      account: `${state.bank}-${accountFormatter(state.account, true)}`,
    }));
  }, []);

  return (
    <Layout title="要錢" goBackFunc={() => goBackFunc()}>
      <PageWrapper>
        <SwiperLayout
          slides={renderRequestCardPic()}
          slidesPerView={1.08}
          spaceBetween={8}
          centeredSlides
          onSlideChange={onSlideChange}
          hasDivider={false}
        />
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="form">
          <DropdownField
            labelName="性質"
            options={txUsageOptions}
            name="usage"
            control={control}
          />
          <TextInputField
            labelName="說明"
            type="text"
            name="memo"
            control={control}
          />
          <TextInputField
            labelName="請款金額"
            type="text"
            name="amount"
            control={control}
            inputProps={{ placeholder: 'NTD', inputMode: 'numeric' }}
          />
          <TextInputField
            labelName="請款帳號"
            type="text"
            name="account"
            control={control}
            inputProps={{disabled: true}}
          />
          <FEIBButton type="submit">確認</FEIBButton>
        </form>
      </PageWrapper>
    </Layout>
  );
};

export default InvoiceSending;
