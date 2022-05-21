import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import FEIBDatePicker from 'components/elements/FEIBDatePicker';

export default {
  title: 'elements/FEIBDatePicker',
  component: FEIBDatePicker,
  decorators: [
    (Story) => (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Story />
      </MuiPickersUtilsProvider>
    ),
  ],
  argTypes: {
    value: { control: 'date' },
  },
};

const Template = (args) => {
  const { value } = args;
  (
    <FEIBDatePicker value={value} />
  );
};

export const Primary = Template.bind({});
