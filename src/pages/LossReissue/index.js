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

  const dispatch = useDispatch();
  // const handleChangeInput = (event) => {
  //   dispatch(setCardValues({ ...cardValues, [event.target.name]: event.target.value }));
  // };
  const handleToggleDialog = (boolean) => {
    setOpenDialog(boolean);
  };

  const handleClickMainButton = () => {
    // 點擊確定申請後關閉彈窗並顯示成功申請
    handleToggleDialog(false);
    setShowAlert(true);
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
        <p>( 注意事項文案相關內容，應由 API 回傳 )</p>
        <p>由於本介面空間較大，建議可直接將注意事項顯示出來。由於本屆面空間較大，建議可直接將注意事項顯示出來。由於本屆面空間較大，建議可直接將注意事項顯示出來。</p>
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
