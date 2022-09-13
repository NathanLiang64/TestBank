import { useState } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBCheckbox } from 'components/elements';

/* Styles */
import InstalmentWrapper from './instalment.style';

const Instalment1 = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

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
      </InstalmentWrapper>
    </Layout>
  );
};

export default Instalment1;
