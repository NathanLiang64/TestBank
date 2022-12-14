/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  FEIBButton, FEIBInputLabel, FEIBInput, FEIBErrorMessage, FEIBIconButton,
} from 'components/elements';
import Badge from 'components/Badge';
import Avatar from 'components/Avatar';
import BankCodeInput from 'components/BankCodeInput';
import { getBankCode } from 'utilities/CacheData';
import { accountFormatter } from 'utilities/Generator';

import { ArrowBackIcon, EditIcon } from 'assets/images/icons';
import { DrawerWrapper } from './D00500.style';

/**
 * 編輯/新增銀行帳號。
 * @param {{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }} initData
 * @param {Function} onFinished 完成編輯時的事件。
 */
function AccountEditor({
  initData, // 有預設 acctId 時，會直接開在第二頁，而且不能回到第一頁！
  onFinished,
}) {
  const [bankList, setBankList] = useState([]);
  const [model, setModel] = useState(initData);
  const [confirmPage, setConfirmPage] = useState();

  // Form 欄位名稱。
  const idBankNo = 'bankId'; // 銀行代碼。
  const idAcctNo = 'acctId'; // 帳號
  const idNickName = 'nickName'; // 暱稱

  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    bankId: yup.string().required('請選擇銀行'),
    acctId: yup.string().required('請輸入帳號').matches(/^(\d{10,14})?$/, '銀行帳號必定是由10~14個數字所組成'),
  });

  /**
   * 表單
   */
  const {
    control, getValues, handleSubmit, formState: { errors }, setValue, trigger,
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: initData,
  });

  /**
   *- 初始化
   */
  useEffect(async () => {
    const banks = await getBankCode();
    setBankList(banks);
  }, []);

  // 取得完整banklist後再檢查有無初始值
  useEffect(() => {
    // NOTE 若有指定初始值，則直接進到第二頁。 D00100_2會用到！
    if (bankList.length && initData?.acctId) {
      onPage1Submit(initData);
    }
  }, [bankList.length]);

  /**
   * 第一頁 - 選銀行及輸入帳號
   */
  const renderPage1 = () => (
    <form className="flex-col" onSubmit={handleSubmit(onPage1Submit)}>
      <div>
        <BankCodeInput
          control={control}
          name={idBankNo}
          setValue={setValue}
          trigger={trigger}
          value={getValues(idBankNo)}
          errorMessage={errors.bankId?.message}
        />
      </div>
      <div>
        <FEIBInputLabel htmlFor={idAcctNo}>帳號</FEIBInputLabel>
        <Controller
          control={control}
          name={idAcctNo}
          value={model.acctId}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="number"
              inputMode="numeric"
              placeholder="請輸入常用的銀行帳號"
              inputProps={{ maxLength: 14, autoComplete: 'off' }}
              error={!!errors?.acctId}
            />
          )}
        />
        <FEIBErrorMessage>{errors.acctId?.message}</FEIBErrorMessage>
      </div>

      <FEIBButton type="submit">下一步</FEIBButton>
    </form>
  );

  const onPage1Submit = (values) => {
    setModel({
      ...model,
      ...values,
      bankName: bankList.find((b) => b.bankNo === getValues(idBankNo)).bankName, // 保留選取銀行的名稱
    });

    // TODO 檢查是否已是存在的帳號，若是則 Alert 用戶，會以 Update 方式更新原常用帳號的 暱稱/大頭貼。

    setConfirmPage(true);
  };

  /**
   * 第二頁 - 輸入暱稱，編輯完成。
   */
  const renderPage2 = () => {
    const onSubmit = (values) => {
      const newModel = {
        ...model,
        headshot: values.headshot,
        nickName: values.nickName,
      };
      onFinished(newModel);
    };
    return (
      <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Badge>
          <div className="label">帳號</div>
          <div className="text-blue">
            {`${model.bankName} ${accountFormatter(model.acctId)}`}
            <FEIBIconButton className="editButton" $fontSize={1.6} onClick={() => setConfirmPage(false)}>
              <EditIcon />
            </FEIBIconButton>
          </div>

        </Badge>
        <div className="flex-col">
          <div className="self-center">
            {/* 可變更常用帳號的人的大頭貼 */}
            <Avatar editable memberId={model.headshot} onNewPhotoLoaded={(headshot) => setValue('headshot', headshot)} name={model.nickName} />
          </div>
          <FEIBInputLabel htmlFor={idNickName}>暱稱</FEIBInputLabel>
          <Controller
            name={idNickName}
            defaultValue={model.nickName}
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                autoComplete="off"
                placeholder="請輸入容易讓您記住此帳號的暱稱"
                inputProps={{ maxLength: 20 }}
                error={!!errors?.nickName} // 畫紅底線
              />
            )}
          />
          <FEIBButton type="submit">完成</FEIBButton>
        </div>
      </form>
    );
  };

  /**
   * HTML輸出。
   */
  return (bankList.length) ? (

    <DrawerWrapper>
      <FEIBIconButton className="goBack" $fontSize={1.6} onClick={() => setConfirmPage(false)} $hide={!confirmPage || initData?.acctId}>
        <ArrowBackIcon />
      </FEIBIconButton>
      {confirmPage ? renderPage2() : renderPage1()}
    </DrawerWrapper>

  ) : null;
}

/**
 * 預設值：台灣銀行(004)
 */
AccountEditor.defaultProps = {
  initData: { bankId: '', acctId: '', nickName: '' },
  onFinished: null,
};

export default AccountEditor;
