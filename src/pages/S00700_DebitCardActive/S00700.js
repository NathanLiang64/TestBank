import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useQLStatus } from 'hooks/useQLStatus';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import { TextInputField } from 'components/Fields';
import { Func } from 'utilities/FuncID';
import { transactionAuth } from 'utilities/AppScriptProxy';

import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showPrompt } from 'utilities/MessageModal';
import { activate, getStatus } from './api';
import DebitCardActiveWrapper from './S00700.style';

const S00700 = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { QLResult, showUnbondedMsg } = useQLStatus();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { accountNo: '', serial: '' },
    resolver: yupResolver(
      yup.object().shape({
        accountNo: yup.string().required('請輸入金融卡帳號').matches(/^(\d{14})?$/, '金融卡帳號由14個數字所組成'),
        serial: yup.string().required('請輸入金融卡序號').matches(/^(\d{6})?$/, '金融卡序號由6個數字所組成'),
      }),
    ),
  });

  const submitHandler = async ({serial}) => {
    const auth = await transactionAuth(Func.S007.authCode);
    if (auth && auth.result) {
      dispatch(setWaittingVisible(true));
      const apiRs = await activate({serial});
      dispatch(setWaittingVisible(false));
      if (apiRs.isSuccess) {
        history.push('/S007001', apiRs);
      }
    }
  };

  const checkStatus = (status) => {
    switch (status) {
      case (2):
        showPrompt('您的卡片已寄出，提醒您完成開卡後，妥善保存密碼，並至ATM/WebATM進行密碼變更。');
        return null;
      case (1):
      case (9):
        return '感謝您申辦Bankee數位存款帳戶，您的帳戶正在審核中，審核完成後本行將以掛號寄出金融卡至您指定的地址。 ';
      case (4):
        return '您的卡片已啟用，請妥善保存密碼。';
      case (5):
        return '您的金融卡已掛失無法使用，請至金融卡掛失補發功能重新申請金融卡。';
      case (6):
        return '您的金融卡已註銷，如需使用，請至金融卡掛失補發功能重新申請金融卡。';
      case (7):
        return '您尚無Bankee數位存款帳戶，可點選立即申請辦理開戶。';
      case (8):
        return '您的卡片已申請臨時掛失，可至全省任一分行恢復使用，或至金融卡掛失補發功能重新申請金融卡。';
      default:
        return 'unexpected status';
    }
  };

  useEffect(() => {
    if (!QLResult) showUnbondedMsg();
  }, [QLResult]);

  /**
   * 檢查是否可以開啟這個頁面。
   * @returns {Promise<String>} 傳回驗證結果的錯誤訊息；若是正確無誤時，需傳回 null
   */
  const inspector = async () => {
    const {status, account} = await getStatus();
    const message = checkStatus(status);
    if (message) return message;

    reset((formValues) => ({
      ...formValues,
      accountNo: account, // 我的金融卡帳號欄位自動帶入金融卡臺幣主帳號
    }));
    return null;
  };

  return (
    <Layout fid={Func.S007} title="金融卡啟用" inspector={inspector}>
      <DebitCardActiveWrapper>
        <form style={{ minHeight: 'initial' }} onSubmit={handleSubmit(submitHandler)}>
          <TextInputField
            labelName="我的金融卡帳號"
            name="accountNo"
            control={control}
            // NOTE : ios 遇到 disabled 的欄位，會將欄位內的 opacity 調低，因此字體看起來顏色會變淡
            inputProps={{disabled: true}}
          />
          <TextInputField
            labelName="我的金融卡序號"
            name="serial"
            placeholder="請輸入金融卡序號"
            inputProps={{maxLength: 6, inputMode: 'numeric'}}
            control={control}
          />
          <p className="hint_text">金融卡序號為金融卡背面右下角6碼數字</p>
          <FEIBButton type="submit">確認</FEIBButton>
        </form>
      </DebitCardActiveWrapper>
    </Layout>
  );
};

export default S00700;
