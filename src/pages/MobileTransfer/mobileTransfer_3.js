import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';

/* Elements */
import { FEIBButton } from 'components/elements';

/* Styles */
import MobileTransferWrapper from './mobileTransfer.style';

const MobileTransfer3 = ({ location }) => {
  const history = useHistory();
  const [isSuccess, setIsSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const toMobileTransferPage = () => {
    history.push('/mobileTransfer');
  };

  useCheckLocation();
  usePageInfo('/api/mobileTransfer');

  useEffect(() => {
    setIsSuccess(location.state.result);
    setDeleteSuccess(location.state.isDeleteResult);
  }, []);

  return (
    <MobileTransferWrapper>
      <form>
        <div>
          <div className="stateArea">
            <div className="stateImage">
              <img src={isSuccess ? SuccessImage : ErrorImage} alt="Success" />
            </div>
            {
              isSuccess
                ? (
                  <>
                    <h3 className="stateText success">設定成功</h3>
                  </>
                )
                : (
                  <>
                    <h3 className="stateText error">設定失敗</h3>
                  </>
                )
            }
          </div>
          <div className="infoArea">
            {/* 失敗 */}
            {
              !isSuccess && (
                <>
                  <div className="title">錯誤代碼：</div>
                  <div className="content">您輸入的「一次性密碼」錯誤超過本行規定次數，本行將停止您手機號碼轉帳服務5分鐘。</div>
                </>
              )
            }
            {/* 成功 */}
            {
              (isSuccess && !deleteSuccess) && (
                <>
                  <div className="title">請注意！</div>
                  <div className="content">
                    僅限有開辦手機號碼服務的銀行才能轉帳至此帳戶。
                    <span className="redHighlight">
                      請記得使用以下銀行的手機號碼轉帳功能才可能進行轉帳：
                    </span>
                    <br />
                    遠東、台灣、土地、合作金庫、第一、華南、彰化、上海、高雄、兆豐、台中、京城、陽信、三信、花蓮二信、聯邦、元大、永豐、玉山及凱基，共20家銀行。
                  </div>
                </>
              )
            }
          </div>
        </div>
        <FEIBButton
          onClick={toMobileTransferPage}
        >
          確認
        </FEIBButton>
      </form>
    </MobileTransferWrapper>
  );
};

export default MobileTransfer3;
