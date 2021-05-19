import { useCheckLocation, usePageInfo } from 'hooks';
import { FEIBButton, FEIBBorderButton } from 'components/elements';
import theme from 'themes/theme';
import AccountMaintenanceWrapper from './accountMaintenance.style';

const AccountMaintenance = () => {
  const accountList = [
    {
      id: 1,
      name: '爸爸',
      bank: '遠東銀行',
      bankCode: '805',
      account: '04300499006456',
    },
    {
      id: 2,
      name: '媽媽',
      bank: '遠東銀行',
      bankCode: '805',
      account: '04300499006456',
    },
    {
      id: 3,
      name: '廠商A',
      bank: '遠東銀行',
      bankCode: '805',
      account: '04300499006456',
    },
    {
      id: 4,
      name: '廠商B',
      bank: '遠東銀行',
      bankCode: '805',
      account: '04300499006456',
    },
    {
      id: 5,
      name: '我的債主',
      bank: '遠東銀行',
      bankCode: '805',
      account: '04300499006456',
    },
  ];

  useCheckLocation();
  usePageInfo('/api/accountMaintenance');

  const renderCards = (list) => (
    list.map((item) => {
      const {
        id,
        name,
        bank,
        bankCode,
        account,
      } = item;
      return (
        <div key={id} className="card">
          <div className="cardInfo">
            <div className="title">
              <h3 className="name">{name}</h3>
              <div className="actions">
                <FEIBBorderButton
                  $width={4.8}
                  $height={3.2}
                  $borderColor={theme.colors.border.light}
                  $color={theme.colors.text.lightGray}
                >
                  修改
                </FEIBBorderButton>
                <FEIBBorderButton
                  $width={4.8}
                  $height={3.2}
                  $borderColor={theme.colors.state.danger}
                  $color={theme.colors.state.danger}
                >
                  刪除
                </FEIBBorderButton>
              </div>
            </div>
            <p className="account">{`(${bankCode}) ${bank} - ${account}`}</p>
          </div>
          <FEIBButton
            $color={theme.colors.basic.white}
            $bgColor={theme.colors.primary.brand}
            $pressedBgColor={theme.colors.primary.dark}
            $width={6}
          >
            轉帳
          </FEIBButton>
        </div>
      );
    })
  );

  return (
    <AccountMaintenanceWrapper>
      <div>
        <FEIBButton
          $color={theme.colors.basic.white}
          $bgColor={theme.colors.primary.brand}
          $pressedBgColor={theme.colors.primary.dark}
        >
          新增常用 / 約定帳號
        </FEIBButton>
      </div>
      <div className="cards">
        { renderCards(accountList) }
      </div>
    </AccountMaintenanceWrapper>
  );
};

export default AccountMaintenance;
