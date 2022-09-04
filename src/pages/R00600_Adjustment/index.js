import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
import DebitCard from 'components/DebitCard';
import DateRangePicker from 'components/DateRangePicker';

/* Styles */
// import theme from 'themes/theme';
import AdjustmentWrapper from './adjustment.style';

const Adjustment = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    creditAmount: yup
      .string()
      .required('請輸入申請金額'),
    use: yup
      .string()
      .required('請選擇用途'),
    otherDescription: yup
      .string()
      .when('use', {
        is: (val) => val === '7',
        then: yup.string().required('請輸入其他說明'),
        otherwise: yup.string().notRequired(),
      }),
    useLocation: yup
      .string()
      .required('請選擇使用地點'),
    location: yup
      .string()
      .when('useLocation', {
        is: (val) => val === '1' || val === '3',
        then: yup.string().required('請輸入出國地點'),
        otherwise: yup.string().notRequired(),
      }),
  });
  const {
    handleSubmit, control, formState: { errors }, watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const history = useHistory();
  const creditCardData = {
    number: '****-****-****-0000',
    amount: '120,030',
    currentAmount: '10,000',
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleClickDateRangePicker = (range) => {
    setStartDate(range[0]);
    setEndDate(range[1]);
  };

  const applyAdjustment = () => {
    history.push('/adjustment1');
  };

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    applyAdjustment();
  };

  useCheckLocation();
  usePageInfo('/api/adjustment');

  return (
    <AdjustmentWrapper>
      <DebitCard
        cardName="信用卡"
        account={creditCardData.number}
        balance={creditCardData.amount}
        hideIcon
      />
      <div className="currentAmount">
        目前額度：
        {creditCardData.currentAmount}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputContainer">
          <FEIBInputLabel>申請金額</FEIBInputLabel>
          <Controller
            name="creditAmount"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                type="text"
                inputMode="numeric"
                id="creditAmount"
                name="creditAmount"
                placeholder="請輸入申請額度"
                error={!!errors.creditAmount}
              />
            )}
          />
          <span className="tailText">萬元</span>
          <FEIBErrorMessage>{errors.creditAmount?.message}</FEIBErrorMessage>
        </div>
        <div className="inputContainer">
          <FEIBInputLabel>申請用途</FEIBInputLabel>
          <Controller
            name="use"
            defaultValue=""
            control={control}
            placeholder="請選擇申請用途"
            render={({ field }) => (
              <FEIBSelect
                {...field}
                id="use"
                name="use"
                placeholder="請選擇申請用途"
                error={!!errors.use}
              >
                <FEIBOption value="" disabled>請選擇申請用途</FEIBOption>
                <FEIBOption value="1">喜宴及住宿</FEIBOption>
                <FEIBOption value="2">保費</FEIBOption>
                <FEIBOption value="3">醫療費用</FEIBOption>
                <FEIBOption value="4">旅遊團費</FEIBOption>
                <FEIBOption value="5">學費</FEIBOption>
                <FEIBOption value="6">綜所稅</FEIBOption>
                <FEIBOption value="7">其他</FEIBOption>
              </FEIBSelect>
            )}
          />
          <FEIBErrorMessage>{errors.use?.message}</FEIBErrorMessage>
        </div>
        {
          watch('use') === '7' && (
            <div className="inputContainer">
              <FEIBInputLabel>其他說明</FEIBInputLabel>
              <Controller
                name="otherDescription"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <FEIBInput
                    {...field}
                    type="text"
                    id="otherDescription"
                    name="otherDescription"
                    placeholder="請輸入其他說明"
                    multiline
                    rows="3"
                    error={!!errors.otherDescription}
                  />
                )}
              />
              <FEIBErrorMessage>{errors.otherDescription?.message}</FEIBErrorMessage>
            </div>
          )
        }
        <div className="inputContainer">
          <FEIBInputLabel>使用地點</FEIBInputLabel>
          <Controller
            name="useLocation"
            defaultValue=""
            control={control}
            placeholder="請選擇使用地點"
            render={({ field }) => (
              <FEIBSelect
                {...field}
                id="useLocation"
                name="useLocation"
                placeholder="請選擇使用地點"
                error={!!errors.useLocation}
              >
                <FEIBOption value="" disabled>請選擇使用地點</FEIBOption>
                <FEIBOption value="1">國外</FEIBOption>
                <FEIBOption value="2">國內</FEIBOption>
                <FEIBOption value="3">國內外</FEIBOption>
                <FEIBOption value="4">網路</FEIBOption>
              </FEIBSelect>
            )}
          />
          <FEIBErrorMessage>{errors.useLocation?.message}</FEIBErrorMessage>
        </div>
        {
          (watch('useLocation') === '1' || watch('useLocation') === '3') && (
            <div className="inputContainer">
              <FEIBInputLabel>出國地點</FEIBInputLabel>
              <Controller
                name="location"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <FEIBInput
                    {...field}
                    type="text"
                    id="location"
                    name="location"
                    placeholder="請輸入出國地點"
                    multiline
                    rows="3"
                    error={!!errors.location}
                  />
                )}
              />
              <FEIBErrorMessage>{errors.location?.message}</FEIBErrorMessage>
            </div>
          )
        }
        <div className="inputContainer">
          <DateRangePicker value={[startDate, endDate]} label="申請期間" onChange={handleClickDateRangePicker} />
        </div>
        <FEIBButton
          className="fixBtnMargin"
          type="submit"
        >
          立即申請
        </FEIBButton>
      </form>
    </AdjustmentWrapper>
  );
};

export default Adjustment;
