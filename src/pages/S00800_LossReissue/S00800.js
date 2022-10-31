import { useEffect, useMemo, useState } from 'react';
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

import {getStatus, reIssueOrLost} from './api';
import LossReissueWrapper from './lossReissue.style';
import {
  actionTextGenerator, cityOptions, zoneOptions,
} from './utils';
import { generateSchema } from './validationSchema';

const LossReissue = () => {
  const dispatch = useDispatch();
  const [debitCardInfo, setDebitCardInfo] = useState();
  const [currentFormValue, setCurrentFormValue] = useState({});
  const actionText = useMemo(() => actionTextGenerator(debitCardInfo?.status), [debitCardInfo]);
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(generateSchema(actionText)),
    defaultValues: {
      // ...目前尚未得知補發 api 需要帶哪些資訊，先預設 addrDistrict
      addrDistrict: '',
      addrCity: '',
      addrStreet: '',
    },
  });

  // 在 新申請(1) 或是 已銷戶(7) 的情況下不能進行掛失或補發
  const updateDebitCardStatus = async () => {
    const cardInfo = await getStatus();
    if (cardInfo) {
      if (cardInfo.status === 1 || cardInfo.status === 7) {
        await showCustomPrompt({
          message: cardInfo.statusDesc,
          onOk: () => closeFunc(),
          onClose: () => closeFunc(),
        });
      }

      setDebitCardInfo(cardInfo);
      const { addrCity, addrDistrict, addrStreet } = cardInfo;
      reset({ addrCity, addrDistrict, addrStreet });
      setCurrentFormValue({ addrCity, addrDistrict, addrStreet });
    }
  };

  // 執行掛失或補發
  const executeAction = async (values) => {
    const res = await reIssueOrLost(values);
    showCustomPrompt({
      message: (
        <SuccessFailureAnimations
          isSuccess={res && res.result}
          successTitle={`${actionText}設定成功`}
          errorTitle={`${actionText}設定失敗`}
          successDesc={`狀態： (${debitCardInfo?.account}) ${res.message}`}
          errorDesc={`狀態： (${debitCardInfo?.account}) ${res.message}`}
        />
      ),
      onOk: () => updateDebitCardStatus(),
      onclose: () => updateDebitCardStatus(),
    });
  };

  const handleClickSubmitButton = (values) => {
    showCustomPrompt({
      message: `是否確認${actionText}?`,
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
            <DropdownField
              labelName="縣市"
              options={cityOptions}
              name="addrCity"
              control={control}
            />
          </div>
          <div>
            <DropdownField
              labelName="區域"
              options={zoneOptions}
              name="addrDistrict"
              control={control}
            />
          </div>
        </div>
        <div>
          <TextInputField
            labelName="地址"
            name="addrStreet"
            control={control}
          />
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

  // useEffect(() => {
  //   if (debitCardInfo?.cardStatus === '01') {
  //     showCustomPrompt({
  //       message: '卡片狀態:新申請',
  //       onOk: () => closeFunc(),
  //       onClose: () => closeFunc(),
  //     });
  //   } else {
  //     const action = actionTextGenerator(debitCardInfo?.cardStatus);
  //     setActionText(action);
  //   }
  // }, [debitCardInfo?.cardStatus]);

  // 提供 react-hook-form 預設值
  // useEffect(() => {
  //   if (debitCardInfo) {
  //     const { addrDistrict, addrCity, addrStreet } = debitCardInfo;
  //     const defaultValues = { addrDistrict, addrCity, addrStreet };
  //     reset(defaultValues);
  //     setCurrentFormValue(defaultValues);
  //   }
  // }, [debitCardInfo]);

  return (
    <Layout title="金融卡掛失/補發">
      <LossReissueWrapper small>
        <div className="lossReissueContent">
          <ul className="mainBlock">
            <li>
              <div className="blockLeft">
                <p className="label debitCardStatusLabel">金融卡狀態</p>
                <span className="content">{debitCardInfo?.account || '-'}</span>
              </div>
              <div className="blockRight">
                <h3 className="debitState">{debitCardInfo?.statusDesc}</h3>
              </div>
            </li>
            {actionText === '補發' && (
              <li>
                <div className="blockLeft">
                  <p className="label">通訊地址</p>
                  <span className="content">{currentFormValue.addrStreet || '-'}</span>
                </div>
                <div className="blockRight">
                  <button type="button" onClick={handleClickEditAddress}>
                    <EditIcon />
                  </button>
                </div>
              </li>
            )}
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

        {actionText && (
          <FEIBButton onClick={handleSubmit(handleClickSubmitButton)}>
            {`${actionText}申請`}
          </FEIBButton>
        )}
      </LossReissueWrapper>
    </Layout>
  );
};

export default LossReissue;
