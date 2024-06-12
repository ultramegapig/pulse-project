
import '../styles/barchart.scss'; // Import the CSS file
import React from 'react';

function BarChart({ data }) {
  return (
    <div>
      <h2>Bar Chart</h2>
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={index} className="bar" style={{ height: `${item.value}%` }}>
            <span className="bar-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarChart;

