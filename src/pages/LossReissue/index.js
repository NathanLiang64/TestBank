import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addressValidation } from 'utilities/validation';
import { useCheckLocation, usePageInfo } from 'hooks';
import Dialog from 'components/Dialog';
import Accordion from 'components/Accordion';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel, FEIBOption, FEIBSelect,
} from 'components/elements';
import { EditIcon } from 'assets/images/icons';
import { executeDebitCardReApply, executeDebitCardReportLost, getDebitCardStatus } from './api';
import LossReissueWrapper, { LossReissueDialogWrapper } from './lossReissue.style';

const LossReissue = () => {
  const [debitCardInfo, setDebitCardInfo] = useState(null);
  const [actionText, setActionText] = useState('');
  const [openDialog, setOpenDialog] = useState({
    open: false, title: '', content: <></>, buttonVisibility: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const schema = yup.object().shape({
    address: actionText === '補發' ? addressValidation() : '',
  });
  const {
    // eslint-disable-next-line no-unused-vars
    control, handleSubmit, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { goBack } = useHistory();

  const updateDebitCardStatus = () => {
    getDebitCardStatus()
      .then((response) => {
        // console.log('金融卡狀態 res', response);
        // if (response.code) dispatch(setDebitCardInfo(null));
        // dispatch(setDebitCardInfo(response));

        if (response.code) setDebitCardInfo(null);
        setDebitCardInfo(response);
      });
    // .catch((error) => console.log('金融卡狀態 err', error));
  };

  const handleEditAddress = (data) => {
    console.log('editAddress data', data);
    setOpenDialog({ ...openDialog, open: false });
  };

  const handleCloseDialog = () => {
    if (debitCardInfo?.cardStatus === '01') goBack();
    setOpenDialog({ ...openDialog, open: false });
  };

  const handleClickSubmitButton = (data) => {
    console.log('data', data);
    setOpenDialog({
      open: true,
      title: '',
      content: (
        <p>
          是否確認
          {actionText}
          ？
        </p>
      ),
      buttonVisibility: true,
    });
  };

  // 執行掛失或補發
  const executeAction = (actionType, params) => {
    // 掛失
    if (actionType === '掛失') {
      executeDebitCardReportLost(params)
        .then((response) => {
          // console.log('執行掛失 res', response);
          if (response.code) {
            setIsSuccess(false);
          } else {
            setIsSuccess(true);
          }
        });
      // .catch((error) => console.log('執行掛失 err', error));
      return;
    }

    // 補發
    executeDebitCardReApply(params)
      .then((response) => {
        // console.log('執行補發 res', response);
        if (response.code) {
          setIsSuccess(false);
        } else {
          setIsSuccess(true);
        }
      });
    // .catch((error) => console.log('執行補發 err', error));
  };

  // 點擊確定後執行申請
  const handleClickExecuteButton = () => {
    const { accountNo, addr } = debitCardInfo;
    const params = { accountNo, addr };
    executeAction(actionText, params);
    updateDebitCardStatus();

    setOpenDialog({
      ...openDialog,
      title: '',
      content: (
        <SuccessFailureAnimations
          isSuccess={isSuccess}
          successTitle="設定成功"
          errorTitle="設定失敗"
          successDesc={`狀態：${actionText}（${debitCardInfo?.accountNo}）`}
        />
      ),
      buttonVisibility: false,
    });
  };

  // TODO: webctl 地址欄位 api 待修正，現為 1 欄字串，待修為改城市、行政區、詳細地址 3 欄
  const renderEditAddressContent = () => (
    <form>
      <div className="formContent">
        <div className="formElementGroup">
          <div>
            <FEIBInputLabel htmlFor="transactionFrequency">通訊地址</FEIBInputLabel>
            <Controller
              name="city"
              control={control}
              defaultValue="1"
              render={({ field }) => (
                <FEIBSelect {...field} id="transactionFrequency" name="transactionFrequency">
                  <FEIBOption value="1">台北市</FEIBOption>
                  <FEIBOption value="2">新北市</FEIBOption>
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.city?.message}</FEIBErrorMessage>
          </div>
          <div>
            <Controller
              name="district"
              control={control}
              defaultValue="1"
              render={({ field }) => (
                <FEIBSelect {...field} id="transactionCycle" name="transactionCycle">
                  <FEIBOption value="1">大安區</FEIBOption>
                  <FEIBOption value="2">信義區</FEIBOption>
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.district?.message}</FEIBErrorMessage>
          </div>
        </div>
        <div>
          <Controller
            name="address"
            defaultValue={debitCardInfo?.addr}
            control={control}
            render={({ field }) => (
              <FEIBInput {...field} placeholder="請輸入" error={!!errors.address} />
            )}
          />
          <FEIBErrorMessage>{errors.address?.message}</FEIBErrorMessage>
        </div>
      </div>
      <FEIBButton type="button" onClick={handleSubmit(handleEditAddress)}>完成</FEIBButton>
    </form>
  );

  const handleClickEditAddress = () => {
    setOpenDialog({
      open: true,
      title: '通訊地址',
      content: renderEditAddressContent(),
      buttonVisibility: false,
    });
  };

  const renderText = (value) => value ?? '-';

  const statusTextGenerator = (status) => {
    switch (status) {
      case '01':
        return '新申請';
      case '02':
        return '尚未開卡';
      case '04':
        return '已啟用';
      case '05':
        return '已掛失';
      case '06':
        return '已註銷';
      case '07':
        return '已銷戶';
      case '08':
        return '臨時掛失中';
      case '09':
        return '申請中';
      default:
        return '-';
    }
  };

  const actionTextGenerator = (status) => {
    if (status === '01') return '';
    if (status === '02' || status === '04') return '掛失';
    return '補發';
  };

  useEffect(async () => {
    /* ========== mock data (for prototype) ========== */
    // const { accountNo, cardStatus, userAddress } = mockData.getInitData;
    // dispatch(setAccount(accountNo));
    // dispatch(setCardState(cardStatus));
    // dispatch(setUserAddress(userAddress));

    updateDebitCardStatus();
  }, []);

  useEffect(() => {
    if (debitCardInfo?.cardStatus === '01') {
      setOpenDialog({
        open: true,
        title: '',
        content: <p>晶片卡申請中提示文字</p>,
        buttonVisibility: false,
      });
    }
    const action = actionTextGenerator(debitCardInfo?.cardStatus);
    setActionText(action);
  }, [debitCardInfo?.cardStatus]);

  useCheckLocation();
  usePageInfo('/api/lossReissue');

  return (
    <LossReissueWrapper small>
      <div className="lossReissueContent">
        <ul className="mainBlock">
          <li>
            <div className="blockLeft">
              <p className="label debitCardStatusLabel">金融卡狀態</p>
              <span className="content">{renderText(debitCardInfo?.accountNo)}</span>
            </div>
            <div className="blockRight">
              <h3 className="debitState">{statusTextGenerator(debitCardInfo?.cardStatus)}</h3>
            </div>
          </li>
          { actionText === '補發' && (
            <li>
              <div className="blockLeft">
                <p className="label">通訊地址</p>
                <span className="content">{renderText(debitCardInfo?.addr)}</span>
              </div>
              <div className="blockRight">
                <button type="button" onClick={handleClickEditAddress}>
                  <EditIcon />
                </button>
              </div>
            </li>
          ) }
        </ul>

        { actionText === '補發' && (
          <p className="notice">
            申請後5-7個工作天，我們會將金融卡寄送至您留存在本行的通訊地址。
          </p>
        ) }

        <Accordion space="top">
          <ol>
            <li>Bankee存款帳戶申請補發Bankee金融卡，手續費新臺幣(以下同)100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除(前述Bankee存款帳戶泛指持有「Bankee數位存款帳戶」或「Bankee一般帳戶」者，以下簡稱本存戶)。</li>
            <li>本存戶向遠東國際商業銀行辦理金融卡申請/異動申請，除金融卡註銷外，嗣後往來仍悉遵「遠東國際商業銀行金融卡服務約定事項」有關業務規定辦理。</li>
            <li>於各項異動手續辦理妥前，所有使用本存戶Bankee金融卡之交易或申請人為不實之申請，而致蒙受損害時，其一切損害及責任概由本存戶負責。</li>
            <li>本存戶於申請此服務時，業已審閱並充分了解全部內容，並完全同意後才使用各項服務及申請憑證。</li>
          </ol>
        </Accordion>
      </div>

      { debitCardInfo?.cardStatus !== '01' && (
        <FEIBButton onClick={handleSubmit(handleClickSubmitButton)}>
          { `${actionText}申請` }
        </FEIBButton>
      ) }

      <Dialog
        title={openDialog.title}
        isOpen={openDialog.open}
        onClose={handleCloseDialog}
        content={<LossReissueDialogWrapper>{openDialog.content}</LossReissueDialogWrapper>}
        action={openDialog.buttonVisibility ? <FEIBButton onClick={handleClickExecuteButton}>確定</FEIBButton> : <div />}
      />
    </LossReissueWrapper>
  );
};

export default LossReissue;
