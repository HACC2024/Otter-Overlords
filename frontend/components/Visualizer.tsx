"use client";
import { useState } from 'react'; // Import useState to handle component selection
import styles from '../app/visualizer.module.css';
import Table from './Table'; // Import Table component
import ScatterGraph from '@/components/ScatterGraph'; // Import ScatterGraph component
import PieChart from '@/components/PieChart'; // Import PieChart component

export default function Home() {
    const [selectedComponent, setSelectedComponent] = useState<string>('table'); // Default state to 'table'

    const handleComponentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedComponent(event.target.value); // Update state when the user selects a new component
    };

    return (
        <div className={styles.page}>
            {/* Dropdown to select between Table, ScatterGraph, and PieChart */}
            <div className={styles.selectContainer}>
                <label htmlFor="componentSelect">Choose Component: </label>
                <select
                    id="componentSelect"
                    value={selectedComponent}
                    onChange={handleComponentChange}
                >
                    <option value="table">Table</option> {/* Option for Table */}
                    <option value="scattergraph">ScatterGraph</option> {/* Option for ScatterGraph */}
                    <option value="piechart">PieChart</option> {/* Option for PieChart */}
                </select>
            </div>

            {/* Conditionally render components based on selectedComponent */}
            <div className={styles.visualizerContainer}>
                {selectedComponent === 'table' && <Table />} {/* Render Table */}
                {selectedComponent === 'scattergraph' && <ScatterGraph />} {/* Render ScatterGraph */}
                {selectedComponent === 'piechart' && <PieChart />} {/* Render PieChart */}
            </div>
        </div>
    );
}
