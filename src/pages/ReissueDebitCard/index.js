import { useState } from 'react';
import { useSelector } from 'react-redux';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';

/* Elements */
import {
  FEIBInput,
  FEIBInputLabel,
  FEIBInputAnimationWrapper,
  FEIBButton,
} from 'components/elements';

/* Styles */
import theme from 'themes/theme';
import ReissueDebitCardWrapper from './reissueDebitCard.style';
// import { setCardValues } from './stores/actions';

const ReissueDebitCard = () => {
  const cardValues = useSelector(({ reissueDebitCard }) => reissueDebitCard.cardValues);
  const [openDialog, setOpenDialog] = useState(false);

  // const dispatch = useDispatch();
  // const handleChangeInput = (event) => {
  //   dispatch(setCardValues({ ...cardValues, [event.target.name]: event.target.value }));
  // };
  const handleToggleDialog = (boolean) => {
    setOpenDialog(boolean);
  };

  /*
  * 卡片狀態為 " 臨時掛失中 " 或 " 已啟用 " 時應顯示 " 掛失申請 " 按鈕
  * 卡片狀態為 " 已掛失 " 或 " 已註銷 " 時應顯示 " 補發申請 " 按鈕
  * */
  const renderButton = (state) => (
    <FEIBButton
      $color={theme.colors.basic.white}
      $bgColor={theme.colors.primary.brand}
      $pressedBgColor={theme.colors.primary.dark}
      $width={20}
      onClick={() => handleToggleDialog(true)}
    >
      { state === '臨時掛失中' || state === '已啟用' ? '掛失申請' : '補發申請' }
    </FEIBButton>
  );

  // TODO: 應根據卡片狀態判斷顯示 "掛失" 或 "補發"，此處判斷將影響 Dialog 顯示內容，邏輯待改
  // 卡片狀態為 " 新申請 " 或 " 已銷戶 " 時不應出現按鈕
  const checkCardState = (state) => (state !== '新申請' && state !== '已銷戶') && renderButton(state);

  return (
    <ReissueDebitCardWrapper>
      <FEIBInputAnimationWrapper>
        <FEIBInputLabel $color={theme.colors.primary.dark}>帳號</FEIBInputLabel>
        <FEIBInput
          name="account"
          value={cardValues.account}
          disabled
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          // onChange={handleChangeInput}
        />
      </FEIBInputAnimationWrapper>

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

      <div>
        { checkCardState(cardValues.state) }
      </div>

      <div>
        <h3>注意事項</h3>
        <div>
          <p>( 注意事項文案相關內容，應由 API 回傳 )</p>
          <p>由於本屆面空間較大，建議可直接將注意事項顯示出來。</p>
        </div>
      </div>

      <Dialog
        isOpen={openDialog}
        onClose={() => handleToggleDialog(false)}
        title="系統訊息"
        content="是否確定掛失申請"
        action={(
          // TODO: 應根據卡片狀態判斷顯示 "掛失" 或 "補發"
          <ConfirmButtons
            mainButtonValue="掛失"
            mainButtonOnClick={() => handleToggleDialog(false)}
            subButtonValue="取消"
            subButtonOnClick={() => handleToggleDialog(false)}
          />
        )}
      />
    </ReissueDebitCardWrapper>
  );
};

export default ReissueDebitCard;
