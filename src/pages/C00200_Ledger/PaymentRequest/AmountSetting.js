/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { RadioGroupField, TextInputField } from 'components/Fields';
import { memberImage } from '../utils/images';

const AmountSetting = (param) => {
  const { model, amountSettingValue, memberList } = param;
  const [amountMode, setAmountMode] = useState('0');
  const [selectedMemberList, setSelectedMemberList] = useState();
  const amountModeList = [
    {
      label: '每人固定金額',
      value: '0',
    },
    {
      label: '總金額',
      value: '1',
    },
    {
      label: '自訂',
      value: '2',
    },
  ];

  /* 前一步被選擇成員清單 */
  const handleSelectedMember = () => {
    const requestedMemberList = [];

    model.partners.forEach((partner) => {
      const requestedMember = memberList.find((member) => member.memberId === partner.memberId);
      requestedMemberList.push(requestedMember);
    });

    return requestedMemberList;
  };

  /* form: 金額分攤模式選擇 */
  const {control: amountModeControl, watch: amountModeWatch} = useForm({
    defaultValues: {
      amountMode: '0',
    },
  });

  /* form: 固定金額 或 均分金額 輸入 */
  const {control: amountControl, getValues: getAmountValues} = useForm({
    defaultValues: {
      fixedAmount: '',
      shareAmount: '',
    },
  });

  /* form: 個別成員金額 顯示／輸入 */
  const {control: eachAmountControl, reset: eachAmountReset, watch: eachAmountWatch} = useForm({
    defaultValues: {
      memberAmount: {},
    },
  });

  const onAmountModeChange = () => {
    const watchValue = amountModeWatch((value) => setAmountMode(value.amountMode));

    return () => watchValue.unsubscribe();
  };

  /* amountMode '0': 所有成員之金額為 輸入金額 */
  const onFixedAmountBlur = () => {
    console.log('onBlur');
    const value = getAmountValues('fixedAmount');
    const memberIdAmountList = [];

    selectedMemberList.forEach((member) => {
      const id = member.memberId;
      memberIdAmountList.push({
        memberId: id,
        amount: value,
      });

      eachAmountReset((formValue) => ({
        ...formValue.memberAmount,
        memberAmount: {
          [id]: value,
        },
      })); // TODO 待修正：目前只更新在最後一欄，需每一欄都更新
    });

    amountSettingValue(memberIdAmountList);
  };

  /* amountMode '1': 所有成員之金額為 輸入金額/成員數 */
  const onShareClick = () => {
    const oriValue = parseInt(getAmountValues('shareAmount'), 10);
    if (amountMode !== '1' || Number.isNaN(oriValue)) return;
    const shareValue = oriValue / selectedMemberList.length;
    const memberIdAmountList = [];

    selectedMemberList.forEach((member) => {
      const id = member.memberId;
      memberIdAmountList.push({
        memberId: id,
        amount: shareValue,
      });

      eachAmountReset((formValue) => ({
        ...formValue.memberAmount,
        memberAmount: {
          [id]: shareValue,
        },
      })); // TODO 待修正：目前只更新在最後一欄，需每一欄都更新
    });

    amountSettingValue(memberIdAmountList);
  };

  const renderMemberAmountColumn = (isOwner, name, id) => (
    <div className="member_amount_column" key={id}>
      <div className="member_info">
        <div className="member_image">{memberImage({isOwner})}</div>
        <p>{name}</p>
      </div>
      <div className="amount">
        <TextInputField
          labelName=""
          type="text"
          name={`memberAmount.${id}`}
          control={eachAmountControl}
          inputProps={{ disabled: amountMode !== '2' }}
        />
      </div>
    </div>
  );

  useEffect(() => {
    const requestedMemberList = [];
    const eachValues = eachAmountWatch().memberAmount;
    console.log({eachValues});

    /* 資料僅需各被選擇成員之memberId, amount */
    Object.keys(eachValues).forEach((memberId) => {
      requestedMemberList.push({
        memberId,
        amount: eachValues[memberId],
      });
    });

    if (amountMode === '2') amountSettingValue(requestedMemberList);

    return () => eachValues.unsubscribe();
  }, [eachAmountWatch()]);

  useEffect(() => {
    setSelectedMemberList(handleSelectedMember());
  }, []);

  return (
    <form className="step3_form">
      <div className="amount_mode_select">
        {/* radiogroupfield */}
        <RadioGroupField
          labelName=""
          name="amountMode"
          control={amountModeControl}
          options={amountModeList}
          onChange={onAmountModeChange}
        />
        <div>
          <TextInputField
            labelName=""
            type="text"
            name="fixedAmount"
            control={amountControl}
            inputProps={{ disabled: amountMode !== '0', onBlur: () => onFixedAmountBlur() }}
          />
          <div className="separate_field">
            <TextInputField
              labelName=""
              type="text"
              name="shareAmount"
              control={amountControl}
              inputProps={{ disabled: amountMode !== '1' }}
            />
            <div onClick={() => onShareClick()} style={{ height: '3.2rem', minHeight: '3.2rem' }}>
              均攤
            </div>
          </div>
        </div>
      </div>
      <div className="member_amount_table">
        <div className="title">
          <p>成員</p>
          <p>金額</p>
        </div>
        {selectedMemberList && selectedMemberList.map((member) => renderMemberAmountColumn(member.owner, member.memberNickName, member.memberId))}
      </div>
    </form>
  );
};

export default AmountSetting;
