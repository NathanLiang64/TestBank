import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import Layout from 'components/Layout/Layout';
import BottomDrawer from 'components/BottomDrawer';
import PasswordInput from 'components/PasswordInput';
import { FEIBButton, FEIBCheckbox } from 'components/elements';

/* Styles */
import InstalmentWrapper from './instalment.style';

const Instalment1 = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

  const cardName = 'cardName';

  useCheckLocation();
  usePageInfo('/api/instalment');
  const history = useHistory();

  const renderSelectList = () => {
    const list = [
      { name: '中和環球', date: '消費日期：2021/06/15', cost: 3700 },
      { name: 'SOGO 台北忠孝店', date: '消費日期：2021/06/15', cost: 8000 },
      { name: '板橋大遠百', date: '消費日期：2021/06/15', cost: 10000 },
      { name: '中和環球', date: '消費日期：2021/06/15', cost: 9000 },
    ];
    return (
      <div className="selectList">
        { list.map((item) => (
          <p className="checkbox">
            <FEIBCheckbox
              className="customPadding"
            />
            <div style={{ flex: 1, padding: 8 }}>
              <div style={{ flex: 1 }}>{ item.name }</div>
              <div style={{ flex: 1, color: '#6F89B2' }}>{ item.date }</div>
            </div>
            <div style={{ padding: 8 }}>{ `$${item.cost}` }</div>
          </p>
        )) }
      </div>
    );
  };

  const renderBottomDrawer = () => (
    <div name="cardTitle">
      <div className="cardTitle">
        <h2 className="cardName">{ cardName }</h2>
      </div>
      <div style={{ hieght: 100 }}>
        <PasswordInput
          label="您的網銀密碼"
          id="password"
          name="password"
        />
      </div>
    </div>
  );

  return (
    <Layout title="晚點付 (單筆)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form>
          <div>
            <div className="messageBox">
              <p style={{ width: '100%', textAlign: 'center' }}>
                勾選申請分期消費
              </p>
              <p style={{ width: '100%', textAlign: 'center' }}>
                (單筆消費限額需達3,000元以上)
              </p>
            </div>
            {renderSelectList()}
          </div>
          <FEIBButton
            onClick={() => {
              setOpenDrawer(!openDrawer);
              history.push('/staging2');
            }}
          >
            下一步
          </FEIBButton>
        </form>
        <BottomDrawer
          className="instalmentDrawer"
          isOpen={openDrawer}
          onClose={() => setOpenDrawer(!openDrawer)}
          content={() => renderBottomDrawer()}
          title="輸入網銀密碼"
        />
      </InstalmentWrapper>
    </Layout>
  );
};

export default Instalment1;
