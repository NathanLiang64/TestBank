import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { FEIBButton } from 'components/elements';
import Layout from 'components/Layout/Layout';

import { showAnimationModal } from 'utilities/MessageModal';
import PageWrapper from './PaymentRequest.style';
import { chargePartner } from './api';
import PaymentSetting from './PaymentSetting';
import MemberSelection from './MemberSelection';
import AmountSetting from './AmountSetting';

const PaymentRequest = () => {
  const [requestStep, setRequestStep] = useState(1); // 1: PaymentSetting | 2: MemberSelection | 3: AmountSetting
  const [memberList, setMemberList] = useState([]);
  const [model, setModel] = useState();
  const step1Ref = useRef(); // PaymentSetting 回傳資料
  const step2Ref = useRef(); // MemberSelection 回傳資料
  const step3Ref = useRef(); // AmountSetting 回傳資料
  const history = useHistory();
  const { state } = useLocation();

  const paymentSettingValues = (data) => {
    step1Ref.current = data;
  };

  const memberSelectionValues = (data) => {
    step2Ref.current = data;
  };

  const amountSettingValue = (data) => {
    step3Ref.current = data;
  };

  const onConfirm = async () => {
    if (requestStep === 2) {
      setModel({
        partners: step2Ref.current,
      });
    }

    if (requestStep === 3) {
      const handleTxAmount = () => {
        let totalAmount = 0;
        step3Ref.current.forEach((member) => {
          const { amount } = member;
          totalAmount += parseInt(amount, 10);
        });

        return totalAmount;
      };

      const data = {
        messageCard: `W0${step1Ref.current.imgIndex}`,
        txUsage: step1Ref.current.type,
        txType: state.type ?? '0',
        txDesc: step1Ref.current.memo,
        txAmount: handleTxAmount(),
        partners: step3Ref.current,
      };
      setModel({
        messageCard: `W0${step1Ref.current.imgIndex}`,
        txUsage: step1Ref.current.type,
        txType: state.type ?? '0',
        txDesc: step1Ref.current.memo,
        txAmount: handleTxAmount(),
        partners: step3Ref.current,
      });

      /* 呼叫api */
      const response = chargePartner(data);

      await showAnimationModal({
        isSuccess: response.data,
        successTitle: '要錢卡建立成功',
        successDesc: '',
        errorTitle: '要錢卡建立失敗',
        errorCode: '',
        errorDesc: response.message,
      });

      /* 回到進入頁 */
      history.goBack();
    }

    /* 若不是最後一步，前往下一步 */
    setRequestStep(requestStep !== 3 ? requestStep + 1 : requestStep);
  };

  const goBackFunc = () => {
    /* 第一步時，回到進入頁 */
    if (requestStep === 1) history.goBack();
    /* 非第一步時，回到上一步 */
    setRequestStep(requestStep - 1);
  };

  /* 自 state 取得帳本成員清單（第二步使用） */
  useEffect(() => {
    setMemberList(state.bankeeMember);
  }, []);

  return (
    <Layout title="要錢" goBackFunc={() => goBackFunc()}>
      <PageWrapper>
        <div className="content_wrapper">
          {requestStep === 1 && <PaymentSetting paymentSettingValues={paymentSettingValues} />}
          {requestStep === 2 && <MemberSelection memberSelectionValues={memberSelectionValues} memberList={memberList} />}
          {requestStep === 3 && <AmountSetting model={model} memberList={memberList} amountSettingValue={amountSettingValue} />}
        </div>
        <FEIBButton onClick={onConfirm}>確認</FEIBButton>
      </PageWrapper>
    </Layout>
  );
};

export default PaymentRequest;
