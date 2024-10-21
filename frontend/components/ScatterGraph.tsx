/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Papa from 'papaparse';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Data {
  [key: string]: string | number;
}

export default function ScatterGraph() {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [xLabel, setXLabel] = React.useState<string>('');
  const [yLabel, setYLabel] = React.useState<string>('');
  const [columns, setColumns] = React.useState<string[]>([]);
  const [graphData, setGraphData] = React.useState<any>(null);

  React.useEffect(() => {
    // Load and parse the CSV
    Papa.parse("test_databases/cai_list_202401.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data as Data[];
        setRows(data);

        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          setColumns(headers);
        }
      },
    });
  }, []);

  const handleGenerateGraph = () => {
    if (!xLabel || !yLabel) return;

    const parsedData = rows.map((row) => ({
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
