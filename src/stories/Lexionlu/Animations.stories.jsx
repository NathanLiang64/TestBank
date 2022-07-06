import fail from 'assets/animations/fail.svg';
import saving25 from 'assets/animations/saving25.svg';
import saving50 from 'assets/animations/saving50.svg';
import saving75 from 'assets/animations/saving75.svg';
import saving99 from 'assets/animations/saving99.svg';
import successCheer from 'assets/animations/successCheer.svg';
import successFlower from 'assets/animations/successFlower.svg';
import successLove from 'assets/animations/successLove.svg';
import successMusic from 'assets/animations/successMusic.svg';

export default {
  title: 'lexionlu/Animations',
};

const Template = (args) => {
  const { animation } = args;
  return (
    <img src={animation} style={{ objectFit: 'contain' }} alt="" width="124" height="120" />
  );
};

export const Fail = Template.bind({});
Fail.args = {
  animation: fail,
};

export const Saving25 = Template.bind({});
Saving25.args = {
  animation: saving25,
};

export const Saving50 = Template.bind({});
Saving50.args = {
  animation: saving50,
};

export const Saving75 = Template.bind({});
Saving75.args = {
  animation: saving75,
};

export const Saving99 = Template.bind({});
Saving99.args = {
  animation: saving99,
};

export const SuccessCheer = Template.bind({});
SuccessCheer.args = {
  animation: successCheer,
};

export const SuccessFlower = Template.bind({});
SuccessFlower.args = {
  animation: successFlower,
};

export const SuccessLove = Template.bind({});
SuccessLove.args = {
  animation: successLove,
};

export const SuccessMusic = Template.bind({});
SuccessMusic.args = {
  animation: successMusic,
};
