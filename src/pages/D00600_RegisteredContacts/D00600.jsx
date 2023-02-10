import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { showDrawer } from 'utilities/MessageModal';
import { loadFuncParams } from 'utilities/AppScriptProxy';
import { Func } from 'utilities/FuncID';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useNavigation } from 'hooks/useNavigation';
import EmptyData from 'components/EmptyData';
import { getAccountsList } from 'utilities/CacheData';
import { DropdownField } from 'components/Fields';
import { useForm } from 'react-hook-form';
import Loading from 'components/Loading';
import { accountFormatter } from 'utilities/Generator';
import { getAgreedAccount, updateAgreedAccount } from './api';
import AccountEditor from './D00600_AccountEditor';
import PageWrapper from './D00600.style';

/**
 * D00600 約定帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const { closeFunc } = useNavigation();

  const [isFetching, setIsFetching] = useState(false);
  const [accounts, setAccounts] = useState();
  const [model, setModel] = useState({
    selectorMode: false,
    selectedAccount: '',
    accountOptions: [],
  });

  const { control, reset, watch } = useForm({ defaultValues: { accountNo: ''} });
  const accountNo = watch('account'); // 欲查詢的活存帳號

  /**
   *- 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const accountsList = await getAccountsList('MFC', undefined, true);// M=臺幣主帳戶、C=臺幣子帳戶、F=外幣帳戶

    // Function Controller 提供的參數
    // startParams = {
    //   selectorMode: true, 表示選取帳號模式，啟用時要隱藏 Home 圖示。
    //   defaultAccount: 指定的帳號將設為已選取狀態
    //   bindAccount: 只列出此帳號設定的約轉帳號清單。
    // };
    const startParams = await loadFuncParams();

    // 若有指定帳號，則只取單一帳號的約定帳號清單。若無指定帳號，則以 acctOptions 中的第一個項目為預設帳號。
    const acctOptions = accountsList.map((acct) => ({label: `${accountFormatter(acct.accountNo, true)} ${acct.alias}`, value: acct.accountNo}));
    setModel((prevModel) => ({
      ...prevModel,
      selectorMode: startParams?.selectorMode ?? false,
      selectedAccount: startParams?.defaultAccount ?? {},
      accountOptions: acctOptions,
    }));
    reset({account: startParams?.bindAccount ?? acctOptions[0].value});

    dispatch(setWaittingVisible(false));
  }, []);

  const accountsFilter = (accts) => {
    if (model.selectorMode) {
      // NOTE 選取模式時
      // 1. 從轉帳頁面進來時，要排除「非同幣別」的帳號 (ex: 從臺幣轉帳進來只能選取臺幣類型的常用帳號)
      // 2. accts 內的項目若是本行帳戶(805)，只允許顯示特定科目 001活儲/003行員存款/004活存/031支存
      const isForeignType = accountNo.padStart(16, '0').substring(5, 8) === '007'; // '007' 外幣帳戶 , '004' 臺幣帳戶
      const allowedSubjects = ['001', '003', '004', '031'];

      return accts.filter((acct) => {
        const {isForeign, bankId, acctId} = acct;
        const subject = acctId.padStart(16, '0').substring(5, 8);
        return isForeign === isForeignType && (bankId !== '805' || allowedSubjects.includes(subject));
      });
    }
    // NOTE 非選取模式時，不需要列出同ID互轉的帳號
    return accts.filter((acct) => !acct.isSelf);
  };

  // 活存帳號選項改變時，查詢活存帳號下的約定轉入帳號清單
  useEffect(() => {
    if (model.accountOptions.length && accountNo) {
      setIsFetching(true);
      getAgreedAccount(accountNo).then((accts) => {
        const filteredAccounts = accountsFilter(accts);
        setAccounts(filteredAccounts);
        setIsFetching(false);
      });
    }
  }, [model, accountNo]);

  /**
   * 將選取的帳號傳回給叫用的單元功能，已知[轉帳]有使用。
   * @param {*} acct 選取的帳號。
   */
  const onAccountSelected = (acct) => {
    if (model.selectorMode) {
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
      const newAccounts = await updateAgreedAccount(accountNo, newAcct);
      dispatch(setWaittingVisible(false));
      const filteredAccounts = accountsFilter(newAccounts);
      setAccounts(filteredAccounts);
    };

    await showDrawer('編輯約定帳號', (<AccountEditor initData={acct} onFinished={onFinished} />));
  };

  const renderMemberCards = () => {
    if (!accounts || isFetching) return <Loading space="both" isCentered />;
    if (!accounts.length) return <EmptyData content="查無約定帳號" height="70vh" />;
    return accounts.map((acct) => (
      <MemberAccountCard
        key={`${acct.bankId}_${acct.acctId}`}
        name={acct.nickName}
        bankNo={acct.bankId}
        bankName={acct.bankName}
        account={acct.acctId}
        memberId={acct.headshot}
        isSelected={(acct.acctId === model.selectedAccount.accountNo && acct.bankId === model.selectedAccount.bankId)}
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
    <Layout fid={Func.D006} title="約定帳號管理">
      <Main small>
        <PageWrapper>
          <div className={`dropdownContainer ${model.selectorMode ? 'hide' : ''}`}>
            <DropdownField
              name="account"
              control={control}
              options={model.accountOptions}
              labelName="請選擇活存帳號"
            />
          </div>
          {renderMemberCards()}
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
