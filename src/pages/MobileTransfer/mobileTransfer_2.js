import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';

/* Styles */
import MobileTransferWrapper from './mobileTransfer.style';

const MobileTransfer2 = ({ location }) => {
  const history = useHistory();
  const [dealType, setDealType] = useState('');
  const [isModifyConfirmPage, setIsModifyConfirmPage] = useState(true);
  const [confirmData, setConfirmData] = useState({
    id: 0,
    mobile: '',
    isDefault: false,
    account: '',
    userName: '',
  });

  const setDealTypeContent = (type) => {
    switch (type) {
      case 'edit':
        setDealType('手機號碼收款變更');
        break;
      case 'delete':
        setDealType('手機號碼收款取消');
        break;
      default:
        setDealType('手機號碼收款設定');
        break;
    }
  };

  const toResultPage = () => {
    history.push(
      '/mobileTransfer3',
      {
        // 新增修改刪除成功或失敗
        result: true,
        isDeleteResult: location.state.type === 'delete',
      },
    );
  };

  useCheckLocation();
  usePageInfo('/api/mobileTransfer2');

  useEffect(() => {
    const { type, isModify, data } = location.state;
    setDealTypeContent(type);
    setIsModifyConfirmPage(isModify);
    setConfirmData(data);
  }, []);

  return (
    <MobileTransferWrapper>
      <form>
        <div className={`confirmDataContainer lighterBlueLine ${isModifyConfirmPage && 'modifyConfirmPage'}`}>
          <div>
            <InformationList title="交易種類" content={dealType} />
            <InformationList title="姓名" content={confirmData.userName} />
            <InformationList title="手機號碼" content={confirmData.mobile} />
            <InformationList title="收款帳號" content={confirmData.account} />
            <InformationList title="預設收款帳戶" content={confirmData.isDefault ? '是' : '否'} />
          </div>
          {
            isModifyConfirmPage && (
              <Accordion>
                <ol>
                  <li>一個手機號碼僅能設定一組存款帳號，若重複設定，將取消舊設定，改採新設定。</li>
                  <li>若欲設定帳號已被其他手機號碼設定，請先取消後再進行設定。</li>
                </ol>
              </Accordion>
            )
          }
        </div>
        <FEIBButton
          onClick={toResultPage}
        >
          確認
        </FEIBButton>
      </form>
    </MobileTransferWrapper>
  );
};

export default MobileTransfer2;
