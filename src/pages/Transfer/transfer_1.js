import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import InformationList from 'components/InformationList';
import InfoArea from 'components/InfoArea';
import Dialog from 'components/Dialog';
import Loading from 'components/Loading';
import { FEIBButton } from 'components/elements';
import { setIsPasswordRequired, setResult } from 'components/PasswordDrawer/stores/actions';
import { dateFormatter, weekNumberToChinese } from 'utilities/Generator';
import { directTo } from 'utilities/mockWebController';
import TransferWrapper, { TransferMOTPDialogWrapper } from './transfer.style';
import { doNtdTrConfirm, doBookNtdTrConfirm } from '../../apis/transferApi';

const Transfer1 = () => {
  const [openMOTPDialog, setOpenMOTPDialog] = useState(false);
  const [displayInfo, setDisplayInfo] = useState({
    money: '',
    bankNo: '',
    bankName: '',
    receivingAccount: '',
    date: '',
    frequency: '',
    amount: 0,
    remark: '',
  });
  const fastLogin = useSelector(({ passwordDrawer }) => passwordDrawer.fastLogin);
  const motp = useSelector(({ passwordDrawer }) => passwordDrawer.motp);
  const result = useSelector(({ passwordDrawer }) => passwordDrawer.result);
  const history = useHistory();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const {
    money, bankNo, bankName, receivingAccount, date, frequency, amount, debitAccount, debitName, remark, transferType,
  } = displayInfo;

  const switchFrequency = (type) => {
    switch (type) {
      case 'weekly':
        return '每週';
      case 'monthly':
        return '每個月';
      default:
        return '';
    }
  };

  // 計算預計轉帳次數
  const computeTransferAmount = (type, day, dateRange) => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    let count = 0;

    // 交易頻率為 "週" 時，計算日期範圍內有多少相同的日，day 可接受 1-7 數字，為週一到週日
    if (type === 'weekly') {
      const ndays = 1 + Math.round((endDate - startDate) / (24 * 3600 * 1000));
      const sum = (a, b) => a + Math.floor((ndays + ((startDate.getDay() + 6 - b) % 7)) / 7);
      count = [day].reduce(sum, 0);
    }

    // 交易頻率為 "月" 時，計算日期範圍內有多少相同的日，day 可接受 1-31，為 1 號到 31 號
    if (type === 'monthly') {
      const startYear = startDate.getFullYear(); // 起始年份
      const startMonth = startDate.getMonth() + 1; // 起始月份
      const endYear = endDate.getFullYear(); // 結束年份
      const endMonth = endDate.getMonth() + 1; // 結束年份
      let removeCount = 0;

      // 去範圍區間月份加總 (去頭尾)
      const loopMonth = (endYear - startYear) * 12 - startMonth + endMonth - 1;
      // 根據每月天數判斷是否包含指定日 (day)
      for (let i = 1; i <= loopMonth; i++) {
        const nextMonthDays = new Date(startYear, startMonth + i, 0).getDate();
        if (nextMonthDays < day) removeCount += 1;
      }

      // 判斷頭尾月份的日期是否在指定日 (day) 內
      if (startDate.getDate() > day) removeCount += 1;
      if (endDate.getDate() < day) removeCount += 1;

      // 2 為頭尾月份，範圍區間月份加總 (2 + loopMonth) 減去不包含指定日的月份 (removeCount)
      count = 2 + loopMonth - removeCount;
    }
    return count;
  };

  const addZero = (num) => {
    if (parseInt(num, 10) < 10) {
      num = `0${num}`;
    }
    return num;
  };

  const doMonthlyData = (displayOriginInfo, data) => {
    console.log('doMonthlyData', data);
    data.bookType = 'M';
    data.dayOfM = addZero(displayOriginInfo.transactionCycle);
    const startDate = displayOriginInfo.tranceDate[0];
    const endDate = displayOriginInfo.tranceDate[1];
    data.startDate = startDate;
    data.endDate = endDate;
    data.deviceId = 'test';
    return data;
  };

  const doWeeklyData = (displayOriginInfo, data) => {
    console.log('doWeeklyData', data);
    data.bookType = 'W';
    data.dayOfW = `0${displayOriginInfo.transactionCycle}`;
    const startDate = displayOriginInfo.tranceDate[0];
    const endDate = displayOriginInfo.tranceDate[1];
    data.startDate = startDate;
    data.endDate = endDate;
    data.deviceId = 'test';
    return data;
  };

  const doSingleData = (displayOriginInfo, data) => {
    console.log('doSingleData', data);
    data.bookType = 'S';
    data.bookDate = displayOriginInfo.date;
    data.deviceId = 'test';
    return data;
  };

  const doMakeResrveData = (displayOriginInfo, data) => {
    console.log('doMakeResrveData', data);
    switch (displayOriginInfo.transactionFrequency) {
      case 'monthly': {
        return doMonthlyData(displayOriginInfo, data);
      }
      case 'weekly': {
        return doWeeklyData(displayOriginInfo, data);
      }

      default:
        return doSingleData(displayOriginInfo, data);
    }
  };

  const handleClickTransferButton = async () => {
    console.log(displayInfo);
    const data = {
      outAcctNo: displayInfo.receivingAccount, inBank: displayInfo.bankNo, inAcctNo: displayInfo.receivingAccount, amount: displayInfo.money.replace('$', ''), memo: displayInfo.remark, deviceId: '131313', isQRCode: false, isMotpOpen: false,
    };

    if (displayInfo.transferType === 'reserve') {
      console.log('displayInfo', displayInfo);
      const resrveData = doMakeResrveData(displayInfo, data);
      console.log('resrveData', resrveData);
      const ntdTrConfirmResponse = await doBookNtdTrConfirm(resrveData);
      console.log(ntdTrConfirmResponse);
    } else {
      const ntdTrConfirmResponse = await doNtdTrConfirm(data);
      console.log(ntdTrConfirmResponse);
      if (fastLogin || !motp) dispatch(setIsPasswordRequired(true));
    }
  };

  const onSubmit = () => setOpenMOTPDialog(true);

  const renderMOTPNotice = () => (
    <InfoArea className="infoArea">
      提醒您，即將進行非約定轉帳，請確認網路連線，以確保行動守護精靈MOTP可正常驗證
    </InfoArea>
  );

  const renderMOTPLoadingDialog = () => (
    <Dialog
      title="行動守護精靈 MOTP"
      isOpen={openMOTPDialog}
      content={(
        <TransferMOTPDialogWrapper>
          <Loading />
          <p>驗證中</p>
        </TransferMOTPDialogWrapper>
      )}
    />
  );

  useEffect(() => {
    if (result) onSubmit();
    dispatch(setResult(false));
  }, [result]);

  useEffect(() => {
    if (openMOTPDialog) {
      // 模擬 MOTP 驗證所需時間
      const delay = (interval) => new Promise((resolve) => setTimeout(resolve, interval));

      // 模擬 MOTP 驗證所需時間 2 秒
      const waitMOTP = async () => await delay(2000);

      // 驗證成功後關閉 MOTP 驗證彈窗並跳轉至成功頁
      waitMOTP().then(() => {
        setOpenMOTPDialog(false);
        directTo(history, 'transfer2', displayInfo);
      });
    }
  }, [openMOTPDialog]);

  useEffect(() => {
    /* eslint-disable no-shadow */
    const {
      debitAccount, debitName, bankCode, receivingAccount, transferType, transferAmount,
      transactionDate, transactionNumber, remark, transactionFrequency, transactionCycle,
      depositAmount, transferRemaining,
    } = state;

    if (transactionFrequency && transactionCycle) {
      if (bankCode.bankNo !== undefined)bankCode.bankId = bankCode.bankNo;
      setDisplayInfo({
        ...displayInfo,
        money: `$${transferAmount}` || '',
        bankNo: bankCode.bankId,
        bankName: bankCode.bankName,
        tranceDate: transferType === 'now' || transactionNumber === 'once'
          ? dateFormatter(transactionDate)
          : [dateFormatter(transactionDate[0], true), dateFormatter(transactionDate[1]), true],
        frequency: transactionFrequency === 'monthly'
          ? `${switchFrequency(transactionFrequency)}${transactionCycle}號`
          : `${switchFrequency(transactionFrequency)}${weekNumberToChinese(transactionCycle)}`,
        amount: computeTransferAmount(transactionFrequency, transactionCycle, transactionDate),
        receivingAccount,
        debitAccount,
        debitName,
        remark,
        depositAmount,
        transferRemaining,
        transferType,
        transactionFrequency,
        transactionCycle,
      });
    } else {
      console.log('171', bankCode);
      if (bankCode.bankNo !== undefined)bankCode.bankId = bankCode.bankNo;
      setDisplayInfo({

        ...displayInfo,
        money: `$${transferAmount}` || '',
        bankNo: bankCode.bankId,
        bankName: bankCode.bankName,
        date: transferType === 'now' || transactionNumber === 'once'
          ? dateFormatter(transactionDate)
          : `${dateFormatter(transactionDate[0], true)}~${dateFormatter(transactionDate[1], true)}`,
        receivingAccount,
        debitAccount,
        debitName,
        remark,
        depositAmount,
        transferRemaining,
        transferType,
        transactionFrequency,
      });
    }
  }, [state]);

  return (
    <TransferWrapper className="transferConfirmPage">
      <hr />
      <section className="transferMainInfo">
        <p>轉出金額與轉入帳號</p>
        <h3 className="transferAmount">{money}</h3>
        <h3>{`${bankName}(${bankNo})`}</h3>
        <h3>{receivingAccount}</h3>
      </section>
      <hr />
      <section>
        <InformationList title="轉出帳號" content={debitAccount} remark={debitName} />
        <InformationList title="時間" content={date} />
        {frequency && <InformationList title="週期" content={frequency} remark={`預計轉帳${amount}次`} />}
        {transferType === 'now' && <InformationList title="手續費" content="$0" />}
        <InformationList title="備註" content={remark} />
      </section>
      <hr />
      <section className="transferAction">
        { motp && renderMOTPNotice() }
        <div className="transferButtonArea">
          <FEIBButton onClick={handleClickTransferButton}>確認</FEIBButton>
          <p className="notice">轉帳前多思考，避免被騙更苦惱</p>
        </div>
      </section>
      { motp && renderMOTPLoadingDialog() }
    </TransferWrapper>
  );
};

export default Transfer1;
