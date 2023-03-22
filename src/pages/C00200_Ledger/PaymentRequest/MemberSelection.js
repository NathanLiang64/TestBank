/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import theme from 'themes/theme';
import { SearchIcon } from 'assets/images/icons';
import { CheckboxField, TextInputField } from 'components/Fields';
import { memberImage } from '../utils/images';

const MemberSelection = (props) => {
  const { memberSelectionValues, memberList } = props;
  const [isSelectAllSelected, setIsSelectAllSelected] = useState(false);

  /* Checkbox */
  const renderCheckboxLabel = ({isOwner, memberNickName}) => (
    <div className="checkbox_label">
      {memberImage({isOwner, height: '30'})}
      <span>-</span>
      {memberNickName}
    </div>
  );
  const memberOptionsList = memberList.map((member) => ({
    value: member.memberId,
    label: renderCheckboxLabel(member),
  }));
  const handleDefaultValues = () => {
    const memberSelectedObj = {};

    memberOptionsList.forEach((member) => {
      memberSelectedObj[member.value] = false;
    });
    return memberSelectedObj;
  };

  /* TODO 搜尋成員 */
  // const {control: step2SearchControl, handleSubmit: handleMemberSearchSubmit} = useForm({
  //   defaultValues: {
  //     memberName: '',
  //   },
  // });
  // const onStep2SearchSubmit = (data) => {
  //   console.log('onStep2SearchSubmit', data);
  //   // return member data, save to a state, render the member in checkbox field
  // };

  /* form: 全選 */
  const {control: selectAllControl, watch: selectAllWatch, setValue: setSelectAllValue} = useForm({
    defaultValues: {
      selectAll: false,
    },
  });

  /* form: 個別成員 */
  const {control, watch, setValue} = useForm({
    defaultValues: {
      memberSelected: handleDefaultValues(),
    },
  }); // TODO 規則：至少擇一

  const memberSelectStatus = watch(); // 個別成員 checkbox 勾選狀態
  const isSelectAll = selectAllWatch().selectAll; // 是否勾選 "全選"
  const selectedMemberIdList = Object.keys(memberSelectStatus.memberSelected).filter((key) => memberSelectStatus.memberSelected[key] === true); // 個別成員被勾選狀態清單

  /* 全選 */
  useEffect(() => {
    setIsSelectAllSelected(isSelectAll);
    /*
      勾選"全選": 自動勾選全部member
      全部member皆被勾選: 自動勾選"全選"
     */
    if (isSelectAll || selectedMemberIdList.length === memberOptionsList.length) {
      memberOptionsList.forEach(({value}) => {
        setValue(`memberSelected.${value}`, true);
      });
    }
  }, [isSelectAll]);

  /* 個別選UI */
  useEffect(() => {
    /* "全選"狀態下取消勾選任一member: 取消勾選"全選" */
    if (isSelectAllSelected && selectedMemberIdList.length !== memberOptionsList.length) {
      setSelectAllValue('selectAll', false);
    }
  }, [memberSelectStatus]);

  /* 回傳選項 */
  useEffect(() => {
    const selectedMemberList = []; // 被選擇的成員清單

    /* 將資料加入 "被選擇的成員清單" */
    if (isSelectAll) {
      /* 全選 */
      memberList.forEach((member) => selectedMemberList.push({memberId: member.memberId}));
    } else {
      /* 非全選 */
      selectedMemberIdList.forEach((id) => {
        const selectedMember = memberList.find((member) => member.memberId === id);
        selectedMemberList.push({memberId: selectedMember.memberId});
      });
    }
    memberSelectionValues(selectedMemberList); // 回傳至父層
  }, [memberSelectStatus]);

  return (
    <div className="step2_form">
      <p>請選擇成員</p>
      {/* 搜尋成員 */}
      {/* <form className="search_form" onSubmit={handleMemberSearchSubmit((data) => onStep2SearchSubmit(data))}>
        <div className="search_input">
          <TextInputField
            labelName="請選擇成員"
            type="text"
            name="memberName"
            control={step2SearchControl}
          />
        </div>
        <button type="submit" className="search_submit">
          <SearchIcon size={20} color={theme.colors.text.dark} />
        </button>
      </form> */}

      {/* 選擇成員 */}
      <form className="select_form">
        <CheckboxField
          key="all"
          labelName="全選"
          control={selectAllControl}
          name="selectAll"
        />
        {memberOptionsList.map(({ value, label }) => (
          <CheckboxField
            key={value}
            control={control}
            name={`memberSelected.${value}`}
            labelName={label}
          />
        ))}
      </form>
    </div>
  );
};

export default MemberSelection;
