import { Route, Switch } from 'react-router-dom';

import TurnOnSetting from './turnOnSetting';

/* Styles */
import CardlessWithdrawalWrapper from './cardlessWithdrawal.style';

const CardlessWithdrawal = () => (
  <CardlessWithdrawalWrapper>
    <Switch>
      <Route exact path="/cardlessWithdrawal/turnOnSetting" component={TurnOnSetting} />
    </Switch>
  </CardlessWithdrawalWrapper>
);

export default CardlessWithdrawal;
