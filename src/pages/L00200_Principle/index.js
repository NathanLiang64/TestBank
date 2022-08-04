/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

/* Elements */
import Layout from 'components/Layout/Layout';

/* Styles */
import PrincipleWrapper from './principle.style';

const Principle = () => {
  const [detail, setDetail] = useState({});

  useEffect(() => {
    setDetail({});
  }, []);

  return (
    <Layout title="應繳本息查詢">
      <PrincipleWrapper>
        <section className="sectionTop">
          <ul className="detailUl">
            <li>
              <span>扣款(繳款)日期</span>
              <span>2021/21/31</span>
            </li>
            <li>
              <span>本期應繳金額</span>
              <span>$1,250</span>
            </li>
            <li>
              <span>貸款種類</span>
              <span>一般(傳統)型</span>
            </li>
            <li>
              <span>貨款分號</span>
              <span>00000001</span>
            </li>
            <li>
              <span>計息期間</span>
              <span>2021/21/31~2022/01/31</span>
            </li>
            <li>
              <span>利率%</span>
              <span>1.05000</span>
            </li>
            <li>
              <span>計息本金</span>
              <span>$1,250</span>
            </li>
            <li>
              <span>攤還本金</span>
              <span>$10,000</span>
            </li>
            <li>
              <span>利息</span>
              <span>$1,000</span>
            </li>
            <li>
              <span>逾期息</span>
              <span>$0</span>
            </li>
            <li>
              <span>違約金</span>
              <span>$0</span>
            </li>
          </ul>
        </section>
        <section className="sectionTop">
          <ul className="detailUl">
            <li>
              <span>扣款(繳款)日期</span>
              <span>2021/21/31</span>
            </li>
            <li>
              <span>本期應繳金額</span>
              <span>$1,250</span>
            </li>
            <li>
              <span>貸款種類</span>
              <span>一般(傳統)型</span>
            </li>
            <li>
              <span>貨款分號</span>
              <span>00000001</span>
            </li>
            <li>
              <span>計息期間</span>
              <span>2021/21/31~2022/01/31</span>
            </li>
            <li>
              <span>利率%</span>
              <span>1.05000</span>
            </li>
            <li>
              <span>計息本金</span>
              <span>$1,250</span>
            </li>
            <li>
              <span>攤還本金</span>
              <span>$10,000</span>
            </li>
            <li>
              <span>利息</span>
              <span>$1,000</span>
            </li>
            <li>
              <span>逾期息</span>
              <span>$0</span>
            </li>
            <li>
              <span>違約金</span>
              <span>$0</span>
            </li>
          </ul>
        </section>
        <div className="noticeTip">
          注意事項：查詢日期若已逾繳款日，【違約金+逾期息】欄位為估算逾期一個月之金額供參考，實際扣款金額仍依本行電腦系統為準。如欲查詢已逾期戶之貸款資料，請與本行客戶服務中心聯繫(02-80731166)。
        </div>
      </PrincipleWrapper>
    </Layout>
  );
};

export default Principle;
