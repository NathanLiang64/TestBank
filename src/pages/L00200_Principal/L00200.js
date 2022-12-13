import { useState, useEffect } from 'react';
import { dateToString, toCurrency } from 'utilities/Generator';
import { closeFunc, loadFuncParams } from 'utilities/AppScriptProxy';

/* Elements */
import Layout from 'components/Layout/Layout';

/* Styles */
import { showPrompt } from 'utilities/MessageModal';
import { getSubSummary, getSubPayment } from './api';
import PrincipalWrapper from './principal.style';

/**
 * L00200 貸款 應繳查詢
 */
const L00200 = () => {
  const [detaillist, setDetailList] = useState([]);

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    }
  };

  // 查詢應繳本息資訊
  const getPrincipalData = async (subNoData) => {
    const param = {
      account: subNoData.account,
      subNo: subNoData.subNo,
    };
    const principalResponse = await getSubPayment(param);
    if (principalResponse?.length > 0) {
      const result = {
        ...param,
        ...principalResponse[0],
      };
      setDetailList([...detaillist, result]);
    }
  };

  // 取得貸款分號
  const getSubNo = async (accountNo) => {
    const subNoResponse = await getSubSummary({});
    if (subNoResponse) {
      const validSubNoList = subNoResponse.filter((item) => item.account === accountNo);
      asyncForEach(validSubNoList, getPrincipalData);
    }
  };

  useEffect(async () => {
    const startParams = await loadFuncParams();
    if (startParams) {
      getSubNo(startParams.accountNo);
    } else {
      const response = await getSubSummary();
      if (response.length === 0) {
        await showPrompt('您尚未擁有貸款，請在系統關閉此功能後，立即申請。', () => closeFunc());
      } else {
        getSubNo(response[0].account);
      }
    }
  }, []);

  return (
    <Layout title="應繳本息查詢">
      <PrincipalWrapper>
        {
          detaillist.map((item) => (
            <section className="sectionTop" key={item}>
              <ul className="detailUl">
                <li>
                  <span>本期應繳金額</span>
                  <span>
                    $
                    { toCurrency(item.amount) }
                  </span>
                </li>
                <li>
                  <span>貨款分號</span>
                  <span>{ item.subNo }</span>
                </li>
                <li>
                  <span>計息期間</span>
                  <span>
                    { dateToString(item.startDate) }
                    ~
                    { dateToString(item.endDate) }
                  </span>
                </li>
                <li>
                  <span>利率%</span>
                  <span>
                    { item.rate }
                    %
                  </span>
                </li>
                <li>
                  <span>計息本金</span>
                  <span>
                    $
                    { toCurrency(item.principal) }
                  </span>
                </li>
                <li>
                  <span>攤還本金</span>
                  <span>
                    $
                    { toCurrency(item.splitPrincipal) }
                  </span>
                </li>
                <li>
                  <span>利息</span>
                  <span>
                    $
                    { toCurrency(item.interest) }
                  </span>
                </li>
                <li>
                  <span>逾期息</span>
                  <span>
                    $
                    { toCurrency(item.overInterest) }
                  </span>
                </li>
                <li>
                  <span>違約金</span>
                  <span>
                    $
                    { toCurrency(item.defaultAmount) }
                  </span>
                </li>
              </ul>
            </section>
          ))
        }
        <div className="noticeTip">
          注意事項：查詢日期若已逾繳款日，【違約金+逾期息】欄位為估算逾期一個月之金額供參考，實際扣款金額仍依本行電腦系統為準。如欲查詢已逾期戶之貸款資料，請與本行客戶服務中心聯繫(02-80731166)。
        </div>
      </PrincipalWrapper>
    </Layout>
  );
};

export default L00200;
