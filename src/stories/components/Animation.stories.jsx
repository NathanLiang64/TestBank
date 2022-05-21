import Animation from 'components/Animation';

import fail from 'assets/animations/fail.json';
import saving25 from 'assets/animations/saving25.json';
import saving50 from 'assets/animations/saving50.json';
import saving75 from 'assets/animations/saving75.json';
import saving99 from 'assets/animations/saving99.json';
import successCheer from 'assets/animations/successCheer.json';
import successFlower from 'assets/animations/successFlower.json';
import successLove from 'assets/animations/successLove.json';
import successMusic from 'assets/animations/successMusic.json';

const doc = `### 組件說明
Animation 組件封裝了 LottieFile 的動畫呈現套件

### 可傳參數

1. data -> 動畫檔案 (.json)
2. width -> 寬度，可輸入數字，預設 124
3. height -> 高度，可輸入數字，預設 120

`;

export default {
  title: 'components/Animation',
  component: Animation,
  argTypes: {
    height: { control: 'number' },
    width: { control: 'number' },
    data: { control: 'object' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <Animation {...args} />
)

export const Fail = Template.bind({});
Fail.args = { data: fail };

export const Saving25 = Template.bind({});
Saving25.args = { data: saving25 };

export const Saving50 = Template.bind({});
Saving50.args = { data: saving50 };

export const Saving75 = Template.bind({});
Saving75.args = { data: saving75 };

export const Saving99 = Template.bind({});
Saving99.args = { data: saving99 };

export const SuccessCheer = Template.bind({});
SuccessCheer.args = { data: successCheer };

export const SuccessFlower = Template.bind({});
SuccessFlower.args = { data: successFlower };

export const SuccessLove = Template.bind({});
SuccessLove.args = { data: successLove };

export const SuccessMusic = Template.bind({});
SuccessMusic.args = { data: successMusic };
