import { useRef, useEffect } from 'react';
import { Chart, ArcElement, DoughnutController } from 'chart.js';

import PieChartWrapper from './PieChart.style';

Chart.register(ArcElement, DoughnutController);

const data = {
  labels: [
    'Red',
    'Blue',
    'Yellow',
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)',
    ],
    cutout: '95%',
    borderWidth: 0,
  }],
};

const PieChart = () => {
  const ctx = useRef();

  useEffect(() => {
    const chart = new Chart(ctx.current, {
      type: 'doughnut',
      data,
      options: {
        responsive: false,
      },
    });
  }, []);

  return (
    <PieChartWrapper>
      <canvas width="210" height="210" ref={ctx} />
    </PieChartWrapper>
  );
};

export default PieChart;
