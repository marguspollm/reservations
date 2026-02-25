import { Alert, Snackbar } from "@mui/material";

type SuccessNotifiyProps = {
  error?: string | null;
  message: string | null;
  closeSuccess?: () => void;
  closeError?: () => void;
};

function Notifiy({
  error,
  message,
  closeSuccess,
  closeError,
}: SuccessNotifiyProps) {
  const handleClose = () => {
    if (error && closeError) closeError();
    else if (closeSuccess) closeSuccess();
  };

  return (
    <Snackbar
      open={!!message || !!error}
      autoHideDuration={7000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={error ? "error" : "success"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message || error}
      </Alert>
    </Snackbar>
  );
}

export default Notifiy;
