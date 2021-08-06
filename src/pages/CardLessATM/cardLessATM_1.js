import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { cardLessATMApi } from 'apis';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBBorderButton, FEIBErrorMessage,
} from 'components/elements';
import DebitCard from 'components/DebitCard';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
import { passwordValidation } from 'utilities/validation';
import { AddCircleRounded, RemoveCircleRounded } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';

/* Styles */
// import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM1 = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    withdrawAmount: yup
      .string()
      .required('請輸入提款金額'),
    // ...passwordValidation,
  });
  const {
    handleSubmit, control, formState: { errors }, setValue, clearErrors, getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const passwordSchema = yup.object().shape({
    ...passwordValidation,
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const history = useHistory();

  const [cardInformation, setCardInformation] = useState({
    account: '',
    balance: 0,
    discountTimes: 0,
  });

  const amountArr = [1000, 2000, 3000, 5000, 10000, 20000];

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toResultPage = () => {
    history.push('/cardLessATM3');
  };

  const toCurrncy = (num) => {
    const arr = num.toString().split('');
    arr.splice(-3, 0, ',');
    return arr.join('');
  };

  const changeAmount = (type) => {
    const preAmount = getValues('withdrawAmount');
    if (type) {
      if (preAmount >= 20000) {
        return;
      }
      setValue('withdrawAmount', Number(preAmount) + 1000);
    } else {
      if (preAmount <= 1000) {
        return;
      }
      setValue('withdrawAmount', Number(preAmount) - 1000);
    }
  };

  const getCardInfo = async () => {
    const cardInfoResponse = await cardLessATMApi.getCardInfo();
    const { cardInfo } = cardInfoResponse.data;
    setCardInformation({ ...cardInfo });
  };

  const onSubmit = (data) => {
    const param = {
      ...data,
    };
    // 是否使用快速登入
    const quickLogin = true;
    if (quickLogin) {
      setDrawerOpen(true);
    } else {
      cardLessATMApi.cardLessWithdrawApply(param)
        .then((response) => {
          if (response.code === 0) {
            toResultPage();
          }
        });
    }
  };

  const drawerSubmit = (data) => {
    const param = {
      ...getValues(),
      pwd: data.password,
    };
    cardLessATMApi.cardLessWithdrawApply(param)
      .then((response) => {
        if (response.code === 0) {
          // setShowResultDialog(true);
          toResultPage();
        }
      });
  };

  const renderDrawer = () => (
    <BottomDrawer
      title="輸入網銀密碼"
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      content={(
        <CardLessATMWrapper style={{ marginTop: '0', padding: '0 1.6rem 4rem' }}>
          <form onSubmit={passwordForm.handleSubmit(drawerSubmit)}>
            <PasswordInput
              label="網銀密碼"
              id="password"
              name="password"
              control={passwordForm.control}
              errorMessage={passwordForm.formState.errors.password?.message}
            />
            <FEIBButton
              type="submit"
            >
              送出
            </FEIBButton>
          </form>
        </CardLessATMWrapper>
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/cardLessATM');

  useEffect(() => {
    getCardInfo();
  }, []);

  return (
    <CardLessATMWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DebitCard
          cardName="存款卡"
          account={cardInformation.account}
          balance={cardInformation.balance}
          transferLimit={5}
          transferRemaining={cardInformation.discountTimes}
          color="purple"
        />
        <FEIBInputLabel>您想提領多少錢呢？</FEIBInputLabel>
        <Controller
          name="withdrawAmount"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <>
              <FEIBInput
                {...field}
                type="text"
                inputMode="numeric"
                id="withdrawAmount"
                name="withdrawAmount"
                placeholder="請輸入金額"
                error={!!errors.withdrawAmount}
              />
              <div className="addMinusIcons">
                <RemoveCircleRounded onClick={() => changeAmount(0)} />
                <AddCircleRounded onClick={() => changeAmount(1)} />
              </div>
            </>
          )}
        />
        <FEIBErrorMessage>{errors.withdrawAmount?.message}</FEIBErrorMessage>
        <FEIBInputLabel className="limit-label">以千元為單位，單日單次上限＄20,000</FEIBInputLabel>
        <div className="amountButtonsContainer">
          {
            amountArr.map((item) => (
              <div key={item} className="withdrawalBtnContainer">
                <FEIBBorderButton
                  type="button"
                  className="withdrawal-btn customSize"
                  onClick={() => {
                    setValue('withdrawAmount', item);
                    clearErrors('withdrawAmount');
                  }}
                >
                  {
                    toCurrncy(item)
                  }
                </FEIBBorderButton>
              </div>
            ))
          }
        </div>
        {/* <PasswordInput
          label="網銀密碼"
          id="password"
          name="password"
          control={control}
          errorMessage={errors.password?.message}
        /> */}
        <Accordion space="both">
          <ul>
            <li>本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
            <li>提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。 </li>
            <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
          </ul>
        </Accordion>
        <div className="btn-fix">
          <FEIBButton
            type="submit"
          >
            下一步
          </FEIBButton>
        </div>
      </form>
      {renderDrawer()}
    </CardLessATMWrapper>
  );
};

export default CardLessATM1;
