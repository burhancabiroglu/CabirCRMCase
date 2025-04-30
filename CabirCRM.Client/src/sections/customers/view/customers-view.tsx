import type { Customer } from 'src/models';

import React, { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useCustomers } from 'src/hooks/use-customers';

import { useTable } from 'src/hooks';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog , CustomerDialog } from 'src/components/dialogs';
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<string[] | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingCustomer(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingCustomer(null);
    fetchCustomers().then(() => {});
  }, []);

  const handleEditRow = (customer: Customer) => {
    setEditingCustomer(customer);
    setOpenDialog(true);
  };

  const handleDeleteRow = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteSelectedRows = () => {
    if (table.selected.length > 0) {
      setConfirmDeleteIds(table.selected);
    }
  };

  const paginationParams = useMemo(
    () => ({ pageNumber: table.page, pageSize: table.rowsPerPage }),
    [table.page, table.rowsPerPage]
  );

  const { data: customers, fetchCustomers, deleteCustomer } = useCustomers(paginationParams);

  const dataFiltered: Customer[] = applyFilter({
    inputData: customers.data,
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
          onDelete={handleDeleteSelectedRows}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomerTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={customers.data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    customers.data.map((user) => user.id)
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
                  .map((row) => (
                    <CustomerTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => handleEditRow(row)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, customers.data.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={customers.totalCount}
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

      <ConfirmDialog
        open={!!confirmDeleteId}
        content="Are you sure you want to delete this customer?"
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (confirmDeleteId) {
            try {
              await deleteCustomer(confirmDeleteId);
              setConfirmDeleteId(null);
              fetchCustomers();
              setDeleteSuccess(true);
            } catch (error: any) {
              setDeleteError(error?.response?.data?.message || 'Failed to delete customer');
            }
          }
        }}
      />

      <ConfirmDialog
        open={!!confirmDeleteIds}
        content="Are you sure you want to delete selected customers?"
        onClose={() => setConfirmDeleteIds(null)}
        onConfirm={async () => {
          if (confirmDeleteIds?.length) {
            try {
              for (const id of confirmDeleteIds) {
                await deleteCustomer(id);
              }
              await fetchCustomers();
              table.onSelectAllRows(false, []);
              setConfirmDeleteIds(null);
              setDeleteSuccess(true);
            } catch (error: any) {
              setDeleteError(error?.response?.data?.message || 'Failed to delete selected customers');
            }
          }
        }}
      />

      <Snackbar
        open={deleteSuccess}
        autoHideDuration={4000}
        onClose={() => setDeleteSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ maxWidth: 320 }}
      >
        <Alert
          onClose={() => setDeleteSuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            typography: 'body2',
            bgcolor: 'success.lighter',
            color: 'success.darker',
            boxShadow: 0,
            borderRadius: 1,
            alignItems: 'center',
          }}
        >
          Customer deleted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!deleteError}
        autoHideDuration={4000}
        onClose={() => setDeleteError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ maxWidth: 320 }}
      >
        <Alert
          onClose={() => setDeleteError(null)}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            typography: 'body2',
            bgcolor: 'error.lighter',
            color: 'error.darker',
            boxShadow: 0,
            borderRadius: 1,
            alignItems: 'center',
          }}
        >
          {deleteError}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
