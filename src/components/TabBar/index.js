import TabBarImage from 'assets/images/tabBar.png';
import TabBarWrapper from './tabBar.style';

const TabBar = () => (
  <TabBarWrapper>
    <img src={TabBarImage} alt="tab bar" />
  </TabBarWrapper>
);

export default TabBar;
