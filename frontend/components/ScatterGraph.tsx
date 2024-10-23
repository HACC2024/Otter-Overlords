/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Data {
  [key: string]: string | number;
}

interface ScatterGraphProps {
  data: Data[]; // Parsed data
  columns: string[]; // Column headers
}

export default function ScatterGraph({ data, columns }: ScatterGraphProps) {
  const [xLabel, setXLabel] = React.useState<string>(''); // X axis label
  const [yLabel, setYLabel] = React.useState<string>(''); // Y axis label
  const [graphData, setGraphData] = React.useState<any>(null); // Scatter graph data

  const handleGenerateGraph = () => {
    if (!xLabel || !yLabel) return;

    const parsedData = data.map((row) => ({
      x: parseFloat(row[xLabel] as string),
      y: parseFloat(row[yLabel] as string),
    }));

    const scatterData = {
      datasets: [{
        label: `Scatter plot of ${xLabel} vs ${yLabel}`,
        data: parsedData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    };

    setGraphData(scatterData);
  };

  return (
    <div>
      <h1>Scatter Graph</h1>
      
      {/* Dropdowns to select X and Y columns */}
      <div>
        <label htmlFor="x-label">Select X Axis:</label>
        <select id="x-label" value={xLabel} onChange={(e) => setXLabel(e.target.value)}>
          <option value="">Select X</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        <label htmlFor="y-label">Select Y Axis:</label>
        <select id="y-label" value={yLabel} onChange={(e) => setYLabel(e.target.value)}>
          <option value="">Select Y</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        <button onClick={handleGenerateGraph}>Generate Graph</button>
      </div>

      {/* Render Scatter Graph */}
      {graphData && (
        <div style={{ width: '600px', height: '400px', marginTop: '20px' }}>
          <Scatter data={graphData} options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: xLabel
                }
              },
              y: {
                title: {
                  display: true,
                  text: yLabel
                }
              }
            }
          }} />
        </div>
      )}
    </div>
  );
}
