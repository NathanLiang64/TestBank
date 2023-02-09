import { openhb } from 'pages/A00400_Provisioning/api';
import { showAnimationModal } from 'utilities/MessageModal';

/* Elements */
import { FEIBButton } from 'components/elements';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';

/* Styles */
import { useNavigation } from 'hooks/useNavigation';
import ProvisioningWrapper from './provisioning.style';

const Provisioning = () => {
  const { goHome } = useNavigation();
  // 設定結果彈窗
  const setResultDialog = (response) => {
    showAnimationModal({
      isSuccess: response,
      successTitle: '設定成功',
      successDesc: '',
      errorTitle: '設定失敗',
      errorCode: '',
      errorDesc: '',
      onClose: () => goHome(),
    });
  };

  // 呼叫開通 api
  const triggerProvide = async () => {
    const openhbResponse = await openhb({});
    console.log(openhbResponse);
    setResultDialog(openhbResponse);
  };

  return (
    <Layout title="開通行動銀行服務" goBack={false} goHome={false}>
      <ProvisioningWrapper>
        <div className="tip">您尚未開通 Bankee 行動銀行</div>
        <Accordion title="服務條款" space="both" open>
          <div className="dealContent">
            <p>
              親愛的客戶，歡迎您使用遠東國際商業銀行所提供之應用程式（以下簡稱APP），為了讓您能夠安心的使用本APP為您所提供的各項服務，並允許本網站在必要時記錄、使用您個人所供的相關資訊以提供您更貼心的服務，我們在此先向您說明我們網站的隱私權保護政策，以及我們對您所提供的任何資料的絶對保護及尊重。
            </p>
            <br />
            <p>
              遠銀為提供金融服務內容，請客戶提供公司 /
              個人資料，如：公司名稱、姓名、統一編號、身分證統一編號、出生年月日、住址以及任何客戶辨識等資料，因服務之提供而獲得有關客戶的帳務、信用、投資或保險等資料，如非經過客戶的同意、授權或因其他法律上的規定，遠銀不會將客戶非公開之資料透露給無關之第三者知悉。
            </p>
            <br />
            <p>
              遠銀在蒐集客戶的資料後，會將客戶個人資料嚴密地保存在遠銀資料庫中，任何人必須在符合遠銀資料授權管理規範，始可進行資料之取得與使用。
            </p>
            <br />
            <p>
              當遠銀為了必要之信用調查、風險控管等用途，與信譽良好的徵信查詢機構或票據交換所交換資料時，將會以審慎及嚴謹的態度來處理您個人資料。
            </p>
            <br />
            <p>
              遠銀行員均接受公司完整的資訊保密教育，並充分瞭解客戶資料之保密是行員的基本責任，若遠銀行員違反客戶資料保密承諾，遠銀將依相關法令及內部規範予以處分。
            </p>
            <br />
            <p>
              除法令有特別規定或經客戶同意的前提下，遠銀對客戶個人資料的蒐集、電腦處理與利用，將只限於為提供良好服務、營業登記項目或章程所定業務之需要、其他業務相關機構及受遠銀委託處理相關業務之機構等特定目的之必要範圍內。
            </p>
            <br />
            <p>
              有關於客戶的個人資料分類，包括基本資料、帳務資料、信用資料、投資資料及保險資料，遠銀會依據客戶與遠銀簽訂之申請書或相關契約上所勾選同意提供之資料範疇內，進行共同行銷的運用與揭露。
            </p>
            <br />
            <p>
              客戶隨時得以書面方式及電話通知遠銀單位服務中心，停止使用客戶的個人資料從事於共同業務推廣之行為。
            </p>
            <br />
            <p>
              遠銀將盡全力維護客戶個人資料的完整、正確性，如果客戶個人資料有所變更，可以直接向往來營業據點申請變更；除法令另有限制外，在身分確認無誤後，亦可透過遠銀的網站、電話服務等方式申請變更客戶個人資料。
            </p>
            <br />
            <p>
              本APP於登入時提供「記住身分證」功能供客戶選擇使用，客戶同意使用本功能後，於下次進入本APP登入頁面時會自動顯示已遮蔽的身分證統一編號，客戶僅需輸入使用者代號及網銀密碼即可完成登入。客戶身分證統一編號資料會經過加密後儲存以保障客戶資料安全。
            </p>
            <br />
            <p>
              其他未盡事宜，請參閱本行「個人資料保護法告知事項」:
              {/* TODO 目前連結為 hardcode，後需是否從後端拿取待討論 */}
              <a
                href="https://www.feib.com.tw/detail?id=325"
                target="_blank"
                rel="noreferrer"
              >
                https://www.feib.com.tw/detail?id=325
              </a>
            </p>
            <br />
            <p>
              如有疑慮，請洽本行客服專線:
              {/* TODO 目前連結為 hardcode，後需是否從後端拿取待討論 */}
              <a href="https://www.feib.com.tw/tel" target="_blank" rel="noreferrer">
                https://www.feib.com.tw/tel
              </a>
            </p>
            <br />
            <p>
              遠東商銀行動銀行，將會視您使用之功能要求存取您的下列權限，請視您的需求進行授權：
            </p>

            <p>需要開啟您的網路權限，進行連線。</p>
            <p>需要使用指紋辨識及震動功能進行快速登入。</p>
            <p>需要使用您的照片及相機，如QR Code轉帳功能。</p>
            <p>部分功能需要設定接收及提示燈號服務，如推播通知。</p>
            <p>部分功能需要取用您的通知功能，允許應用程式接收與顯示推播訊息。</p>
            <p>部分手機需要取用您的存取儲存空間功能，如儲存畫面功能。</p>
            <p>部分手機需要取用您的臉部辨識(Face ID)功能，進行快速登入。</p>
            <p>部分手機需要取用您的電話功能，如APP裝置認證功能。</p>
          </div>
        </Accordion>
        <FEIBButton onClick={triggerProvide}>同意條款並送出</FEIBButton>
      </ProvisioningWrapper>
    </Layout>
  );
};

export default Provisioning;
