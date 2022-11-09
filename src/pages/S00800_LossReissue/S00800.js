/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { DropdownField, TextInputField } from 'components/Fields';
import { FEIBButton, FEIBInputLabel } from 'components/elements';
import { EditIcon } from 'assets/images/icons';
import { showCustomDrawer, showCustomPrompt, showError } from 'utilities/MessageModal';
import { closeFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { useDispatch } from 'react-redux';
import { setDrawerVisible, setModalVisible } from 'stores/reducers/ModalReducer';

import { getCountyList } from 'pages/T00700_BasicInformation/api';
import {getStatus, reIssueOrLost} from './api';
import LossReissueWrapper, {
  LossReissueDialogWrapper,
} from './lossReissue.style';
import {actionTextGenerator} from './utils';
import { validationSchema } from './validationSchema';

const LossReissue = () => {
  const dispatch = useDispatch();
  const [debitCardInfo, setDebitCardInfo] = useState();
  const [currentFormValue, setCurrentFormValue] = useState({});
  const [countyOptions, setCountyOptions] = useState([]);
  const actionText = useMemo(
    () => actionTextGenerator(debitCardInfo?.status),
    [debitCardInfo],
  );
  const {
    control, handleSubmit, reset, watch, getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      // ...目前尚未得知補發 api 需要帶哪些資訊，先預設 addrDistrict
      city: '',
      county: '',
      addr: '',
    },
  });

  const watchedCountyName = watch('county');

  // 在 新申請(1) 或是 已銷戶(7) 的情況下不能進行掛失或補發
  const updateDebitCardStatus = async () => {
    const cardInfo = await getStatus();
    if (cardInfo) {
      // "新申請" 或是 "已銷戶" 狀態下不可進行掛失/補發
      if (cardInfo.status === 1 || cardInfo.status === 7) {
        await showCustomPrompt({
          message: cardInfo.statusDesc,
          onOk: () => closeFunc(),
          onClose: () => closeFunc(),
        });
      }

      const formValue = {
        county: cardInfo.addrCity.trim(),
        city: cardInfo.addrDistrict.trim(),
        addr: cardInfo.addrStreet,
      };

      reset(formValue);
      setDebitCardInfo(cardInfo);
      setCurrentFormValue(formValue);
    }
  };

  // 執行掛失或補發
  const executeAction = async () => {
    const auth = await transactionAuth(0x26);
    if (auth && auth.result) {
      const res = await reIssueOrLost();
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
    }
  };

  const onActionConfirm = () => {
    showCustomPrompt({
      message: `是否確認${actionText}?`,
      onOk: () => executeAction(),
      noDismiss: true,
    });
  };

  const onSubmit = async (values) => {
    const auth = await transactionAuth(0x26);
    if (auth && auth.result) {
      // TODO 修改地址 API
      console.log(values);
    }

    dispatch(setDrawerVisible(false));
  };

  const generateCountyOptions = () => {
    if (countyOptions.length) {
      return countyOptions.map(({ countyName }) => ({
        label: countyName,
        value: countyName,
      }));
    }
    return [];
  };
  // 建立鄉鎮市區選單
  const generateDistrictOptions = () => {
    const foundDistrictOption = countyOptions.find(
      ({ countyName }) => countyName === watchedCountyName,
    );
    if (foundDistrictOption) {
      return foundDistrictOption.cities.map(({ cityName }) => ({
        label: cityName,
        value: cityName,
      }));
    }
    return [];
  };
  // TODO: webctl 地址欄位 api 待修正，現為 1 欄字串，待修為改城市、行政區、詳細地址 3 欄
  const renderEditAddressContent = () => (
    <LossReissueDialogWrapper>
      <form>
        <div className="formContent">
          <FEIBInputLabel>通訊地址</FEIBInputLabel>
          <div className="formElementGroup">
            <div>
              <DropdownField
                options={generateCountyOptions()}
                name="county"
                control={control}
              />
            </div>
            <div>
              <DropdownField
                options={generateDistrictOptions()}
                name="city"
                control={control}
              />
            </div>
          </div>
          <div>
            <TextInputField labelName="地址" name="addr" control={control} />
          </div>
        </div>
        <FEIBButton onClick={handleSubmit(onSubmit)}>
          確認
        </FEIBButton>
      </form>
    </LossReissueDialogWrapper>
  );

  const handleClickEditAddress = () => {
    showCustomDrawer({
      title: '通訊地址',
      content: renderEditAddressContent(),
      okContent: '完成',
      onClose: () => reset(currentFormValue),
    });
  };

  useEffect(async () => {
    const listResponse = await getCountyList();
    if (listResponse.code === '0000') {
      setCountyOptions(listResponse.data);
      updateDebitCardStatus();
    } else {
      showError(listResponse.message, closeFunc);
    }
  }, []);

  // 當使用者改變 "county" 值時，需要將 "city" 值清空
  useEffect(() => {
    if (watchedCountyName !== currentFormValue.county) {
      reset({ ...getValues(), city: '' });
    }
  }, [watchedCountyName]);

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
            {/* {actionText === '補發' && ( */}
            <li>
              <div className="blockLeft">
                <p className="label">通訊地址</p>
                <span className="content">
                  {currentFormValue.addrStreet || '-'}
                </span>
              </div>
              <div className="blockRight">
                <button type="button" onClick={handleClickEditAddress}>
                  <EditIcon />
                </button>
              </div>
            </li>
            {/* )} */}
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
              <li>
                Bankee存款帳戶申請補發Bankee金融卡，手續費新臺幣(以下同)100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除(前述Bankee存款帳戶泛指持有「Bankee數位存款帳戶」或「Bankee一般帳戶」者，以下簡稱本存戶)。
              </li>
              <li>
                本存戶向遠東國際商業銀行辦理金融卡申請/異動申請，除金融卡註銷外，嗣後往來仍悉遵「遠東國際商業銀行金融卡服務約定事項」有關業務規定辦理。
              </li>
              <li>
                於各項異動手續辦理妥前，所有使用本存戶Bankee金融卡之交易或申請人為不實之申請，而致蒙受損害時，其一切損害及責任概由本存戶負責。
              </li>
              <li>
                本存戶於申請此服務時，業已審閱並充分了解全部內容，並完全同意後才使用各項服務及申請憑證。
              </li>
            </ol>
          </Accordion>
        </div>

        {actionText && (
          <FEIBButton onClick={onActionConfirm}>
            {`${actionText}`}
          </FEIBButton>
        )}
      </LossReissueWrapper>
    </Layout>
  );
};

export default LossReissue;
