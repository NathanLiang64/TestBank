import Accordion from '../components/Accordion';

export default {
  title: 'components/Accordion',
  components: Accordion,
  argTypes: {
    className: { control: 'text' },
    title: { control: 'text' },
    space: { control: 'select', options: ['top', 'bottom', 'both'] },
    children: { control: 'text' },
    open: { control: 'boolean' },
  },
};

const Template = (args) => (
  <Accordion {...args}>{args.children}</Accordion>
)

export const Primary = Template.bind({});
