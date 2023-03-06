/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountFormatter } from 'utilities/Generator';
import uuid from 'react-uuid';

import { FEIBButton } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { typeOptions } from '../utils/usgeType';
import PageWrapper from './InvoiceSending.style';

const InvoiceSending = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const history = useHistory();
  const stateData = {
    bank: '805',
    account: '00011122334455',
  };

  const schema = yup.object().shape({
    type: yup.string().required(),
    memo: yup.string(), // TODO 字數上限
    amount: yup.string().required(),
  });
  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      type: '1',
      memo: '',
      amount: '',
      account: '',
    },
    resolver: yupResolver(schema),
  });

  const renderRequestCardPic = () => { // DEBUG mock images
    const colorLists = ['black', 'blue', 'salmon', 'grey'];

    return colorLists.map((color) => <div style={{height: '16rem', width: '24rem', backgroundColor: `${color}`}}>image</div>);
  };

  const onSlideChange = async (swiper) => {
    console.log('onSlideChange', swiper.activeIndex);
    setImgIndex(swiper.activeIndex);
  };

  const onSubmit = (data) => {
    const requestData = {
      ...data,
      bank: stateData.bank,
      account: stateData.account,
      image: imgIndex,
    };
    console.log('onSubmit', requestData);
  };

  const goBackFunc = () => history.goBack();

  useEffect(() => {
    reset((formValues) => ({
      ...formValues,
      account: `${stateData.bank}-${accountFormatter(stateData.account, true)}`,
    }));
  }, []);

  return (
    <Layout title="要錢" goBackFunc={() => goBackFunc()}>
      <PageWrapper>
        <SwiperLayout
          slides={renderRequestCardPic()}
          slidesPerView={1.3}
          spaceBetween={8}
          centeredSlides
          onSlideChange={onSlideChange}
          hasDivider={false}
        />
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="form">
          <DropdownField
            labelName="性質"
            options={typeOptions}
            name="type"
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
            inputProps={{placeholder: 'NTD'}}
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
