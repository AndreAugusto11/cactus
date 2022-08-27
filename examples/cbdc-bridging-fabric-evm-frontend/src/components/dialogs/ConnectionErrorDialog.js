import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Alert from "@material-ui/lab/Alert";

export default function ConnectionErrorDialog(props) {
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }

    props.close();
}

  return (
    <Dialog
      open={props.open}
      keepMounted
      disableEscapeKeyDown
      onClose={handleClose}
    >
      <DialogTitle>{"API Servers Connection Error"}</DialogTitle>
      <DialogContent>
        <Alert severity="error">Please check the connection with the API Servers and refresh the page.</Alert>
      </DialogContent>
    </Dialog>
  );
}
