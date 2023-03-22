import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DropdownField, TextInputField } from 'components/Fields';
import SwiperLayout from 'components/SwiperLayout';
import { txUsageOptions } from '../utils/usgeType';
import { cardImage } from '../utils/images';

const PaymentSetting = (props) => {
  const { paymentSettingValues } = props;
  const [model, setModel] = useState({
    imgIndex: 1,
    memo: '',
    type: '',
  });

  const schema = yup.object().shape({
    type: yup.string(),
    memo: yup.string().max(12), // 字數上限: 12
  });
  const { control, watch } = useForm({
    defaultValues: {
      memo: '',
      type: '1',
    },
    resolver: yupResolver(schema),
  });

  const renderRequestCardPic = () => {
    const imageIdList = [1, 2, 3, 4, 5];
    return imageIdList.map((id) => cardImage(id));
  };

  const onSlideChange = async (swiper) => {
    setModel({
      ...model,
      imgIndex: swiper.activeIndex + 1,
    }); // 更新此元件model
    paymentSettingValues({
      ...model,
      imgIndex: swiper.activeIndex + 1,
    }); // 更新至
  };

  useEffect(() => {
    const input = watch();
    paymentSettingValues({
      ...model,
      type: input.type,
      memo: input.memo,
    });
  }, [watch()]);

  return (
    <div className="step1_form">
      <div>
        <SwiperLayout
          slides={renderRequestCardPic()}
          slidesPerView={1.08}
          spaceBetween={8}
          centeredSlides
          onSlideChange={onSlideChange}
          hasDivider={false}
        />
      </div>
      <div className="form_input_container">
        <DropdownField
          labelName="性質"
          options={txUsageOptions}
          name="type"
          control={control}
        />
        <TextInputField
          labelName="說明"
          type="text"
          name="memo"
          control={control}
        />
      </div>
    </div>
  );
};

export default PaymentSetting;
