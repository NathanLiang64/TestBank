/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';

import theme from 'themes/theme';
import { SearchIcon } from 'assets/images/icons';
import { FEIBButton, FEIBBorderButton } from 'components/elements';
import {
  CheckboxField, DropdownField, RadioGroupField, TextInputField,
} from 'components/Fields';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { typeOptions } from '../utils/usgeType';

import PageWrapper from './PaymentRequest.style';

// TODO renderStep1-3 拆分至其他檔案
const PaymentRequest = () => {
  const [requestStep, setRequestStep] = useState(1);
  const [model, setModel] = useState();
  const history = useHistory();

  /* 第一步 */
  const [imgIndex, setImgIndex] = useState(0);
  const {control: step1Control, getValues: getStep1Values} = useForm({
    defaultValues: {
      memo: '',
      type: '1',
    },
  });
  const renderRequestCardPic = () => { // DEBUG mock images
    const colorLists = ['black', 'blue', 'salmon', 'grey'];

    return colorLists.map((color) => <div style={{height: '16rem', width: '24rem', backgroundColor: `${color}`}}>image</div>);
  };
  const onSlideChange = async (swiper) => {
    console.log('onSlideChange', swiper.activeIndex);
    setImgIndex(swiper.activeIndex);
  };
  const renderStep1 = () => {
    console.log('renderStep1');

    return (
      <div className="step1_form">
        <div>
          <SwiperLayout
            slides={renderRequestCardPic()}
            slidesPerView={1.3}
            spaceBetween={8}
            centeredSlides
            onSlideChange={onSlideChange}
            hasDivider={false}
          />
        </div>
        <div className="form_input_container">
          <DropdownField
            labelName="性質"
            options={typeOptions}
            name="type"
            control={step1Control}
          />
          <TextInputField
            labelName="說明"
            type="text"
            name="memo"
            control={step1Control}
          />
        </div>
      </div>
    );
  };
  /* 第一步 */

  /* 第二步 */
  const mockMemberList = [
    {
      isOwner: true,
      id: '000',
      name: '主揪',
    },
    {
      isOwner: false,
      id: '001',
      name: '被揪1',
    },
    {
      isOwner: false,
      id: '002',
      name: '被揪2',
    },
  ];
  const [memberList, setMemberList] = useState();
  const {control: step2SearchControl, handleSubmit: handleMemberSearchSubmit} = useForm({
    defaultValues: {
      memberName: '',
    },
  });
  const {control: step2Control, getValues: getStep2Values} = useForm({
    defaultValues: {memberSelected: {}},
  }); // TODO 規則：至少擇一
  const onStep2SearchSubmit = (data) => {
    console.log('onStep2SearchSubmit', data);

    // return member data, save to a state, render the member in checkbox field
  };
  const handleSelectedMember = (valuesStep2) => {
    const selectedMemberList = [];
    const selectedMemberIdList = Object.keys(valuesStep2.memberSelected).filter((key) => valuesStep2.memberSelected[key] === true);
    console.log({selectedMemberIdList});

    selectedMemberIdList.map((id) => {
      const selectedMember = memberList.find((member) => member.id === id);
      return selectedMemberList.push(selectedMember);
    });

    return selectedMemberList;
  };

  // 取帳本成員清單並儲存
  useEffect(() => {
    const response = mockMemberList;
    setMemberList(response);
  }, []);
  const renderStep2 = () => {
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

        {/* select TODO select all */}
        <form className="select_form">
          <CheckboxField
            key="all"
            labelName="全選"
            control={step2Control}
            name="memberSelected.all"
          />
          {memberList.map((member) => (
            <CheckboxField
              key={member.id}
              control={step2Control}
              name={`memberSelected.${member.id}`}
              labelName={`${member.isOwner ? '👤' : '👥'} - ${member.name}`} // TODO 改為正式圖案
            />
          ))}
        </form>
      </div>
    );
  };
  /* 第二步 */

  /* 第三步 */
  const [amountMode, setAmountMode] = useState('0');
  const {control: step3Control, watch: watchAmountMode} = useForm({
    defaultValues: {
      amountMode: '0',
    },
  });
  const {control: step3AmountControl, getValues: getStep3AmountValues} = useForm({
    defaultValues: {
      fixedAmount: '',
      shareAmount: '',
    },
  });
  const {control: step3EachAmoountControl, reset: resetStep3EachAmoount} = useForm({
    defaultValues: {
      memberAmount: {},
    },
  });
  const onAmountModeChange = () => {
    const watchValue = watchAmountMode((value) => setAmountMode(value.amountMode));

    return () => watchValue.unsubscribe();
  };
  const renderMemberAmountColumn = (isOwner, name, id) => {
    console.log('renderMemberAmountColumn', {amountMode});
    return (
      <div className="member_amount_column" key={id}>
        <div className="member_info">
          <p>{isOwner ? '👤' : '👥'}</p>
          <p>{name}</p>
        </div>
        <div className="amount">
          {/* amountMode !== '2': disable */}
          <TextInputField
            labelName=""
            type="text"
            name={`memberAmount.${id}`}
            control={step3AmountControl}
            inputProps={{disabled: amountMode !== '2'}}
          />
        </div>
      </div>
    );
  };
  const onShareClick = () => {
    /* amountMode '1': 所有成員之金額為 輸入金額/成員數 */
    const oriValue = parseInt(getStep3AmountValues('shareAmount'), 10);
    if (amountMode !== '1' || oriValue.isNaN()) return;

    const separatedValue = oriValue / model.selectedMember.length;

    console.log({separatedValue});
    resetStep3EachAmoount((formValue) => {});
  };
  useEffect(() => {
    /* '0': 所有成員之金額為 輸入金額 */
    if (amountMode === '0') {
      const value = getStep3AmountValues('fixedAmount');
      resetStep3EachAmoount(() => {});
    }
  }, [amountMode]);
  const renderStep3 = () => {
    console.log('renderStep3');
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
    return (
      <form className="step3_form">
        <div className="amount_mode_select">
          {/* radiogroupfield */}
          <RadioGroupField
            labelName=""
            name="amountMode"
            control={step3Control}
            options={amountModeList}
            onChange={onAmountModeChange}
          />
          <div>
            <TextInputField
              labelName=""
              type="text"
              name="fixedAmount"
              control={step3AmountControl}
            />
            <div className="separate_field">
              <TextInputField
                labelName=""
                type="text"
                name="shareAmount"
                control={step3AmountControl}
              />
              <FEIBBorderButton onClick={onShareClick} style={{ height: '3.2rem', minHeight: '3.2rem' }}>均攤</FEIBBorderButton>
              {/* TODO FEIBBorderButton (繼承自FEIBdefaultButton) 元件 min-height為4.8, 非3.2 */}
            </div>
          </div>
        </div>
        <div className="member_amount_table">
          <div className="title">
            <p>成員</p>
            <p>金額</p>
          </div>
          {model.selectedMember.map((member) => renderMemberAmountColumn(member.isOwner, member.name, member.id))}
        </div>
      </form>
    );
  };
  /* 第三步 */

  const onConfirm = () => {
    /* save model */
    if (requestStep === 1) {
      const valuesStep1 = getStep1Values();
      setModel({
        imgIndex,
        type: valuesStep1.type,
        memo: valuesStep1.memo,
      });
      console.log('onConfirm', {valuesStep1});
    }

    if (requestStep === 2) {
      const valuesStep2 = getStep2Values();

      /* get memberId of "true" */
      setModel({
        imgIndex: model.imgIndex,
        type: model.type,
        memo: model.memo,
        selectedMember: handleSelectedMember(valuesStep2),
      });
      console.log('onConfirm', {valuesStep2});
    }

    /* go to next step */
    setRequestStep(requestStep + 1);

    /* on third step: return to where the user entered */
  };

  const goBackFunc = () => {
    /* on first step */
    if (requestStep === 1) history.goBack();
    /* not on first step */
    setRequestStep(requestStep - 1);

    /* TODO reset form of previous step */
  };

  return (
    <Layout title="要錢" goBackFunc={() => goBackFunc()}>
      <PageWrapper>
        {console.log({model})}
        <div className="content_wrapper">
          {requestStep === 1 && renderStep1()}
          {requestStep === 2 && renderStep2()}
          {requestStep === 3 && renderStep3()}
        </div>
        <FEIBButton onClick={onConfirm}>確認</FEIBButton>
      </PageWrapper>
    </Layout>
  );
};

export default PaymentRequest;
