import FEIBCollapse from 'components/elements/FEIBCollapse';

export default {
  title: 'elements/FEIBCollapse',
  component: FEIBCollapse,
  argTypes: {
    isCollapsed: { control: 'boolean' },
    size: { control: { type: 'number' }},
  },
};

const Template = (args) => (
  <FEIBCollapse
    in={!args.isCollapsed}
    collapsedSize={args.size}
  >
    <div
      style={{ width: 100, height: 100, backgroundColor: 'red' }}
    >
      TEST
    </div>
  </FEIBCollapse>
);

export const Primary = Template.bind({});
Primary.args = {
  isCollapsed: false,
};
