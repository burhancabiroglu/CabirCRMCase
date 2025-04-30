import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Stack,
  Dialog,
  Button,
  MenuItem,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { RegionOptions } from 'src/models';


type CustomerFilterDialogProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: { region: string | null; registrationDate: Date | null }) => void;
  initialRegion?: string | null;
  initialDate?: Date | null;
};

export function CustomerFilterDialog({
  open,
  onClose,
  onApply,
  initialRegion = null,
  initialDate = null,
}: CustomerFilterDialogProps) {
  const [region, setRegion] = useState<string | null>(initialRegion ?? null);
  const [registrationDate, setRegistrationDate] = useState<Dayjs | null>(
    initialDate ? dayjs(initialDate) : null
  );

  const handleApply = () => {
    onApply({ region, registrationDate: registrationDate?.toDate() ?? null });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Filter Customers</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1.5 }}>
          <TextField
            select
            fullWidth
            label="Region"
            value={region ?? ''}
            onChange={(e) => setRegion(e.target.value || null)}
          >
            {RegionOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <div>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
              This will filter customers registered before the selected date
            </Typography>
            <DatePicker
              label="Registration Date"
              value={registrationDate}
              onChange={(newValue: any) => setRegistrationDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleApply}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
