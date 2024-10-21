import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Papa from 'papaparse';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import TableSortLabel from '@mui/material/TableSortLabel';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

interface Data {
  [key: string]: string | number;
}

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [columns, setColumns] = React.useState<Column[]>([]);
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(new Set());
  const [showColumnToggles, setShowColumnToggles] = React.useState(false);

  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<string | null>(null); // Track which column is sorted

  React.useEffect(() => {
    Papa.parse("test_databases/cai_list_202401.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data as Data[];
        setRows(data);

        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          const newColumns = headers.map((header) => ({
            id: header,
            label: header,
            minWidth: 170,
          }));
          setColumns(newColumns);
          setVisibleColumns(new Set(headers));
        }
      },
    });
  }, []);

  const handleRequestSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleSort = (rows: Data[], comparator: (a: Data, b: Data) => number) => {
    return rows.sort(comparator);
  };

  const comparator = (a: Data, b: Data) => {
    if (!orderBy) return 0;

    const valueA = a[orderBy];
    const valueB = b[orderBy];

    if (valueA < valueB) {
      return order === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggleColumn = (columnId: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const handleToggleDropdown = () => {
    setShowColumnToggles((prev) => !prev);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) =>
                visibleColumns.has(column.id) ? (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ) : null
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {handleSort(rows, comparator)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) =>
                      visibleColumns.has(column.id) ? (
                        <TableCell key={column.id} align={column.align}>
                          {typeof row[column.id] === 'number' && column.format
                            ? column.format(row[column.id] as number)
                            : row[column.id]}
                        </TableCell>
                      ) : null
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div style={{ padding: '16px' }}>
        <Button onClick={handleToggleDropdown}>
          Toggle Column Headers
        </Button>
        <Collapse in={showColumnToggles}>
          <div style={{ marginTop: '8px' }}>
            {columns.map((column) => (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    checked={visibleColumns.has(column.id)}
                    onChange={() => handleToggleColumn(column.id)}
                  />
                }
                label={column.label}
              />
            ))}
          </div>
        </Collapse>
      </div>
    </Paper>
  );
}
