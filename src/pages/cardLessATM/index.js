import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import useCheckLocation from 'hooks/useCheckLocation';
import userAxios from 'apis/axiosConfig';
import { setTitle } from 'components/Header/stores/actions';

/* Elements */
import {
  FEIBButton,
  FEIBInputAnimationWrapper,
  FEIBInput,
  FEIBInputLabel,
  FEIBCheckboxLabel,
  FEIBCheckbox,
} from 'components/elements';
import NoticeArea from 'components/NoticeArea';
// import { FormControlLabel, Checkbox } from 'themes/styleModules';
import { RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons';

/* Styles */
import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [step, setStep] = useState(0);
  const [agree, setAgree] = useState(false);

  const handleStep = (s) => {
    if (agree) {
      setStep(s);
    }
  };

  const handleCheckBoxChange = (event) => {
    setAgree(event.target.checked);
  };

  const toStep1 = () => {
    history.push('/cardLessATM/cardLessATM1');
  };

  const renderPage = () => {
    if (step === 0) {
      return (
        <div className="noticeTopFixed">
          {/* <FEIBInputLabel $color={theme.colors.primary.brand}>無卡提款約定事項</FEIBInputLabel> */}
          <NoticeArea title="無卡提款約定事項" textAlign="left">
            <p>
              立約人為遠東國際商業銀行( 以下簡稱貴行) 存款客戶且已申請貴行「ATM
              無卡提款服務」。立約人同意經由貴行行動銀行 APP 或 Bankee APP 執行ATM
              無卡提款交易，且遵守下列條款：
            </p>
            <br />
            <p>
              1. ATM 無卡提款：
            </p>
            <br />
            <p>
              1.1.1 立約人憑貴行提供之一次性「提款序號」、自行設定「無卡提款密碼」、「提款金額」及其他交易驗證資訊於貴行或參加金融資訊系統跨行連線之自動化服務設備，如交易驗證
              資訊相符，貴行即行支付，其交易與憑金融卡或身分證明文件所為之交易行為，具有同等之效力。
            </p>
            <br />
            <p>
              1.2 貴行認為立約人有不當往來或疑似有遭他人盜用之情形，可逕行終止「ATM
              無卡提款服務」。
            </p>
            <br />
            <p>
              1.3 立約人申請「ATM無卡提款服務」後，未於申請日 30
              日曆日內於貴行行動銀行 APP 或 Bankee
              APP 執行「開通無卡提款服務」開通服務手續，則該申請「ATM無卡提款服務」項目自
              動失效。
            </p>
            <br />
            <p>
              1.4「無卡提款密碼」連續錯誤 3 次，即鎖住服務，須重新申請服務。
            </p>
            <br />
            <p>
              2.適用範圍：
            </p>
            <br />
            <p>
              2.1「ATM
              無卡提款服務」以立約人於貴行開立且往來之存款帳戶為限，惟 Bankee
              APP 之「ATM無卡提款服務」僅提供持有 Bankee 綜合存款帳戶之立約人使用。
            </p>
            <br />
            <p>
              3.交易之效力：
            </p>
            <br />
            <p>
              3.1 使用ATM
              無卡提款交易，包括領取現款及未來貴行經主管機關核准之自動化服務，其交易與立約人以金融卡於自動化服務設備所為之交易行為，具同等效力。
            </p>
            <br />
            <p>
              4. 交易驗證資訊之保管：
            </p>
            <br />
            <p>
              4.1 立約人自行設定「無卡提款密碼」時，應注意密碼之設置及使用，不宜使用與立約人個人資料有關或具連續性、重複性或規則性之號碼為密碼，並對「ATM
              無卡提款交易」之「提
              款序號」、「無卡提款密碼」、「提款金額」及其他交易驗證資訊負保管之責，且不得將上開交易驗證資訊以任何方式使第三人知悉或得以知悉，以確保交易安全。
            </p>
            <br />
            <p>
              4.2 立約人同意就相關輸入資訊設定、「提款序號」、「無卡提款密碼」等，
              貴行均得認定為立約人所為之有效指示。如因第三人冒用或盜用上開交易驗證資訊致生損害時，除可證明
              係貴行對資訊系統之控管未盡善良管理人之注意義務外，應由立約人自行負責；如致貴行受有任何直接或間接損害，立約人應負賠償之責。
            </p>
            <br />
            <p>
              5. 無卡交易申請之限制：
            </p>
            <br />
            <p>
              5.1 ATM 無卡提款交易限透過貴行行動銀行APP 或Bankee
              APP進行無卡交易申請。
            </p>
            <br />
            <p>
              5.2 ATM 無卡提款交易每一存款帳號，可同時申請多筆ATM
              無卡提款交易，惟每筆提領時效及累計提領限額依貴行規定辦理。
            </p>
            <br />
            <p>
              6. 無卡交易提款限額：
            </p>
            <br />
            <p>
              6.1 於貴行自動化服務設備提款時，以新臺幣（以下同）壹仟元為單位，單筆最高提款限額為貳萬元，每日累計提領限額為壹拾萬元，與晶片金融卡之提款限額併計。於參加金融資訊
              系統跨行連線金融單位設置之自動化服務設備提款時，每次最高限額為貳萬元。
            </p>
            <br />
            <p>
              6.2 前項所定之金額，貴行得視實際業務需要隨時調整，除法規另有明定外，貴行應於調整5
              日前，以顯著方式於營業處所及貴行網站公開揭示之。
            </p>
            <br />
            <p>
              7. ATM 無卡提款交易之「提款序號」失效：
            </p>
            <br />
            <p>
              7.1 立約人於行動銀行完成ATM
              無卡提款交易之申請後，如逾貴行發送一次性提款序號之有效提款時間未完成提款；或於貴行自動化服務設備輸入「提款序號」、「無卡提款密碼」、
              「提款金額」或其他交易驗證資訊連續驗證錯誤次數達( 含)
              三次者，貴行為考量交易安全並保護立約人權益，該「提款序號」將立即失效。
            </p>
            <br />
            <p>
              8. ATM 無卡提款交易功能之停用：
            </p>
            <br />
            <p>
              8.1 立約人得隨時向貴行申請停用ATM 無卡提款服務，並終止本約定事項。
            </p>
            <br />
            <p>
              8.2 如有下列情事之一者，貴行得隨時停用或暫時停止提供ATM
              無卡提款服務：
            </p>
            <br />
            <p>
              8.3 立約人之帳戶作為洗錢、詐欺等不法之用途。
            </p>
            <br />
            <p>
              8.3.1 立約人之帳戶經依法令規定列為暫停給付、警示或衍生管制帳戶。
            </p>
            <br />
            <p>
              8.3.2 立約人違反法令規定、損及貴行權益或有其他不法行為。
            </p>
            <br />
            <p>
              8.3.3 無卡提款交易有第三人不當持有使用之虞。
            </p>
            <br />
            <p>
              9. ATM 無卡提款交易資料之紀錄：
            </p>
            <br />
            <p>
              9.1 立約人以ATM 無卡提款方式之提款紀錄，概以貴行連線系統之紀錄(
              包括但不限於磁帶、錄影帶、紙卷等）為準。
            </p>
            <br />
            <p>
              10. ATM 無卡提款交易資料之保存：
            </p>
            <br />
            <p>
              10.1 立約人進行 ATM 無卡提款交易之資料，貴行應至少保存五年以上。
            </p>
            <br />
            <p>
              11. 二十四小時服務專線及申訴管道：
            </p>
            <br />
            <p>
              11.1 為保護立約人權益，立約人執行 ATM
              無卡提款交易時若有任何疑義，請立約人撥打貴行 24
              小時客戶服務專線：(02)80731166 或免付費客戶服務專線：0800-088-222。
            </p>
            <br />
            <p>
              12. 金融消費爭議：
            </p>
            <br />
            <p>
              12.1 立約人對貴行因本約定事項所載之商品或服務所生之金融消費爭議，同意於金融消費者保護法所稱爭議處理機構得受理範圍內，適用該機構所訂爭議處理程序。
            </p>
            <br />
            <p>
              13. 準據法及管轄法院：
            </p>
            <br />
            <p>
              13.1 本約定事項以中華民國法律為準據法。因本約定事項涉訟時，立約人同意以臺灣臺北地方法院為第一審管轄法院。但法律有專屬管轄之特別規定者，從其規定。
            </p>
            <br />
            <p>
              14. 其他未盡事宜：
            </p>
            <br />
            <p>
              14.1 除本約定事項另有約定外，其餘事項悉依貴行「存款開戶相關業務約定條款」(
              含其變更或修訂) 之相關約定辦理。
            </p>
          </NoticeArea>
          <div style={{ marginBottom: '2.4rem' }}>
            <FEIBCheckboxLabel
              control={(
                <FEIBCheckbox
                  color="default"
                  $iconColor={theme.colors.primary.brand}
                  icon={<RadioButtonUnchecked />}
                  checkedIcon={<RadioButtonChecked />}
                  onChange={handleCheckBoxChange}
                />
              )}
              label="我已詳閱並遵守無卡體款約定事項"
              $color={theme.colors.primary.brand}
            />
          </div>
          <FEIBButton
            $color={theme.colors.basic.white}
            $bgColor={theme.colors.primary.brand}
            $pressedBgColor={theme.colors.primary.dark}
            onClick={() => handleStep(1)}
          >
            啟用
          </FEIBButton>
        </div>
      );
    }
    return (
      <div>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel $color={theme.colors.primary.dark}>
            提款密碼設定
          </FEIBInputLabel>
          <FEIBInput
            type="password"
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel $color={theme.colors.primary.dark}>
            確認提款密碼
          </FEIBInputLabel>
          <FEIBInput
            type="password"
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel $color={theme.colors.primary.dark}>
            請輸入開通驗證碼
          </FEIBInputLabel>
          <FEIBInput
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel $color={theme.colors.primary.dark}>
            請輸入網銀密碼
          </FEIBInputLabel>
          <FEIBInput
            type="password"
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </FEIBInputAnimationWrapper>
        <div className="tip">注意事項</div>
        <FEIBButton
          $color={theme.colors.basic.white}
          $bgColor={theme.colors.primary.brand}
          $pressedBgColor={theme.colors.primary.dark}
          onClick={toStep1}
        >
          確定送出
        </FEIBButton>
      </div>
    );
  };

  useCheckLocation();

  useEffect(() => {
    userAxios.get('/api/cardLessATM').then((res) => {
      const { title } = res.data;
      dispatch(setTitle(title));
    });
  }, []);

  return <CardLessATMWrapper>{renderPage()}</CardLessATMWrapper>;
};

export default CardLessATM;
