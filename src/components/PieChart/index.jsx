/* eslint no-underscore-dangle: ["error", {"allow": ["_data"] }] */

import { useRef, useEffect } from 'react';
import { Chart, ArcElement, DoughnutController } from 'chart.js';
import { accountOverviewCardVarient, currencySymbolGenerator } from 'utilities/Generator';
import Theme from 'themes/theme';

import PieChartWrapper from './PieChart.style';

Chart.register(ArcElement, DoughnutController);

/*
* ==================== PieChart 組件說明 ====================
* 圓餅圖組件
* ==================== PieChart 可傳參數 ====================
* 1. data -> API回傳之格式。
* 2. label -> 圓餅圖標題。
* 3. dollarSign -> 資產貨幣。
* 4. width -> 圓餅圖圖寬。
* 5. height -> 圓餅圖圖高。
* 6. isCentered -> 將圓餅圖至中。
* */

const PieChart = ({
  data, label = '正資產', dollarSign = 'NTD', width = 210, height = 210, isCentered = false, space,
}) => {
  const ctx = useRef();

  const _data = {
    labels: data.map((d) => d.alias ?? accountOverviewCardVarient(d.type).name),
    datasets: [{
      label,
      data: data.map((d) => Math.abs(d.balance)),
      backgroundColor: data.map((d) => Theme.colors.card[accountOverviewCardVarient(d.type).color]),
      cutout: '94%',
      borderWidth: 0,
    }],
  };

  const totalBalance = data.reduce((prev, current) => prev + Math.abs(current.balance), 0);

  useEffect(() => {
    // eslint-disable-next-line
    const chart = new Chart(ctx.current, {
      type: 'doughnut',
      data: _data,
      options: {
        responsive: false,
        animation: false,
      },
    });
  }, []);

  return (
    <PieChartWrapper $isCentered={isCentered} $space={space}>
      <canvas width={width} height={height} ref={ctx} />
      <div className="group">
        <div className="label">
          {label}
          總額
        </div>
        <div className="balance">{`${currencySymbolGenerator(dollarSign, totalBalance)}`}</div>
      </div>
    </PieChartWrapper>
  );
};

export default PieChart;
