import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import successImg from 'assets/images/successImg.svg';
import Header from 'components/Header';
import BottomDrawer from 'components/BottomDrawer';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import PasswordInput from 'components/PasswordInput';
import Dialog from 'components/Dialog';

/* Styles */
import InstalmentWrapper from './instalment.style';

const Instalment3 = () => {
  const [openDrawer, setOpenDrawer] = useState(true);
  const [showResultDialog, setShowResultDialog] = useState(true);

  const staging = [
    {
      installments: '1',
      principalPayable: 3334,
      principalPayableText: '(首期金額)',
      interest: 0,
      amountDue: 3334,
    },
    {
      installments: '2~3',
      principalPayable: 3334,
      principalPayableText: '(每期金額)',
      interest: 0,
      amountDue: 3334,
    },
  ];

  useCheckLocation();
  usePageInfo('/api/instalment');
  const history = useHistory();

  const ResultTable = () => (
    <>
      <InformationList title="分期總額" content="$10,000" />
      <InformationList title="申請分期期數" content="3期" />
      <InformationList title="分期利率" content="0%" />
    </>
  );

  const stagingTable = () => (
    <table style={{ alignSelf: 'center', margin: '1rem' }}>
      <thead>
        <tr>
          <td style={{ color: '#AC8DE8' }}>分期期數</td>
          <td style={{ color: '#AC8DE8' }}>當期應繳本金</td>
          <td style={{ color: '#AC8DE8' }}>分期利息</td>
          <td style={{ color: '#AC8DE8' }}>當期應繳金額</td>
        </tr>
      </thead>
      <tbody>
        {
          staging.map((item) => (
            <tr key={item.index}>
              <td>
                第
                &nbsp;
                { item.installments }
                &nbsp;
                期
              </td>
              <td>
                <p>
                  { item.principalPayable }
                </p>
                <p>
                  { item.principalPayableText }
                </p>
              </td>
              <td>
                { item.interest }
              </td>
              <td>
                { item.amountDue }
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );

  const renderPasswordArea = () => (
    <PasswordInput
      id="password"
      name="password"
    />
  );

  const renderBottomDrawer = () => (
    <form onSubmit={() => {}}>
      { renderPasswordArea() }
      <FEIBButton type="submit">送出</FEIBButton>
    </form>
  );

  const ResultDialog = () => (
    <Dialog
      title=" "
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="100" height="100">
            <image xlinkHref={successImg} width="100" height="100" />
          </svg>
          <p style={{ fontSize: '2rem', color: '#93DA49', textAlign: 'center' }}>設定成功</p>
          <div>
            <p style={{ textAlign: 'center' }}>您已完成 Bankee 信用卡</p>
            <p style={{ textAlign: 'center' }}>晚點付申請</p>
          </div>
        </div>
      )}
      action={(
        <FEIBButton onClick={() => {}}>確定</FEIBButton>
      )}
    />
  );

  return (
    <>
      <Header title="晚點付 (總額)" goBack={() => history.replace('/staging2')} />
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form>
          <div>
            <div className="InstalmentWrapperText">
              各期繳款金額試算 (依實際帳單為準)
            </div>
            { ResultTable() }
            { stagingTable() }
            <div style={{ padding: 8 }}>
              <p style={{ color: '#FF5F5F' }}>
                分期利息=本金餘額*(分期利率/12)
              </p>
              <p style={{ color: '#FF5F5F' }}>
                小數點後數字將四捨五入至整數位
              </p>
            </div>
          </div>
          <FEIBButton
            type="submit"
            onClick={() => {
              setShowResultDialog(true);
              history.push('/staging');
            }}
          >
            確認
          </FEIBButton>
        </form>
        <BottomDrawer
          isOpen={openDrawer}
          onClose={() => setOpenDrawer(!openDrawer)}
          content={() => renderBottomDrawer()}
          title="輸入網銀密碼"
        />
        <ResultDialog />
      </InstalmentWrapper>
    </>
  );
};

export default Instalment3;
