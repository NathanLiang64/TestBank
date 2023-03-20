/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import theme from 'themes/theme';
import { SearchIcon } from 'assets/images/icons';
import { CheckboxField, TextInputField } from 'components/Fields';

const MemberSelection = (props) => {
  const { memberSelectionValues, memberList } = props;

  /* TODO 搜尋成員 */
  const {control: step2SearchControl, handleSubmit: handleMemberSearchSubmit} = useForm({
    defaultValues: {
      memberName: '',
    },
  });
  const onStep2SearchSubmit = (data) => {
    console.log('onStep2SearchSubmit', data);
    // return member data, save to a state, render the member in checkbox field
  };

  /* 全選 */
  const {control: selectAllControl, watch: selectAllWatch, reset: selectAllReset} = useForm({
    defaultValues: {
      selectAll: false,
    },
  });

  /* 個別成員 */
  const {control, watch, reset} = useForm({
    defaultValues: {memberSelected: {}},
  }); // TODO 規則：至少擇一

  /* 回傳選項 */
  useEffect(() => {
    const value = watch();
    const selectedMemberList = [];
    const selectedMemberIdList = Object.keys(value.memberSelected).filter((key) => value.memberSelected[key] === true);
    const isSelectAll = selectAllWatch().selectAll;

    /* 全選 */
    if (isSelectAll) {
      memberList.forEach((member) => selectedMemberList.push({memberId: member.memberId}));
    } else {
      selectedMemberIdList.forEach((id) => {
        const selectedMember = memberList.find((member) => member.memberId === id);
        selectedMemberList.push({memberId: selectedMember.memberId});
      });
    }

    memberSelectionValues(selectedMemberList);
  }, [watch()]);

  console.log('renderStep2');
  return (
    <div className="step2_form">
      {/* search */}
      <form className="search_form" onSubmit={handleMemberSearchSubmit((data) => onStep2SearchSubmit(data))}>
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
      </form>

      {/* TODO 全選UI */}
      <form className="select_form">
        <CheckboxField
          key="all"
          labelName="全選"
          control={selectAllControl}
          name="selectAll"
        />
        {memberList.map((member) => (
          <CheckboxField
            key={member.memberId}
            control={control}
            name={`memberSelected.${member.memberId}`}
            labelName={`${(member.owner) ? '👤' : '👥'} - ${member.memberNickName}`}
          />
        ))}
      </form>
    </div>
  );
};

export default MemberSelection;
