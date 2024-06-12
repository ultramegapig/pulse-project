import '../styles/barchart.scss'; // Import the CSS file
import React from 'react';

const chartData = [
  { label: 'Mon', value: 50 }, 
  { label: 'Tue', value: 75 },
  { label: 'Wed', value: 100 },
  { label: 'Thu', value: 25 },
  { label: 'Fri', value: 60 },
  { label: 'Sat', value: 90 },
  { label: 'Sun', value: 40 }
];
const currentDate = new Date();

function BarChart() {
  return (
    <div className="changeHeight">
    
      <div className="bar-chart">
        {chartData.map((item, index) => {
          const barDate = new Date(currentDate);
          barDate.setDate(currentDate.getDate() + index);

          return (
            <div key={index} className={`bar ${item.label === currentDate.toLocaleDateString('en-US', { weekday: 'short' }) ? 'current-day' : ''}`} style={{ height: `${item.value}%` }}>
              <div className="underbar-info">
                <div> 
                  <span className="bar-label">{item.label}</span>
                  <span className="bar-value">{barDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BarChart;
