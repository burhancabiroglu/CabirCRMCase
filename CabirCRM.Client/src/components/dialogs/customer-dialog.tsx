import type { Customer} from 'src/models';

import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Stack,
  Alert,
  Dialog,
  Button,
  Select,
  Snackbar,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
} from '@mui/material';

import { useCustomers } from 'src/hooks/use-customers';

import { RegionOptions } from 'src/models';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  region: yup.string().required('Region is required'),
});

type NewCustomerFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  region: string;
};

export function CustomerDialog({
  open,
  onClose,
  customerToEdit,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customerToEdit?: Customer | null;
}) {
  const { createCustomer, updateCustomer } = useCustomers();

  const { control, handleSubmit, reset, setValue } = useForm<NewCustomerFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      region: '',
    },
  });

  useEffect(() => {
    if (customerToEdit) {
      setValue('firstName', customerToEdit.firstName);
      setValue('lastName', customerToEdit.lastName);
      setValue('email', customerToEdit.email);
      setValue('region', customerToEdit.region);
    } else {
      reset();
    }
  }, [customerToEdit, reset, setValue]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: NewCustomerFormValues) => {
    try {
      setLoading(true);
      setError(null);

      if (customerToEdit) {
        await updateCustomer(customerToEdit.id, data);
      } else {
        await createCustomer(data);
      }

      setSuccess(true);
      reset();
      onClose();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{customerToEdit ? 'Update Customer' : 'New Customer'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="First Name"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="region"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    fullWidth
                    error={!!fieldState.error}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Region</em>
                    </MenuItem>
                    {RegionOptions.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                  )}
                </>
              )}
            />
          </Stack>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={loading}>
            {customerToEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ width: '100%' }}>
          Customer created successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
