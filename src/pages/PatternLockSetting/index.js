/* eslint-disable no-case-declarations,no-restricted-globals */
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useCheckLocation, usePageInfo } from 'hooks';
import { patternLockSettingApi } from 'apis';
import Dialog from 'components/Dialog';
import NoticeArea from 'components/NoticeArea';
import ConfirmButtons from 'components/ConfirmButtons';
import {
  FEIBButton, FEIBCheckbox, FEIBCheckboxLabel, FEIBInput, FEIBInputLabel, FEIBSwitch, FEIBSwitchLabel,
} from 'components/elements';
import theme from 'themes/theme';
import PatternLockSettingWrapper from './patternLockSetting.style';
import PatternLockSetting2 from './patternLockSetting_2';
import { setIsActive, setIsResultSuccess, setType } from './stores/actions';
import e2ee from '../../utilities/E2ee';

const { init } = patternLockSettingApi;
const PatternLockSetting = () => {
  const patternLockSettingData = useSelector(({ patternLockSetting }) => patternLockSetting);
  const [checkBoxCheck, setcheckBoxCheck] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [isActive, setisActive] = useState(patternLockSettingData.isActive);
  const differentState = isActive !== patternLockSettingData.isActive;

  const { control, handleSubmit, watch } = useForm();
  const dispatch = useDispatch();

  useCheckLocation();
  usePageInfo('/api/patternLockSetting');

  useEffect(async () => {
    const data = await init();
    // 儲存api的值到redux中
    dispatch(setIsActive(data.initData.isActive));
    // 儲存api的值到頁面的state中
    setisActive(data.initData.isActive);
  }, []);

  useEffect(() => {
    const password = watch('password');
    if (checkBoxCheck && password !== '' && differentState) {
      setDisabled(false);
    } else if (password !== '' && patternLockSettingData.isActive) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [checkBoxCheck, watch('password'), isActive]);

  const switchChange = () => {
    setisActive(!isActive);
  };

  const checkBoxChange = () => {
    setcheckBoxCheck((prev) => !prev);
  };

  const handleClickConfirmMainButton = () => {
    // 關閉當前的確認彈窗
    setShowConfirmDialog(false);
    // call api 決定變更結果
    dispatch(setIsResultSuccess(true));
    // 開啟顯示結果的彈窗
    setShowResultDialog(true);
  };

  const handleClickResultMainButton = () => {
    // 關閉顯示結果的彈窗
    setShowResultDialog(false);

    location.reload();
    // 回到個人化資料設定主頁
  };

  const onSubmit = async (data) => {
    data.password = await e2ee(data.password);
    /**
       *
       * @type {number}
       * 1: 未啟用 -> 啟用
       * 2: 啟用後變更圖案
       * 3: 啟用 -> 未啟用
       */
    let type = 1;
    if (!patternLockSettingData.isActive && differentState) {
      type = 1;
    } else if (patternLockSettingData.isActive && !differentState) {
      type = 2;
    } else {
      type = 3;
    }
    dispatch(setType(type));
    switch (type) {
      case 3:
        setShowConfirmDialog(true);
        break;
      default:
        const result = confirm('原生畫面');
        if (result) {
          setShowConfirmDialog(true);
        }
    }
  };

  const ConfirmDialog = () => (
    <Dialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      content={<p>您確定要變更圖形密碼設定嗎？</p>}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handleClickConfirmMainButton}
          subButtonOnClick={() => setShowConfirmDialog(false)}
        />
      )}
    />
  );

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={<PatternLockSetting2 />}
      action={(
        <FEIBButton onClick={handleClickResultMainButton}>確定</FEIBButton>
      )}
    />
  );

  const SwitchArea = () => (
    <FEIBSwitchLabel
      control={(
        <FEIBSwitch
          checked={isActive}
          onChange={switchChange}
        />
      )}
      label="圖形密碼登入啟用"
      $hasBorder
    />
  );
  const TextArea = () => (
    <NoticeArea title="圖形密碼登入使用條款" textAlign="left" className="customBottomSpace">
      <p>
        1. 本人同意與遠東商銀約定以本手機做為登入遠東商銀行動銀行APP時身分認證之用。爾後欲取消約定時，將由本人登入後至
        <span className="textColorPrimary">服務設定➝圖形密碼登入設定/變更/取消</span>
        功能中設定。
      </p>
      <p>2. 為保障使用安全，本人以圖形密碼登入後僅查詢帳戶相關資料，如需執行交易類功能，將於交易過程中另行輸入網路銀行密碼。</p>
      <p>3. 圖形密碼登入連續三次錯誤時，系統將鎖住該功能，如欲重新使用，本人應於APP首頁以身分證字號、使用者代碼、網銀密碼登入後，進行解鎖。</p>
      <p>4. 圖形密碼請設定6~12個點(可重覆)。</p>
      <p>5. 本功能只提供本人之一台手機中設定，如於本人之其他手機中設定，則原手機設定將自動解除。</p>
      <p>6. 如果手機重置或重新安裝APP時，需要重新設定本功能。</p>
    </NoticeArea>
  );

  const CheckArea = () => (
    <div>
      <FEIBCheckboxLabel
        control={(
          <FEIBCheckbox
            onChange={checkBoxChange}
            color="default"
          />
        )}
        label="本人以閱讀並同意上述[圖形密碼登入]使用條款"
      />
    </div>
  );

  const PassWordArea = () => (
    <div className="passwordArea">
      <FEIBInputLabel htmlFor="password">網銀密碼</FEIBInputLabel>
      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FEIBInput
            {...field}
            id="password"
            name="password"
            type="password"
            placeholder="請輸入您的網銀密碼"
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        )}
      />

    </div>
  );
  const ButtonArea = () => (
    <div>
      {
        (differentState || patternLockSettingData.isActive === false) && (
        <FEIBButton disabled={isDisabled} type="submit">
          儲存變更
        </FEIBButton>
        )
      }
      {
        (patternLockSettingData.isActive === true && !differentState) && (
        <FEIBButton disabled={isDisabled} type="submit">
          變更圖形密碼
        </FEIBButton>
        )
      }
    </div>

  );

  return (
    <PatternLockSettingWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        {SwitchArea()}
        {TextArea()}
        { !patternLockSettingData.isActive && CheckArea()}
        {PassWordArea()}
        {ButtonArea()}
        { showResultDialog ? ResultDialog() : ConfirmDialog() }
      </form>
    </PatternLockSettingWrapper>
  );
};

export default PatternLockSetting;
