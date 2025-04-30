import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CustomerTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onFilter: () => void;
  hasActiveFilter?: boolean;
  onClearFilters?: () => void;
};

export function CustomerTableToolbar({ numSelected, filterName, onFilterName, onDelete, onFilter, hasActiveFilter, onClearFilters }: CustomerTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
          <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 2 }}>
            {hasActiveFilter && (
              <Chip
                label="Clear filters"
                onDelete={onClearFilters}
                variant="filled"
                color="primary"
                size="small"
              />
            )}
            <Tooltip title="Filter list">
              <IconButton onClick={onFilter}>
                <Iconify icon="ic:round-filter-list" />
              </IconButton>
            </Tooltip>
          </Stack>
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
}
