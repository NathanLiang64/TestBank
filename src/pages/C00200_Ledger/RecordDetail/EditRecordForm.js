/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toCurrency } from 'utilities/Generator';

import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { DropdownField, TextInputField, RadioGroupField } from 'components/Fields';
import { FEIBButton } from 'components/elements';

import { EditRecordFormWrapper } from './RecordDetail.style';
import { txUsageOptions } from '../utils/usgeType';
import { editWriteOff, getWriteOffList, setWriteOff } from './api';

const EditRecordForm = () => {
  const history = useHistory();
  const { state } = useLocation();

  const [notRecordedMode, setNotRecordedMode] = useState('0'); // 0: 選擇銷帳對象, 1: 自行編輯交易明細
  const [isShowWriteOff, setIsShowWriteOff] = useState(false); // 是否顯示 "選擇銷帳對象" 選項
  const [recordTargetList, setRecordTargetList] = useState([]); // "銷帳對象" 所有資訊清單
  const [recordTargetOptionList, setRecordTargetOptionList] = useState([]); // "銷帳對象" render選項使用資訊清單

  const notRecordedModeOptions = [
    {
      value: '0',
      label: '選擇銷帳對象',
    },
    {
      value: '1',
      label: '自行編輯交易明細',
    },
  ];

  // form: 已入帳、未入帳－自行編輯交易明細
  const schema = yup.object().shape({
    type: yup.string(),
    memo: yup.string().max(12), // 字數上限: 12
  });
  const {control, getValues: getInfoValues} = useForm({
    defaultValues: {
      type: '1',
      memo: '',
    },
    resolver: yupResolver(schema),
  });

  // form: 未入帳模式選擇("選擇銷帳對象" | "自行編輯交易明細")
  const {control: notRecordedControl, watch, reset: notRecordedReset} = useForm({
    defaultValues: {
      mode: '0',
    },
  });

  // from: 未入帳－選擇銷帳對象
  const {control: recordTargetControl, reset, getValues: getTargetValues} = useForm({
    defaultValues: {
      target: '',
    },
  });

  /* 未入帳模式選擇 */
  const onNotRecordedModeChange = () => {
    const watchValue = watch((value) => setNotRecordedMode(value.mode));
    return () => watchValue.unsubscribe();
  };

  const renderInformationContent = (title, info) => <InformationList title={title} content={info} />;

  /* 編輯交易明細表單 */
  const renderFormContent = () => (
    <form className="edit_form" onSubmit={() => onSubmit()}>
      <DropdownField labelName="性質" options={txUsageOptions} name="type" control={control} />
      <TextInputField labelName="說明" type="text" control={control} name="memo" inputProps={{placeholder: '說明'}} />
    </form>
  );

  const onSubmit = async () => {
    console.log({
      txStatus: state.txStatus,
      notRecordedMode,
    });

    if (state.txStatus === 1 || (state.txStatus === 2 && notRecordedMode === '1')) {
      const value = getInfoValues();
      console.log('info value', {value});
      await editWriteOff({
        depTxnId: state.ledgerTxId,
        usage: value.type,
        remark: value.memo,
      });
    } else {
      const value = getTargetValues();

      const recordTargetInfo = recordTargetList.find((target) => target.ledgerTxId === value.target);
      console.log({state, recordTargetInfo});
      await setWriteOff({
        depTxnId: state.ledgerTxId,
        txnId: recordTargetInfo.ledgerTxId,
      });
    }
    goBackFunc();
  };

  const goBackFunc = () => history.goBack(-2);

  /* 未入帳－銷帳對象清單 */
  useEffect(() => {
    const response = getWriteOffList({
      type: state.type,
      amount: state.txnAmount,
    });

    setRecordTargetList(response.ledgertx);

    if (!response.isWriteOffList) {
      /* 若無銷帳對象，預設為自行編輯交易明細，隱藏 "選擇銷帳對象" 選項 */
      setNotRecordedMode('1');
      notRecordedReset(() => ({
        mode: '1',
      }));
      setIsShowWriteOff(false);
    } else {
      const targetList = response.ledgertx.map((item) => ({
        value: item.ledgerTxId,
        label: `${item.txDate} ${item.sourceMember} ${item.txnAmount} ${item.txDesc}`,
      }));

      setRecordTargetOptionList(targetList);

      reset(() => ({
        target: targetList[0].value,
      }));
      setIsShowWriteOff(true);
    }
  }, []);

  return (
    <Layout title="編輯交易明細" goBackFunc={goBackFunc}>
      <EditRecordFormWrapper>
        {console.log(state)}
        <div className="info">
          {renderInformationContent('交易日期', state.txDate)}
          {renderInformationContent('轉出成員', state.bankeeMember.memberNickName ?? '--')}
          {renderInformationContent('銀行代號', state.bankCode)}
          {renderInformationContent('轉出帳號', state.bankAccount)}
          {renderInformationContent('轉出金額', `NTD${toCurrency(state.txnAmount)}`)}
        </div>

        {/* 已入帳 */}
        {state.txStatus === 1 && renderFormContent()}

        {/* 未入帳 */}
        {state.txStatus === 2 && (
          <div>
            {/* 若無可銷帳對象，則預設選取自行編輯交易明細 */}
            <RadioGroupField
              labelName=""
              name="mode"
              control={notRecordedControl}
              options={isShowWriteOff ? notRecordedModeOptions : notRecordedModeOptions.slice(-1)}
              onChange={onNotRecordedModeChange}
            />
            <div className="record_target_list">
              {console.log({notRecordedMode})}
              {(notRecordedMode === '0' && recordTargetOptionList.length !== 0) ? <RadioGroupField labelName="" name="target" control={recordTargetControl} options={recordTargetOptionList} /> : renderFormContent()}
            </div>
          </div>
        )}
        <p className="meta_info">明細只能編輯一次呦！</p>
        <FEIBButton onClick={onSubmit}>確認</FEIBButton>
      </EditRecordFormWrapper>
    </Layout>
  );
};

export default EditRecordForm;
