import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import { lossReissueApi } from 'apis';
import Dialog from 'components/Dialog';
import NoticeArea from 'components/NoticeArea';
import ConfirmButtons from 'components/ConfirmButtons';
import { FEIBInput, FEIBInputLabel, FEIBButton } from 'components/elements';
import theme from 'themes/theme';
import LossReissueWrapper from './lossReissue.style';
import LossReissue2 from './lossReissue_2';
import {
  setActionText, setAccount, setCardState, setUserAddress, setIsResultSuccess,
} from './stores/actions';

const LossReissue = () => {
  const account = useSelector(({ lossReissue }) => lossReissue.account);
  const state = useSelector(({ lossReissue }) => lossReissue.state);
  const actionText = useSelector(({ lossReissue }) => lossReissue.actionText);
  const address = useSelector(({ lossReissue }) => lossReissue.address);
  const [openDialog, setOpenDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showAlert, setShowAlert] = useState(false);

  const dispatch = useDispatch();
  const { doGetInitData } = lossReissueApi;

  useEffect(async () => {
    const response = await doGetInitData('/api/lossReissue');
    if (response.initData) {
      const {
      // fastLogin,
        accountNo,
        cardStatus,
        userAddress,
      } = response.initData;
      dispatch(setAccount(accountNo));
      dispatch(setCardState(cardStatus));
      dispatch(setUserAddress(userAddress));
    }
  }, []);

  const handleToggleDialog = (boolean) => {
    setOpenDialog(boolean);
  };

  // 點擊確定後顯示申請結果
  const handleClickMainButton = () => {
    // 開啟顯示結果的彈窗
    setShowResultDialog(true);
    // call api 決定顯示申請成功失敗結果
    setShowAlert(true);
    dispatch(setIsResultSuccess(true));
  };

  // 點擊結果彈窗內的確定按鈕後關閉彈窗
  const handleClickResultMainButton = () => {
    setShowResultDialog(false);
    setShowAlert(false);
    handleToggleDialog(false);
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
      <div>
        <FEIBButton onClick={() => handleToggleDialog(true)}>
          { `${actionText}申請` }
        </FEIBButton>
      </div>
    );
  };

  const ConfirmDialog = () => (
    <Dialog
      isOpen={openDialog}
      onClose={() => handleToggleDialog(false)}
      content={<DialogContent />}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handleClickMainButton}
          subButtonOnClick={() => handleToggleDialog(false)}
        />
      )}
    />
  );

  const ResultDialog = () => (
    <Dialog
      isOpen={openDialog}
      onClose={() => handleToggleDialog(false)}
      content={<LossReissue2 />}
      action={(
        <FEIBButton onClick={handleClickResultMainButton}>確定</FEIBButton>
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
  const checkCardState = (cardState) => (cardState !== '新申請' && cardState !== '已銷戶') && renderButton(cardState);

  useCheckLocation();
  usePageInfo('/api/lossReissue');

  return (
    <LossReissueWrapper>
      <div>
        <FEIBInputLabel>帳號</FEIBInputLabel>
        <FEIBInput
          name="account"
          value={account}
          disabled
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
        />
      </div>

      <div>
        <FEIBInputLabel>金融卡狀態</FEIBInputLabel>
        <FEIBInput
          name="state"
          value={state}
          disabled
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          $bottomSpace={false}
        />
      </div>

      <NoticeArea textAlign="left">
        <p>1. Bankee存款帳戶申請補發Bankee金融卡，手續費新臺幣(以下同)100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除(前述Bankee存款帳戶泛指持有「Bankee數位存款帳戶」或「Bankee一般帳戶」者，以下簡稱本存戶)。</p>
        <p>2. 本存戶向遠東國際商業銀行辦理金融卡申請/異動申請，除金融卡註銷外，嗣後往來仍悉遵「遠東國際商業銀行金融卡服務約定事項」有關業務規定辦理。</p>
        <p>3. 於各項異動手續辦理妥前，所有使用本存戶Bankee金融卡之交易或申請人為不實之申請，而致蒙受損害時，其一切損害及責任概由本存戶負責。</p>
        <p>4. 本存戶於申請此服務時，業已審閱並充分了解全部內容，並完全同意後才使用各項服務及申請憑證。</p>
      </NoticeArea>

      { checkCardState(state) }

      { showResultDialog ? <ResultDialog /> : <ConfirmDialog /> }
    </LossReissueWrapper>
  );
};

export default LossReissue;
