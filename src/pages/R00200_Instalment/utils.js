export const R00200AccordionContent1 = () => (
  <>
    <ol>
      <li>
        本功能僅提供遠銀信用卡正卡持卡人使用
        <span className="fc-r">本人名下之</span>
        <span className="fc-r">遠銀帳戶</span>
        扣繳遠銀信用卡款項。
      </li>
      <li>
        申請扣繳帳號須為
        <span className="fc-r">活存、活儲、支存</span>
        帳戶（帳號第四至第六碼為003、004、031）。
      </li>
      <li>
        請於
        <span className="fc-r">繳款截止日15：30前</span>
        將授權扣款金額存入您指定之本行存款帳戶內。
      </li>
      <li>
        遠東商銀若
        <span className="fc-r">連續3期</span>
        帳款無法如期扣款，遠東商銀有權
        <span className="fc-r">終止信用卡帳款自動轉帳付款之約定</span>
        ，並請持卡人務必改以其他繳款方式繳款。
      </li>
    </ol>
  </>
);

export const R00200AccordionContent2 = () => (
  <>
    <ol>
      <li>
        本功能僅提供遠銀信用卡正卡持卡人使用
        <span className="fc-r">本人名下之</span>
        <span className="fc-r">遠銀帳戶</span>
        扣繳遠銀信用卡款項。
      </li>
      <li>
        申請扣繳帳號須為
        <span className="fc-r">活存、活儲、支存</span>
        帳戶（帳號第四至第六碼為003、004、031）。
      </li>
      <li>
        請於
        <span className="fc-r">繳款截止日15：30前</span>
        將授權扣款金額存入您指定之本行存款帳戶內。
      </li>
      <li>
        遠東商銀若
        <span className="fc-r">連續3期</span>
        帳款無法如期扣款，遠東商銀有權
        <span className="fc-r">終止信用卡帳款自動轉帳付款之約定</span>
        ，並請持卡人務必改以其他繳款方式繳款。
      </li>
    </ol>
  </>
);

// ★備註說明:
//   依與作業部核簽之分期設定表。
//   各分期換算之每月利率如下:
//   1期:年化利率0%(每月利率0%)
//   3期:年化利率0%(每月利率0%)
//   6期:年化利率6%(每月利率0.29%)
//   9期:年化利率9%(每月利率0.42%)
//  12期:年化利率12%(每月利率0.55%)

export const interestRateMap = {
  // { 期數:月利率 }
  1: {monthlyRate: 0, annualRate: 0},
  3: {monthlyRate: 0, annualRate: 0},
  6: {monthlyRate: 0.29, annualRate: 6},
  9: {monthlyRate: 0.42, annualRate: 9},
  12: {monthlyRate: 0.55, annualRate: 12},
};
