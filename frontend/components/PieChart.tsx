import * as React from 'react';
import Papa from 'papaparse';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Data {
  [key: string]: string | number;
}

export default function PieChart() {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [columns, setColumns] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [chartData, setChartData] = React.useState<ChartData<'pie', number[], string> | null>(null);

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

  const handleGeneratePieChart = () => {
    if (!selectedCategory) return;

    const counts: { [key: string]: number } = {};

    // Count occurrences of each value in the selected category
    rows.forEach((row) => {
      const value = row[selectedCategory] as string;
      counts[value] = (counts[value] || 0) + 1;
    });

    // Generate labels and data for the pie chart
    const labels = Object.keys(counts);
    const data = Object.values(counts);

    const pieData: ChartData<'pie', number[], string> = {
      labels: labels,
      datasets: [{
        label: `Pie chart of ${selectedCategory}`,
        data: data,
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
