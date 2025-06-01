import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ToastProps {
  open: boolean;
  message?: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
}

export default function Toast({ open, onClose, message, severity}: ToastProps) {
  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
        <Alert
          onClose={onClose}
          severity={severity || "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message || "Operation successful!"}
        </Alert>
      </Snackbar>
    </>
  );
}
