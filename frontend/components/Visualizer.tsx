import { useState, useEffect } from 'react';
import styles from '../app/visualizer.module.css';
import Table from './Table';
import ScatterGraph from '@/components/ScatterGraph';
import PieChart from '@/components/PieChart';
import Papa from 'papaparse';

interface Data {
  [key: string]: string | number;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
}

export default function Home() {
    const [selectedComponent, setSelectedComponent] = useState<string>('table');
    const [parsedData, setParsedData] = useState<Data[]>([]);
    const [columns, setColumns] = useState<Column[]>([]); // Columns should be of type Column[]
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleComponentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedComponent(event.target.value);
    };

    useEffect(() => {
        //Replace the link with a link to user selected CSV file
        Papa.parse("https://prod-histategis.opendata.arcgis.com/api/download/v1/items/9708f464f09e426781453ddf511e0be7/csv?layers=7", {
            download: true,
            header: true,
            complete: (result: { data: Data[]; }) => {
                const data = result.data as Data[];
                setParsedData(data);
                if (data.length > 0) {
                    // Map the string headers into the Column[] format expected by StickyHeadTable
                    const columnHeaders = Object.keys(data[0]);
                    const formattedColumns = columnHeaders.map((header) => ({
                        id: header,
                        label: header,
                        minWidth: 170,
                    }));
                    setColumns(formattedColumns);
                }
                setIsLoading(false);
            }
        });
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.selectContainer}>
                <label htmlFor="componentSelect">Visual: </label>
                <select id="componentSelect" value={selectedComponent} onChange={handleComponentChange}>
                    <option value="table">Table</option>
                    <option value="scattergraph">Scatter Graph</option>
                    <option value="piechart">Pie Chart</option>
                </select>
            </div>

            <div className={styles.visualizerContainer}>
                {isLoading ? (
                    <div>Loading data...</div>
                ) : (
                    <>
                        {selectedComponent === 'table' && <Table data={parsedData} columns={columns} />}
                        {selectedComponent === 'scattergraph' && <ScatterGraph data={parsedData} columns={columns.map(col => col.label)} />}
                        {selectedComponent === 'piechart' && <PieChart data={parsedData} columns={columns.map(col => col.id)} />}
                    </>
                )}
            </div>
        </div>
    );
}
