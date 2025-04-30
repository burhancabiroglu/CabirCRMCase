import type { UpdateUserRequest } from 'src/models';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import { Box, Card, Stack, Button, TextField, Typography } from '@mui/material';

import { useAuth } from 'src/hooks/use-auth';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function ProfileView() {
  const { user, updateProfile } = useAuth();

  const { control, handleSubmit, reset, formState } = useForm<UpdateUserRequest>({
    defaultValues: {
      email: '',
      username: '',
      role: 'Standard',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        username: user.username,
        role: user.role,
      });
    }
  }, [user, reset]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateUserRequest) => {
    setLoading(true);
    try {
      await updateProfile(user?.id ?? '', data);
      reset(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

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
          Profile
        </Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <TextField {...field} label="Email" fullWidth disabled />}
            />
            <Controller
              name="username"
              control={control}
              render={({ field }) => <TextField {...field} label="Username" fullWidth />}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Role" select fullWidth>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Standard">Standard</MenuItem>
                </TextField>
              )}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                disabled={!formState.isDirty || loading}
                onClick={() => reset()}
              >
                Discard
              </Button>
              <Button type="submit" variant="contained" disabled={!formState.isDirty || loading}>
                Save
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
