import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import { FEIBCheckboxLabel, FEIBCheckbox, FEIBButton } from 'components/elements';
import NoticeArea from 'components/NoticeArea';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';

/* Styles */
import theme from 'themes/theme';
import ProjectJWrapper from './projectJ.style';

import PersonalSaveContent from './personalSaveContent';

const ProjectJ = () => {
  const [agree, setAgree] = useState(false);
  const [showSavePersonalDailog, setShowSavePersonalDailog] = useState(false);
  const [showLogoutWarnDialog, setShowLogoutWarnDialog] = useState(false);
  const [showFastApplyCheckDialog, setShowFastApplyCheckDialog] = useState(false);
  const [applyType, setApplyType] = useState(0);
  const handleCheckBoxChange = () => {
    setAgree(!agree);
  };

  const handleNormalApplyClick = () => {
    setApplyType(0);
    setShowLogoutWarnDialog(true);
  };

  const handleFastApplyClick = () => {
    setApplyType(1);
    if (!agree) {
      setShowFastApplyCheckDialog(true);
    } else {
      setShowLogoutWarnDialog(true);
    }
  };

  const SavePersonalDialog = () => (
    <Dialog
      title="遠東國際商業銀行履行個人資料保護法告知義務內容"
      isOpen={showSavePersonalDailog}
      onClose={() => setShowSavePersonalDailog(false)}
      content={(
        <NoticeArea title=" " textAlign="justify">
          <PersonalSaveContent />
        </NoticeArea>
      )}
      action={
        <FEIBButton onClick={() => setShowSavePersonalDailog(false)}>確定</FEIBButton>
      }
    />
  );

  const FastApplyCheckDialog = () => (
    <Dialog
      isOpen={showFastApplyCheckDialog}
      onClose={() => setShowFastApplyCheckDialog(false)}
      content={(
        <p>快速申請前須請您詳閱個人資料保護法告知事項並同意提供上述資料予 join 進行會員申請，謝謝。</p>
      )}
      action={
        <FEIBButton onClick={() => setShowFastApplyCheckDialog(false)}>確定</FEIBButton>
      }
    />
  );

  const LogoutWarnDialog = () => (
    <Dialog
      isOpen={showLogoutWarnDialog}
      onClose={() => setShowLogoutWarnDialog(false)}
      content={(
        <>
          <p>
            貼心提醒：
          </p>
          <p>
            您即將進入join平台的服務網站，為保障帳戶安全，系統將為您「登出」Bankee銀行服務。
          </p>
        </>
      )}
      action={(
        <ConfirmButtons
          subButtonOnClick={() => setShowLogoutWarnDialog(false)}
          mainButtonOnClick={() => {
            // 登出 APP，頁面轉導
            // 一般申請：https://www.joinusnow.com.tw/investment
            // 快速申請：https://www.joinusnow.com.tw/investSignUp?data={加密資料}
            // * 由WebController提供加密API
            if (applyType) {
              // eslint-disable-next-line no-alert
              alert('https://www.joinusnow.com.tw/investSignUp?data={加密資料}');
            } else {
              // eslint-disable-next-line no-alert
              alert('https://www.joinusnow.com.tw/investment');
            }
          }}
        />
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/projectJ');

  return (
    <ProjectJWrapper>
      <div className="projectDescription">
        <p>
          資金出借助人，還能獲取收益！
        </p>
        <p>
          歡迎加入 join 會員，您可以自由選擇投資金額，線上自動撮合成功後，投資金額將出借給借款人，之後每月回收本金及獲取收益，為自己加薪就是這麼容易！
        </p>
      </div>
      <NoticeArea title="快速申請join會員" textAlign="justify" space="top">
        <p>我同意將我留存在 Bankee 的個人資料（如下項目）用以註冊遠傳 join 平台會員，勾選下方☐處＋點選「快速申請」，省時又便利！</p>
        <ul>
          <li>・姓名</li>
          <li>・行動電話</li>
          <li>・身分證字號</li>
          <li>・出生年月日</li>
          <li>・電子郵件email</li>
          <li>・戶籍地址</li>
          <li>・現居/通訊地址</li>
        </ul>
      </NoticeArea>
      <div className="checkBoxContainer">
        <FEIBCheckboxLabel
          control={(
            <FEIBCheckbox
              checked={agree}
              onChange={handleCheckBoxChange}
            />
          )}
          label={(
            <div className="agreeLabel">
              <p>
                本人已詳閱
                <button
                  type="button"
                  className="personalSaveLink"
                  onClick={() => setShowSavePersonalDailog(true)}
                >
                  [個人資料保護法告知事項]
                </button>
                ，並同意提供上述資料予 join 進行會員申請。
              </p>
            </div>
          )}
          $color={theme.colors.primary.brand}
        />
        <div style={{ margin: '2rem 0' }}>
          <ConfirmButtons
            mainButtonValue="快速申請"
            mainButtonOnClick={handleFastApplyClick}
            subButtonValue="一般申請"
            subButtonOnClick={handleNormalApplyClick}
          />
        </div>
        <div className="alertContainer">
          <p>
            提醒您：遠傳 join 智慧借貸平台不保證最低投資收益，投資收益不表示絕無風險，投資前請詳閱相關內容及說明，並審慎評估。遠傳 join 智慧借貸平台與遠東商銀 Bankee 並無合資、合夥、僱傭、經銷或互為代理之關係。
          </p>
        </div>
      </div>
      <SavePersonalDialog />
      <LogoutWarnDialog />
      <FastApplyCheckDialog />
    </ProjectJWrapper>
  );
};

export default ProjectJ;
