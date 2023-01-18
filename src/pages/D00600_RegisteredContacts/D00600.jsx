import { useState, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { showDrawer } from 'utilities/MessageModal';
import { loadFuncParams } from 'utilities/AppScriptProxy';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useNavigation } from 'hooks/useNavigation';
import EmptyData from 'components/EmptyData';
import {
  getAgreedAccount,
  updateAgreedAccount,
} from './api';
import AccountEditor from './D00600_AccountEditor';
import PageWrapper from './D00600.style';

/**
 * D00600 約定帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const { closeFunc } = useNavigation();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [selectorMode, setSelectorMode] = useState();
  const [bindAccount, setBindAccount] = useState();
  const [accounts, setAccounts] = useState();
  const [selectedAccount, setSelectedAccount] = useState();

  /**
   *- 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // Function Controller 提供的參數
    // startParams = {
    //   selectorMode: true, 表示選取帳號模式，啟用時要隱藏 Home 圖示。
    //   defaultAccount: 指定的帳號將設為已選取狀態
    //   bindAccount: 只列出此帳號設定的約轉帳號清單。
    // };
    const startParams = await loadFuncParams();
    const bindAcct = startParams?.bindAccount;

    // 若有指定帳號，則只取單一帳號的約定帳號清單。
    // TODO 未指定帳號時，應改用頁韱分類。
    const request = {
      accountNo: bindAcct,
      includeSelf: (startParams?.selectorMode ?? false), // 還要加上同ID互轉的帳號, 必需 同幣別。
    };
    getAgreedAccount(request).then(async (accts) => {
      if (startParams) {
        // NOTE 選取模式時，從轉帳頁面進來時，要排除「非該轉帳頁面幣別」的帳號 (ex: 從臺幣轉帳進來只能選取臺幣類型的常用帳號)
        const isForeignType = bindAcct.substring(3, 6) === '007'; // '007' 外幣帳戶 , '004' 台幣帳戶
        const selectedModeAccts = accts.filter((acct) => acct.isForeign === isForeignType); // TOOD 待測試
        setAccounts(selectedModeAccts);
        setBindAccount(bindAcct);
        setSelectorMode(startParams.selectorMode ?? false);
        setSelectedAccount(startParams?.defaultAccount);
      } else {
        // NOTE 非選取模式時，不需要列出同ID互轉的帳號
        const nonSelectedModeAccts = accts.filter(({isSelf}) => !isSelf);
        setAccounts(nonSelectedModeAccts);
      }

      dispatch(setWaittingVisible(false));
    });
  }, []);

  /**
   * 將選取的帳號傳回給叫用的單元功能，已知[轉帳]有使用。
   * @param {*} acct 選取的帳號。
   */
  const onAccountSelected = (acct) => {
    if (selectorMode) {
      const response = {
        memberId: acct.headshot,
        accountName: acct.nickName,
        bankName: acct.bankName,
        bankId: acct.bankId,
        accountNo: acct.acctId,
      };
      closeFunc(response);
    }
  };

  /**
   * 處理UI流程：編輯帳戶
   * @param {*} acct 變更前資料。
   */
  const editAccount = async (acct) => {
    const onFinished = async (newAcct) => {
      dispatch(setWaittingVisible(true));

      const newAccounts = await updateAgreedAccount(bindAccount, newAcct);
      dispatch(setWaittingVisible(false));
      setAccounts(newAccounts);
      forceUpdate();
    };

    await showDrawer('編輯約定帳號', (<AccountEditor initData={acct} onFinished={onFinished} />));
  };

  const renderMemberCards = () => {
    if (!accounts) return null;
    if (!accounts.length) return <EmptyData content="查無約定帳號" height="70vh" />;
    return accounts.map((acct) => (
      <MemberAccountCard
        key={uuid()} // key值每次編輯後皆改變，以觸發react重新渲染
        name={acct.nickName}
        bankNo={acct.bankId}
        bankName={acct.bankName}
        account={acct.acctId}
        memberId={acct.headshot}
        isSelected={(acct.acctId === selectedAccount)}
        onClick={() => onAccountSelected(acct)} // 傳回值：選取的帳號。
        moreActions={acct.isSelf ? null : [ // 不可編輯自己的帳號。（因為是由同ID互轉建立的）
          { lable: '編輯', type: 'edit', onClick: () => editAccount(acct) },
        ]}
      />

    ));
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout title="約定帳號管理">
      <Main small>
        <PageWrapper>
          {renderMemberCards()}
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
