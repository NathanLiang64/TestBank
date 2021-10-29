import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCheckLocation, usePageInfo } from 'hooks';
import Dialog from 'components/Dialog';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import PasswordInput from 'components/PasswordInput';
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import e2ee from 'utilities/E2ee';
import { passwordValidation } from 'utilities/validation';
// import { doGetInitData } from 'apis/lossReissueApi';
import mockData from './mockData';
import LossReissueWrapper from './lossReissue.style';
import {
  setActionText, setAccount, setCardState, setUserAddress, setIsResultSuccess,
} from './stores/actions';

const LossReissue = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    password: passwordValidation(),
  });
  const {
    handleSubmit, control, watch, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const account = useSelector(({ lossReissue }) => lossReissue.account);
  const state = useSelector(({ lossReissue }) => lossReissue.state);
  const actionText = useSelector(({ lossReissue }) => lossReissue.actionText);
  const address = useSelector(({ lossReissue }) => lossReissue.address);
  const [openConfirmDialog, setConfirmOpenDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [password, setPassword] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { push } = useHistory();
  const dispatch = useDispatch();

  const handleClickSubmitButton = async (data) => {
    data.password = await e2ee(data.password);
    setPassword(data.password);
    setConfirmOpenDialog(true);
  };

  // 點擊確定後顯示申請結果
  const handleClickMainButton = () => {
    // call api 決定顯示申請成功失敗結果
    dispatch(setIsResultSuccess(true));
    // 導頁至結果頁
    push('/lossReissue2');
  };

  /*
  * 卡片狀態為 " 臨時掛失中 " 或 " 已啟用 " 時應顯示 " 掛失申請 " 按鈕
  * 卡片狀態為 " 已掛失 " 或 " 已註銷 " 時應顯示 " 補發申請 " 按鈕
  * */
  const renderButton = (cardState) => {
    if (cardState === '臨時掛失中' || cardState === '已啟用') {
      dispatch(setActionText('掛失'));
    } else {
      dispatch(setActionText('補發'));
      dispatch(setUserAddress('台北市信義區信義路4段5號6樓'));
    }
    return (
      <FEIBButton type="submit" disabled={buttonDisabled}>
        { `${actionText}申請` }
      </FEIBButton>
    );
  };

  const renderPasswordInput = () => (
    <div className="passwordArea">
      <PasswordInput
        id="password"
        control={control}
        errorMessage={errors.password?.message}
      />
    </div>
  );

  const renderConfirmDialog = () => (
    <Dialog
      isOpen={openConfirmDialog}
      onClose={() => setConfirmOpenDialog(false)}
      content={<DialogContent />}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handleClickMainButton}
          subButtonOnClick={() => setConfirmOpenDialog(false)}
        />
      )}
    />
  );

  const DialogContent = () => {
    if (state === '臨時掛失中' || state === '已啟用') {
      return <p>是否確認掛失申請 ?</p>;
    }
    return (
      <>
        <p>申請後約 5 ~ 7 個工作天</p>
        <p>我們會將金融卡寄送至您留存在本行的通訊地址：</p>
        <p className="textColorPoint">{address}</p>
        <br />
        <p>若您的通訊地址需要修改，請至</p>
        <p className="textColorPrimary">設定➝基本資料變更➝通訊地址</p>
        <p>進行變更，謝謝！</p>
        <br />
        <p>是否確認補發？</p>
      </>
    );
  };

  // 卡片狀態為 " 新申請 " 或 " 已銷戶 " 時不應出現按鈕
  const checkCardState = (cardState) => (cardState !== '新申請' && cardState !== '已銷戶');

  useCheckLocation();
  usePageInfo('/api/lossReissue');

  useEffect(async () => {
    /* ========== mock data (for mock api) ========== */
    // const response = await doGetInitData('/api/lossReissue');
    // if (response.initData) {
    //   const {
    //     // fastLogin,
    //     accountNo, cardStatus, userAddress,
    //   } = response.initData;
    //   dispatch(setAccount(accountNo));
    //   dispatch(setCardState(cardStatus));
    //   dispatch(setUserAddress(userAddress));
    // }

    /* ========== mock data (for prototype) ========== */
    const { accountNo, cardStatus, userAddress } = mockData.getInitData;
    dispatch(setAccount(accountNo));
    dispatch(setCardState(cardStatus));
    dispatch(setUserAddress(userAddress));
  }, []);

  useEffect(() => {
    const userPassword = watch('password');
    if (userPassword.length >= 1) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [watch('password')]);

  return (
    <LossReissueWrapper>
      <form onSubmit={handleSubmit(handleClickSubmitButton)}>
        <div>
          <div>
            <FEIBInputLabel>帳號</FEIBInputLabel>
            <FEIBInput name="account" value={account} disabled />
            <FEIBErrorMessage />
          </div>

          <div>
            <FEIBInputLabel>金融卡狀態</FEIBInputLabel>
            <FEIBInput name="state" value={state} disabled />
            <FEIBErrorMessage />
          </div>

          { checkCardState(state) && renderPasswordInput() }

          <Accordion space={checkCardState(state) && 'top'} open>
            <ol>
              <li>Bankee存款帳戶申請補發Bankee金融卡，手續費新臺幣(以下同)100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除(前述Bankee存款帳戶泛指持有「Bankee數位存款帳戶」或「Bankee一般帳戶」者，以下簡稱本存戶)。</li>
              <li>本存戶向遠東國際商業銀行辦理金融卡申請/異動申請，除金融卡註銷外，嗣後往來仍悉遵「遠東國際商業銀行金融卡服務約定事項」有關業務規定辦理。</li>
              <li>於各項異動手續辦理妥前，所有使用本存戶Bankee金融卡之交易或申請人為不實之申請，而致蒙受損害時，其一切損害及責任概由本存戶負責。</li>
              <li>本存戶於申請此服務時，業已審閱並充分了解全部內容，並完全同意後才使用各項服務及申請憑證。</li>
            </ol>
          </Accordion>
        </div>

        { checkCardState(state) && renderButton(state) }
      </form>
      { openConfirmDialog && renderConfirmDialog() }
    </LossReissueWrapper>
  );
};

export default LossReissue;
