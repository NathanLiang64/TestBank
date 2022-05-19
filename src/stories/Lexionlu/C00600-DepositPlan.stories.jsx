import { Provider } from 'react-redux';
import store from 'stores/store';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';

import EmptySlide from 'pages/C00600_DepositPlan/components/EmptySlide';
import EmptyPlan from 'pages/C00600_DepositPlan/components/EmptyPlan';
import HeroSlide from 'pages/C00600_DepositPlan/components/HeroSlide';
import DepositPlan from 'pages/C00600_DepositPlan/components/DepositPlan';

const slides = [
  (args) => <EmptySlide {...args} />,
  (args) => <HeroSlide {...args} />,
  (args) => <HeroSlide {...args} />,
  (args) => <HeroSlide {...args} />,
  (args) => <HeroSlide {...args} />,
  (args) => <HeroSlide {...args} />,
  (args) => <HeroSlide {...args} />,
  (args) => <HeroSlide {...args} />,
];

const infoPanel = [
  { label: '適用利率', value: '0.6%' },
  { label: '每月存款日', value: '26號' },
  { label: '每次存款金額', value: '1萬' },
];

const contents = [
  (args) => <EmptyPlan {...args} />,
  (args) => <DepositPlan {...args} />,
  (args) => <DepositPlan currentValue={25} bonusInfo={infoPanel} {...args} />,
  (args) => <DepositPlan currentValue={50} bonusInfo={infoPanel} {...args} />,
  (args) => <DepositPlan currentValue={75} bonusInfo={infoPanel} {...args} />,
  (args) => <DepositPlan currentValue={99} bonusInfo={infoPanel} {...args} />,
  (args) => <DepositPlan currentValue={100} bonusInfo={infoPanel} {...args} />,
  (args) => <DepositPlan currentValue={7} expireDate="2000-01-01" {...args} />,
];

const DepositPlanPage = (args) => (
  <Layout title="存錢計畫" hasClearHeader>
    <SwiperLayout slides={slides.map((slide) => slide(args))}>
      { contents.map((card) => card(args)) }
    </SwiperLayout>
  </Layout>
);

export default {
  title: 'lexionlu/C00600-DepositPlan',
  component: DepositPlanPage,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  argTypes: {
    showDetails: { action: 'showDetails' },
    onAddClick: { action: 'onAddClick' },
    onMoreClicked: { action: 'onMoreClick' },
    onEditClicked: { action: 'onEditClick' },
  },
}

const Template = (args) => (
  <DepositPlanPage {...args} />
);

export const AllStages = Template.bind({});
