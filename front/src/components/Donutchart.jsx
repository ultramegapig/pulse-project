import React, { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import '../styles/donutchart.scss'; 

Chart.register(ArcElement);

const DonutChartPercentPlugin = {
  id: 'donutChartPercentPlugin',
  beforeDraw: function(chart) {
    if (!chart.chart) return; // Ensure chart object exists

    const width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;

    ctx.restore();
    const fontSize = (height / 100).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    const text = chart.data.datasets[0].data[0] + "%",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};

Chart.register(DonutChartPercentPlugin);

function DonutChart({ successPercentage }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current?.chartInstance;

    // Ensure proper cleanup when unmounting
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  const data = {
    labels: ['Successful', 'Failed'],
    datasets: [{
      data: [successPercentage, 100 - successPercentage],
      backgroundColor: [
        'white', // Green color for successful results
        'rgba(255,255,255, 0.3)', // Red color for failed results
      ],
      
      cutout: '75%', // Adjust the width of the colored segments as needed
      borderWidth: 0
    }]
  };

  return (
    <div className="donut-chart-container">
      <h2 className="donut-chart-title">{successPercentage}%</h2>
      <Doughnut data={data} ref={chartRef} />
    </div>
  );
}

export default DonutChart;