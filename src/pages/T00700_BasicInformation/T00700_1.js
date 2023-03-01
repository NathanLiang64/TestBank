/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { customPopup, showError, showPrompt } from 'utilities/MessageModal';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import { sendConfirmMail, updateVerifyRecord } from './api';

/**
 * 電子信箱驗證頁
 * @param {{location: {state: {viewModel, model}}}} props
 */
const EmailVerificationPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const {viewModel, model} = location.state;

  /**
   *- 頁面初始化
   */
  useEffect(() => {
    dispatch(setWaittingVisible(false));

    // 驗證模式(emailStatus)：0=已驗證過, 1=立即驗證, 2=選擇理由, 3=無法使用, 9=驗證信已發送，但申請人尚未驗證；或是驗證信件在發送中
    if (viewModel.emailStatus !== 9) { // 已發送就不要再發驗證信，直接進確認頁。
      sendVerifyEmail(viewModel.emailStatus, viewModel.relationPeople).then((result) => {
        if (!result) goBack(); // 取消 -> 重新輸入E-Mail
      });
    }
  }, []);

  /**
   * 檢查 E-Mail 的有效性，以符合理專 21 誡規定。
   */
  const sendVerifyEmail = async (mode, relations) => {
    const context = [
      (<p>本行將進行電子信箱驗證確認。</p>),
      (<p>本行將進行電子信箱驗證確認，提醒您，因您所填寫的電子信箱與本行其他客戶相同，請務必依實際原因勾選，若您的原因不在預設的勾選項目中，則 <font color="red">請重新輸入其他電子信箱</font>。</p>),
      (<p>本行將進行電子信箱驗證確認，提醒您，因您所填寫的電子信箱與本行其他客戶相同，為確保您的權益，<font color="red">請重新輸入其他電子信箱</font>。</p>),
    ];

    const title = '系統訊息';
    const body = (
      <div style={{ marginTop: '15px', width: '100%', fontSize: 'medium' }}>
        <div>{context[mode - 1]}</div>
        {/* 設定相同E-Mail的人的關係（原因） */}
        {mode === 2 ? (
          <div style={{ textAlign: 'center' }}>
            <table>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center', minWidth: '60px' }}>姓名</td>
                  <td style={{ textAlign: 'center' }}>原因</td>
                </tr>
                {relations.map(({id, name}) => (
                  <tr key={id}>
                    <td style={{ fontWeight: 'bold', padding: '0px 15px' }}>{name}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '4px' }}>
                        <label style={{ marginRight: '15px' }} htmlFor={`${id}1`}>
                          <input type="radio" id={`${id}1`} name={id} onChange={() => setRelation(id, 1)} style={{ marginRight: '3px' }} />
                          親屬關係
                        </label>
                        <label htmlFor={`${id}2`}>
                          <input type="radio" id={`${id}2`} name={id} onChange={() => setRelation(id, 2)} style={{ marginRight: '3px' }} />
                          朋友
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
    const onOk = () => saveSetting(mode);

    return customPopup(title, body, onOk, null, '發送確認信', '重新輸入');
  };

  /**
   * 指定項目的關係值。
   * @param {*} id
   * @param {*} value 1.親屬關係, 2.朋友
   */
  const setRelation = (id, value) => {
    const index = viewModel.relationPeople.findIndex((ppl) => ppl.id === id);

    if (!viewModel.emailRelations) viewModel.emailRelations = [];
    viewModel.emailRelations[index] = {
      id,
      relation: value,
    };
  };

  /**
   * 完成所有相同電子郵件者的關係的設定，並發送驗證郵件。
   */
  const saveSetting = async (mode) => {
    if (mode > 2) return false;

    // 檢查是否已設定與所有相同電子郵件者的關係。
    if (mode === 2) {
      const finishItems = viewModel.emailRelations?.filter((p) => p);
      if (finishItems?.length !== viewModel.relationPeople.length) {
        alert('尚未選擇使用相同電子郵件的原因。');
        return false; // 表示不要關閉 Popup
      }
    }

    dispatch(setModalVisible(false)); // 關閉 EmailVerify Popup

    sendEmail();
    return true;
  };

  /**
   *- 發送驗證郵件
   */
  const sendEmail = async () => {
    const result = await sendConfirmMail(model.email);
    if (result) {
      model.emailVerifyToken = result;
    } else {
      await showError('無法正常發送驗證郵件，請稍後再試。');
    }
  };

  /**
   *- 檢查郵件是否已完成驗證
   */
  const handleConfirm = async () => {
    const status = await updateVerifyRecord(model.emailVerifyToken, viewModel.emailRelations);
    viewModel.emailStatus = status; // NOTE 提供返回 T00700 時，在初始化後可立接續原來的動作。
    if (status === 0) {
      goBack();
    } else {
      await showPrompt('您尚未完成電子信箱驗證信連結確認。');
    }
  };

  /**
   * 回前一頁。
   */
  const goBack = () => {
    history.replace('T00700', location.state); // 將 model 及 viewModel 傳回。
  };

  // TODO 改用 styleComponent 不要寫在 HTML 中
  return (
    <Layout title="電子郵件 E-Mail 驗證" goHome={false} goBackFunc={goBack}>
      <div>
        <div style={{ margin: '0 15px' }}>
          <p style={{ fontSize: 'large', color: 'gray' }}>您的<font color="red"><u> 電子郵件 email 驗證信 </u></font>已發送至</p>
          <div style={{ margin: '30px 0 30px 0', padding: '0px', borderBottom: '1px solid #404040' }}>
            <p style={{ display: 'inline-block', wordBreak: 'break-all', width: '68%', margin: '0px' }}>
              {model.email}
            </p>
            <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
              <button type="button" onClick={sendEmail} style={{ border: 'none', bottom: '3px', backgroundColor: '#ffffff00', color: '#ab8ce4' }}>
                重新發送
              </button>
            </div>
          </div>
          <p style={{ fontSize: 'large', marginBottom: '30px' }}><font color="red">請您於電子信箱驗證信中點選連結確認後，再回到本頁點選下方「已完成驗證」繼續完成申請。</font></p>
          <p style={{ color: 'gray', marginBottom: '200px' }}>請注意，若您未收到電子信箱驗證信，請優先查看垃圾郵件資料夾，或稍待電子信件送達，或重新輸入其他電子信箱。</p>
        </div>
        <div style={{ marginTop: '10px' }}>
          <FEIBButton key="reenter" onClick={goBack} style={{ margin: '0, 5, 10, 5' }}>
            重新輸入
          </FEIBButton>
          <FEIBButton key="confirm" onClick={handleConfirm} className="btn-comfirm" style={{ margin: '0, 5, 10, 5' }}>
            我已完成驗證
          </FEIBButton>
        </div>
      </div>
    </Layout>
  );
};

export default EmailVerificationPage;
