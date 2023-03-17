import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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

  const { control, watch } = useForm({
    defaultValues: {
      memo: '',
      type: '1',
    },
  });

  const renderRequestCardPic = () => { // DEBUG mock images
    const imageIdList = [1, 2, 3, 4, 5];
    return imageIdList.map((id) => cardImage(id));
  };

  const onSlideChange = async (swiper) => {
    console.log('onSlideChange', swiper.activeIndex);
    setModel({
      ...model,
      imgIndex: swiper.activeIndex + 1,
    });
    paymentSettingValues({
      ...model,
      imgIndex: swiper.activeIndex + 1,
    });
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
