import * as Icons from 'assets/images/icons';

import presetColors from './presetColors';

export default {
  title: 'assets/Icons',
  argTypes: {
    color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    size: { control: { type: 'number', min: 16, max: 48 }},
  },
};

const IconArray = [];

for (const icon in Icons) {
  if ({}.hasOwnProperty.call(Icons, icon)) {
    IconArray.push([icon, Icons[icon]]);
  }
}

const Template = (args) => (
  <>
    <p style={{
      padding: 12, backgroundColor: 'black', marginBottom: 48, borderRadius: 10, color: 'white', fontSize: '10pt',
    }}
    >
      {/* 使用範例 */}
      <br />
      {'import { BlockSelectedIcon } from \'assets/images/icons\';'}
      <br />
      {'<BlockSelectedIcon color="..." size="..." />'}
    </p>
    <div style={{
      display: 'flex', flexWrap: 'wrap', rowGap: 48, columnGap: 24, paddingBlock: 32,
    }}
    >
      { IconArray.map((i) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: 28 + args.size,
            width: 118 + args.size,
            gap: 6,
          }}
        >
          <div style={{ height: args.size, width: args.size }}>
            {i[1]({...args})}
          </div>
          <div style={{ fontSize: '8pt', color: 'black' }}>{i[0]}</div>
        </div>
      )) }
    </div>
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  color: 'black',
  size: 32,
};
