import Avatar from 'components/Avatar';

const doc = `### 組件說明
Avatar 組件封裝用戶頭像

### 可傳參數

1. src -> 會員頭像的圖片路徑
2. name -> 若無圖片時，可傳入用戶名稱，預設取首字為底

`;

export default {
  title: 'components/Avatar',
  component: Avatar,
  argTypes: {
    src: { control: 'text' },
    name: { control: 'text' },
    small: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: doc } },
  },
};

const Template = (args) => (
  <Avatar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  name: 'Bankee',
  small: true,
};
