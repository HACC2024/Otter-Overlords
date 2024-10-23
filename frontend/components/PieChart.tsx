import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Data {
  [key: string]: string | number;
}

interface PieChartProps {
  data: Data[]; // The parsed data
  columns: string[]; // The columns from the parsed data
}

export default function PieChart({ data, columns }: PieChartProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>(''); // State for selected category
  const [chartData, setChartData] = React.useState<ChartData<'pie', number[], string> | null>(null); // State for chart data

  const handleGeneratePieChart = () => {
    if (!selectedCategory) return;

    const counts: { [key: string]: number } = {};

    // Count occurrences of each value in the selected category
    data.forEach((row) => {
      const value = row[selectedCategory] as string;
      counts[value] = (counts[value] || 0) + 1;
    });

    // Generate labels and data for the pie chart
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    const pieData: ChartData<'pie', number[], string> = {
      labels: labels,
      datasets: [{
        label: `Pie chart of ${selectedCategory}`,
        data: values,
        backgroundColor: labels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
      }]
    };

    setChartData(pieData);
  };

  return (
    <div>
      <h1>Pie Chart</h1>

      {/* Dropdown to select category */}
      <div>
        <label htmlFor="category-select">Select Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a Category</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        <button onClick={handleGeneratePieChart}>Generate Pie Chart</button>
      </div>

      {/* Render Pie Chart */}
      {chartData && (
        <div style={{ width: '600px', height: '400px', marginTop: '20px' }}>
          <Pie data={chartData} />
        </div>
      )}
    </div>
  );
}
