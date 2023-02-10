/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { showCustomPrompt, showError } from 'utilities/MessageModal';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import { RadioGroupField } from 'components/Fields/radioGroupField';
import { Func } from 'utilities/FuncID';

import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useNavigation } from 'hooks/useNavigation';
import { getTxn, queryInstallment } from './api';
import InstalmentWrapper from './R00200.style';

import { R00200AccordionContent2 } from './utils';

/**
 * R00200 晚點付首頁
 * 單筆晚點付可重複申請，但若已申請總額分期，則無法再另外申請單筆晚點付。
 */

const R00200 = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {closeFunc} = useNavigation();
  const schema = yup.object().shape({
    applType: yup.string().required('請選擇欲申請之晚點付項目'),
  });
  const { handleSubmit, control } = useForm({
    defaultValues: { applType: '' },
    resolver: yupResolver(schema),
  });
  const [txns, setTxns] = useState([]);
  const [flag, setFlag] = useState();

  const applTypeOptions = [
    { label: '單筆', value: 'G' },
    { label: '總額', value: 'H' },
  ];

  const showInsufficientContent = (type) => (
    <div style={{ textAlign: 'center' }}>
      <p>您目前沒有可分期的消費</p>
      <p>
        (
        {type === 'H' ? '消費全額' : '單筆消費限額'}
        需達3,000元以上)
      </p>
    </div>
  );

  const onSubmit = async ({ applType }) => {
    dispatch(setWaittingVisible(true));

    const availableTxns = txns.filter(({ purchAmount }) => purchAmount >= 3000);
    const singleUnallowed = applType === 'G' && !availableTxns.length;

    // eslint-disable-next-line no-return-assign
    const totalAmount = txns.reduce((acc, cur) => acc += cur.purchAmount, 0); // 整體消費的總金額
    const totlaUnallowed = applType === 'H' && totalAmount < 3000;

    // NOTE 打 queryInstallment API 目的為 1.確認申請的資料已包含總額的項目 2. 是否已經有同意條款的註記
    // const { newInstRestraintFlag, items} = await queryInstallment();
    // const appliedTotalItem = items.find((item) => item.applType === 'H' || item.applType === 2);

    // 當選擇單筆/總額分期時，若單筆/總額的金額低於 3000 元以下的資料 =>提示訊息
    if (totlaUnallowed || singleUnallowed) showError(showInsufficientContent(applType));

    // 若已經申請過總額分期，直接導向 R002003 顯示已申請的晚點付資訊
    // else if (appliedTotalItem) history.push('/R002003', {...appliedTotalItem, readOnly: true});

    // 若申請項目為導向 「單筆」，先導向 R002001 勾選要分期的項目
    else if (applType === 'G') history.push('/R002001', { availableTxns, newInstRestraintFlag: flag });

    // 若申請項目為導向 「總額」，直接導向 R002002 勾選要分期期數
    else if (applType === 'H')history.push('/R002002', { applType, selectedTxns: txns, newInstRestraintFlag: flag });

    dispatch(setWaittingVisible(false));
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const { newInstRestraintFlag, items } = await queryInstallment();
    setFlag(newInstRestraintFlag);
    const appliedTotalItem = items.find((item) => item.applType === 'H' || item.applType === '2');
    if (appliedTotalItem) history.push('/R002003', {...appliedTotalItem, readOnly: true});
    else {
      const txnRes = await getTxn();
      if (!txnRes.length) await showCustomPrompt({ message: '您目前沒有可分期的消費', onOk: closeFunc });
      else setTxns(txnRes);
    }
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout fid={Func.R002} title="晚點付">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="InstalmentWrapperText">點選申請晚點付項目</div>
            <RadioGroupField
              name="applType"
              control={control}
              options={applTypeOptions}
            />
            <Accordion space="both">
              {/* TODO 目前 hardcode，注意事項是否應從後端取得 */}
              <R00200AccordionContent2 />
            </Accordion>
          </div>
          <FEIBButton type="submit">下一步</FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200;
