import { useState } from 'react';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBSwitch } from 'components/elements';
import { startFunc } from 'utilities/AppScriptProxy';
import { EditIcon } from 'assets/images/icons';

import CardLessSettingWrapper from './cardLessSetting.style';

const CardLessSetting = () => {
  const [active, setActive] = useState(false);

  const handleSwitchChange = () => {
    setActive(!active);
  };

  const toChangePwd = () => {
    startFunc('D00400');
  };

  return (
    <Layout title="無卡提款設定">
      <CardLessSettingWrapper>
        <div className="controlContainer">
          <div className="switchContainer">
            <div className="labelContainer">
              <p className="labelTxt">無卡提款</p>
              {
                active && (
                  <p className="phoneNum">0900000000</p>
                )
              }
            </div>
            <FEIBSwitch
              checked={active}
              onChange={() => handleSwitchChange()}
            />
          </div>
          {
            active && (
              <div className="mainBlock toChangePwd" onClick={toChangePwd}>
                變更無卡提款密碼
                <EditIcon />
              </div>
            )
          }
        </div>
        <Accordion title="使用條款" space="both">
          <div className="dealContent">
            無卡提款設定服務條款
          </div>
        </Accordion>
      </CardLessSettingWrapper>
    </Layout>
  );
};

export default CardLessSetting;
