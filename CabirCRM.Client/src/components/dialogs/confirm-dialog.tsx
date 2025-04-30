import {
  Stack,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  content,
  onClose,
  onConfirm,
  confirmText = 'Yes',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end" width="100%">
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            {confirmText}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
