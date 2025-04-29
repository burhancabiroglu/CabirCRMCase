import type { Customer } from 'src/models';

import React, { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useCustomers } from 'src/hooks/use-customers';

import { useTable } from 'src/hooks';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomerDialog } from 'src/components/dialogs/customer-dialog';
import { emptyRows, TableNoData, getComparator, TableEmptyRows } from 'src/components/table';

import { applyFilter } from '../customer-filter';
import { CustomerTableRow } from '../customer-table-row';
import { CustomerTableHead } from '../customer-table-head';
import { CustomerTableToolbar } from '../customer-table-toolbar';

// ----------------------------------------------------------------------

export function CustomersView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleOpenNew = () => {
    setEditingCustomer(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingCustomer(null);
    fetchCustomers().then((r) => {});
  }, []);

  const paginationParams = useMemo(
    () => ({ pageNumber: table.page, pageSize: table.rowsPerPage }),
    [table.page, table.rowsPerPage]
  );

  const { data: customers = [], fetchCustomers } = useCustomers(paginationParams);

  const dataFiltered: Customer[] = applyFilter({
    inputData: customers,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Customers
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenNew}
        >
          New Customer
        </Button>
      </Box>

      <Card>
        <CustomerTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomerTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={customers.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    customers.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'region', label: 'Region' },
                  { id: 'registrationDate', label: 'Registration Date' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <CustomerTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, customers.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={customers.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <CustomerDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSuccess={handleCloseDialog}
        customerToEdit={editingCustomer}
      />
    </DashboardContent>
  );
}
