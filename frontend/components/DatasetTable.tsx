import { useEffect, useState } from "react";
import { Dataset, columns } from "./Columns"
import { DataTable } from "./DataTable"
import { data } from "@/utils/data";

interface DatasetTableProps {
  organization: string | null
  groups: string[];
  tags: string[];
}

export const DatasetTable = ({ organization, groups, tags }: DatasetTableProps) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    const axiosHandler = async () => {
      const response = await data.getDatasets(organization ?? "", groups, tags);
      console.log("Response data:", response.data.results); // Check the data structure
      const filteredDatasets = response.data.results;
      setDatasets(filteredDatasets);
    };
    axiosHandler();
  }, [organization, groups, tags]);
  

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} tableData={datasets} />
    </div>
  )
}

export default DatasetTable;