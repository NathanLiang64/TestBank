import FEIBTabContext from 'components/elements/FEIBTabContext';
import FEIBTabList from 'components/elements/FEIBTabList';
import FEIBTab from 'components/elements/FEIBTab';

export default {
  title: 'elements/FEIBTab',
  component: FEIBTabContext,
  subcomponents: [FEIBTabList, FEIBTab],
  argTypes: {
    value: { control: 'number' },
    label: { control: 'text' },
    $size: { control: 'text' },
    $type: { control: 'text' },
    onChange: { action: 'onChange' },
  },
};

const Template = ({
  value, label, $size, $type, onChange,
}) => (
  <FEIBTabContext value={value}>
    <FEIBTabList $size={$size} $type={$type} onChange={onChange}>
      <FEIBTab label={label} value={0} />
      <FEIBTab label={label} value={1} />
      <FEIBTab label={label} value={2} />
      <FEIBTab label={label} value={3} />
      <FEIBTab label={label} value={4} />
    </FEIBTabList>
  </FEIBTabContext>
);

export const Primary = Template.bind({});
Primary.args = {
  value: 0,
  label: 'label',
  $size: 'small',
  $type: 'fixed',
};
