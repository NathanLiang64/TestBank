import SwiperLayout from 'components/SwiperLayout';

const doc = `### 組件說明
適用於上方Swiper，下方內容之版型，如「存錢計畫」。
有兩種使用情境：

1. 如果參數 slides 和 children 皆為 array，且 length 一致，本元件會自動切換對應的 children。
2. 如果單一 children，便需自行管理其內容。可用 onSlideChange hook。

### 可傳參數

1. slides: (array | React.Fragment) -> 上方 swiper 的 slides。
2. children: (array | React.Fragment) -> 下方內容。
3. hasDivider: boolean -> 顯示中間分隔線。
4. onSlideChange: function -> 當切換 slide 時會呼叫。
5. swiperParameters: any -> 其餘的參數會傳給 Swiper，請參考 Swiper API。

`;

export default {
  title: 'lexionlu/SwiperLayout',
  component: SwiperLayout,
  argTypes: {
    hasDivider: { control: 'boolean' },
    onSlideChange: { action: 'onSlideChange' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <SwiperLayout {...args} />
);

export const Simple = Template.bind({});
Simple.args = {
  hasDivider: true,
};
