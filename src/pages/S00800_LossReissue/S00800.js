/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { DropdownField, TextInputField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import { EditIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';
import { closeFunc } from 'utilities/AppScriptProxy';
import { useDispatch } from 'react-redux';
import { setModalVisible } from 'stores/reducers/ModalReducer';

import { executeDebitCardReApply, executeDebitCardReportLost, getDebitCardStatus } from './api';
import LossReissueWrapper from './lossReissue.style';
import {
  actionTextGenerator, cityOptions, statusTextGenerator, zoneOptions,
} from './utils';
import { validationSchema, generateSchema } from './validationSchema';

const LossReissue = () => {
  const dispatch = useDispatch();
  const [debitCardInfo, setDebitCardInfo] = useState(null);
  const [currentFormValue, setCurrentFormValue] = useState({});
  const [actionText, setActionText] = useState('');
  const {
    control, handleSubmit, reset,
  } = useForm({
    resolver: yupResolver(generateSchema(actionText)),
    defaultValues: {
      // ...目前尚未得知補發 api 需要帶哪些資訊，先預設 accountNo & addr
      accountNo: '',
      addr: '',
    },
  });

  const updateDebitCardStatus = async () => {
    try {
      const response = await getDebitCardStatus();
      const {addr, addrCity, addrZone} = response;
      setDebitCardInfo(response);
      setCurrentFormValue({addr, addrCity, addrZone});
    } catch (err) {
      console.log('金融卡狀態 err', err);
    }
  };

  // 執行掛失或補發
  const executeAction = async (values) => {
    try {
      // 掛失
      if (actionText === '掛失') {
        const res = await executeDebitCardReportLost({accountNo: values.accountNo});
        if (!res || res.code) throw new Error(`執行掛失失敗 ${res.code}`);
      } else {
      // 補發
        const res = await executeDebitCardReApply(values);
        if (!res || res.code) throw new Error(`執行補發失敗 ${JSON.stringify(res)}`);
      }
      showCustomPrompt({
        message: (
          <SuccessFailureAnimations
            isSuccess
            successTitle="設定成功"
            successDesc={`狀態：${actionText} (${debitCardInfo?.accountNo})`}
          />
        ),
        onOk: () => updateDebitCardStatus(),
        onclose: () => updateDebitCardStatus(),
      });
    } catch (error) {
      showCustomPrompt({
        message: (
          <SuccessFailureAnimations
            isSuccess={false}
            errorTitle="設定失敗"
            errorDesc={error.message}
          />
        ),
        onOk: () => updateDebitCardStatus(),
        onclose: () => updateDebitCardStatus(),
      });
    }
  };

  const handleClickSubmitButton = (values) => {
    showCustomPrompt({
      message: (
        <p>
          是否確認
          {actionText}
          <br />
          {JSON.stringify(values)}
          ?
        </p>
      ),
      onOk: () => executeAction(values),
      noDismiss: true,
    });
  };

  // TODO: webctl 地址欄位 api 待修正，現為 1 欄字串，待修為改城市、行政區、詳細地址 3 欄
  const renderEditAddressContent = () => (
    <form>
      <div className="formContent">
        <div className="formElementGroup">
          <div>
            <DropdownField labelName="縣市" options={cityOptions} name="addrCity" control={control} />
          </div>
          <div>
            <DropdownField labelName="區域" options={zoneOptions} name="addrZone" control={control} />
          </div>
        </div>
        <div>
          <TextInputField labelName="地址" name="addr" control={control} />
        </div>
      </div>
    </form>
  );

  const handleClickEditAddress = () => {
    showCustomPrompt({
      title: '通訊地址',
      message: renderEditAddressContent(),
      okContent: '完成',
      onOk: handleSubmit((values) => {
        setCurrentFormValue(values);
        dispatch(setModalVisible(false));
      }),
      onClose: () => {
        reset(currentFormValue);
      },
      noDismiss: true,
    });
  };

  useEffect(async () => {
    updateDebitCardStatus();
  }, []);

  useEffect(() => {
    if (debitCardInfo?.cardStatus === '01') {
      showCustomPrompt({
        message: '卡片狀態:新申請',
        onOk: () => closeFunc(),
        onClose: () => closeFunc(),
      });
    } else {
      const action = actionTextGenerator(debitCardInfo?.cardStatus);
      setActionText(action);
    }
  }, [debitCardInfo?.cardStatus]);

  // 提供 react-hook-form 預設值
  useEffect(() => {
    if (debitCardInfo) {
      const {
        accountNo, addr, addrZone, addrCity,
      } = debitCardInfo;
      const defaultValues = {
        addr, addrZone, addrCity, accountNo,
      };
      reset(defaultValues);
      setCurrentFormValue(defaultValues);
    }
  }, [debitCardInfo]);

  return (
    <Layout title="金融卡掛失/補發">

      <LossReissueWrapper small>
        <div className="lossReissueContent">
          <ul className="mainBlock">
            <li>
              <div className="blockLeft">
                <p className="label debitCardStatusLabel">金融卡狀態</p>
                <span className="content">{debitCardInfo?.accountNo || '-'}</span>
              </div>
              <div className="blockRight">
                <h3 className="debitState">{statusTextGenerator(debitCardInfo?.cardStatus)}</h3>
              </div>
            </li>
            {actionText === '補發' ? (
              <li>
                <div className="blockLeft">
                  <p className="label">通訊地址</p>
                  <span className="content">{currentFormValue.addr || '-'}</span>
                </div>
                <div className="blockRight">
                  <button type="button" onClick={handleClickEditAddress}>
                    <EditIcon />
                  </button>
                </div>
              </li>
            ) : null}
          </ul>

          {actionText === '補發' && (
            <p className="notice">
              手續費新台幣100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除。
              <br />
              申請後5-7個工作天，我們會將金融卡寄送至您留存在本行的通訊地址。
            </p>
          )}

          <Accordion space="top">
            <ol>
              <li>Bankee存款帳戶申請補發Bankee金融卡，手續費新臺幣(以下同)100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除(前述Bankee存款帳戶泛指持有「Bankee數位存款帳戶」或「Bankee一般帳戶」者，以下簡稱本存戶)。</li>
              <li>本存戶向遠東國際商業銀行辦理金融卡申請/異動申請，除金融卡註銷外，嗣後往來仍悉遵「遠東國際商業銀行金融卡服務約定事項」有關業務規定辦理。</li>
              <li>於各項異動手續辦理妥前，所有使用本存戶Bankee金融卡之交易或申請人為不實之申請，而致蒙受損害時，其一切損害及責任概由本存戶負責。</li>
              <li>本存戶於申請此服務時，業已審閱並充分了解全部內容，並完全同意後才使用各項服務及申請憑證。</li>
            </ol>
          </Accordion>
        </div>

        {actionText ? (
          <FEIBButton onClick={handleSubmit(handleClickSubmitButton)}>
            { `${actionText}申請` }
          </FEIBButton>
        ) : null}

      </LossReissueWrapper>
    </Layout>
  );
};

export default LossReissue;

// executeDebitCardReApply(params)
//   .then((response) => {
//     console.log('執行補發 response', response);
//     showCustomPrompt({
//       message: (
//         <SuccessFailureAnimations
//           isSuccess
//           successTitle="設定成功"
//           errorTitle="設定失敗"
//           successDesc={`狀態：${actionText} (${debitCardInfo?.accountNo})`}
//         />
//       ),
//       onOk: () => updateDebitCardStatus(),
//       onclose: () => updateDebitCardStatus(),
//     });
//   }).catch((err) => console.log('執行補發 err', err));

// const renderEditAddressContent = () => (
//     <form>
//       <div className="formContent">
//         <div className="formElementGroup">
//           <div>
//             <FEIBInputLabel htmlFor="transactionFrequency">通訊地址</FEIBInputLabel>
//             <Controller
//               name="addrCity"
//               control={control}
//               defaultValue="1"
//               render={({ field }) => {
//                 const {onChange, value} = field;
//                 return (
//                   <FEIBSelect onChange={onChange} value={value} id="transactionFrequency" name="transactionFrequency">
//                     <FEIBOption value="010">台北市</FEIBOption>
//                     <FEIBOption value="020">新北市</FEIBOption>
//                   </FEIBSelect>
//                 );
//               }}
//             />
//             <FEIBErrorMessage>{errors.city?.message}</FEIBErrorMessage>
//           </div>
//           <div>
//             <Controller
//               name="addrZone"
//               control={control}
//               defaultValue="1"
//               render={({ field }) => {
//                 const {onChange, value} = field;
//                 return (
//                   <FEIBSelect onChange={onChange} value={value} id="transactionCycle" name="transactionCycle">
//                     <FEIBOption value="40820">大安區</FEIBOption>
//                     <FEIBOption value="40821">信義區</FEIBOption>
//                   </FEIBSelect>
//                 );
//               }}
//             />
//             <FEIBErrorMessage>{errors.district?.message}</FEIBErrorMessage>
//           </div>
//         </div>
//         <div>
//           <Controller
//             name="addr"
//             defaultValue={debitCardInfo?.addr}
//             control={control}
//             render={({ field }) => {
//               const {onChange, value} = field;
//               return (
//                 <FEIBInput onChange={onChange} value={value} placeholder="請輸入" error={!!errors.address} />
//               );
//             }}
//           />
//           <FEIBErrorMessage>{errors.address?.message}</FEIBErrorMessage>
//         </div>
//       </div>
//     </form>
//   );
