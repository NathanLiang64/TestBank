import * as Icons from 'assets/images/icons';

export default {
  title: 'assets/Icons',
};

const IconArray = [];

for (let icon in Icons) {
  IconArray.push([icon, Icons[icon]]);
};

const Template = () => (
  <>
    <p style={{ padding: 12, backgroundColor: 'black', marginBottom: 48, borderRadius: 10, color: 'white', fontSize: '10pt' }}>
      // 使用範例
      <br />
      import &#123; BlockSelectedIcon &#125; from 'assets/images/icons';
      <br />
      &lt;BlockSelectedIcon /&gt;
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 48, columnGap: 24, paddingBlock: 32 }}>
      { IconArray.map((i) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: 60,
            width: 150,
            gap: 6,
          }}
        >
          <div style={{ height: 32, width: 32 }}>
            {i[1]({ size: 32, color: 'black' })}
          </div>
          <div style={{ fontSize: '8pt', color: 'black' }}>{i[0]}</div>
        </div>
      )) }
    </div>
  </>
);

export const Primary = Template.bind({});
