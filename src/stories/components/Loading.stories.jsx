import Loading from 'components/Loading';

import presetColors from '../presetColors';

export default {
  title: 'components/Loading',
  component: Loading,
  argTypes: {
    space: { control: 'select', options: ['top', 'bottom', 'both'] },
    color: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'text']) }},
    isFullscreen: { control: 'boolean' },
    isCentered: { control: 'boolean' },
  },
};

const Template = (args) => (
  <Loading {...args} />
);

export const Primary = Template.bind({});
