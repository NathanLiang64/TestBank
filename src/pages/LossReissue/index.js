import { useHistory } from 'react-router';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import Alert from 'components/Alert';
import NoticeArea from 'components/NoticeArea';
import { FEIBInput, FEIBInputLabel, FEIBButton } from 'components/elements';
import theme from 'themes/theme';
import LossReissueWrapper from './lossReissue.style';
import { setActionText, setDialogContent } from './stores/actions';

const LossReissue = () => {
  const cardValues = useSelector(({ lossReissue }) => lossReissue.cardValues);
  const actionText = useSelector(({ lossReissue }) => lossReissue.actionText);
  const dialogContent = useSelector(({ lossReissue }) => lossReissue.dialogContent);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { push } = useHistory();
  const dispatch = useDispatch();
  const handleToggleDialog = (boolean) => {
    setOpenDialog(boolean);
  };

  const handleClickMainButton = () => {
    // 點擊確定申請後關閉彈窗並顯示成功申請
    handleToggleDialog(false);
    setShowAlert(true);
    push('/lossReissue2');
  };

  /*
  * 卡片狀態為 " 臨時掛失中 " 或 " 已啟用 " 時應顯示 " 掛失申請 " 按鈕
  * 卡片狀態為 " 已掛失 " 或 " 已註銷 " 時應顯示 " 補發申請 " 按鈕
  * */
  const renderButton = (state) => {
    if (state === '臨時掛失中' || state === '已啟用') {
      dispatch(setActionText('掛失'));
      dispatch(setDialogContent('是否確定掛失申請？'));
    } else {
      dispatch(setActionText('補發'));
      dispatch(setDialogContent('申請後約5-7個工作天，我們會將金融卡寄送至您留存在本行的通訊地址：台北市信義區信義路4段5號6樓。若您的通訊地址需要變更，請至設定->基本資料變更操作，感謝您！是否確認補發申請？'));
    }
    return (
      <div>
        <FEIBButton
          $color={theme.colors.basic.white}
          $bgColor={theme.colors.primary.brand}
          $pressedBgColor={theme.colors.primary.dark}
          onClick={() => handleToggleDialog(true)}
        >
          { `${actionText}申請` }
        </FEIBButton>
      </div>
    );
  };

  // 卡片狀態為 " 新申請 " 或 " 已銷戶 " 時不應出現按鈕
  const checkCardState = (state) => (state !== '新申請' && state !== '已銷戶') && renderButton(state);

  return (
    <LossReissueWrapper>
      {showAlert && <Alert state="success">{`已完成${actionText}申請`}</Alert>}

      <div>
        <FEIBInputLabel $color={theme.colors.primary.dark}>帳號</FEIBInputLabel>
        <FEIBInput
          name="account"
          value={cardValues.account}
          disabled
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          // onChange={handleChangeInput}
        />
      </div>

      <div>
        <FEIBInputLabel $color={theme.colors.primary.dark}>金融卡狀態</FEIBInputLabel>
        <FEIBInput
          name="state"
          value={cardValues.state}
          disabled
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          // onChange={handleChangeInput}
        />
      </div>

      { checkCardState(cardValues.state) }

      <NoticeArea>
        <p>1. Bankee存款帳戶申請補發Bankee金融卡，手續費新臺幣(以下同)100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除(前述Bankee存款帳戶泛指持有「Bankee數位存款帳戶」或「Bankee一般帳戶」者，以下簡稱本存戶)。</p>
        <p>2. 本存戶向遠東國際商業銀行辦理金融卡申請/異動申請，除金融卡註銷外，嗣後往來仍悉遵「遠東國際商業銀行金融卡服務約定事項」有關業務規定辦理。</p>
        <p>3. 於各項異動手續辦理妥前，所有使用本存戶Bankee金融卡之交易或申請人為不實之申請，而致蒙受損害時，其一切損害及責任概由本存戶負責。</p>
        <p>4. 本存戶於申請此服務時，業已審閱並充分了解全部內容，並完全同意後才使用各項服務及申請憑證。</p>
      </NoticeArea>

      <Dialog
        isOpen={openDialog}
        onClose={() => handleToggleDialog(false)}
        content={dialogContent}
        action={(
          <ConfirmButtons
            mainButtonOnClick={handleClickMainButton}
            subButtonOnClick={() => handleToggleDialog(false)}
          />
        )}
      />
    </LossReissueWrapper>
  );
};

export default LossReissue;
