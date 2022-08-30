import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles(() => ({
  alert: {
    marginBottom: "1rem",
  },
}));

export default function ConnectionErrorDialog(props) {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }

    props.close();
  };

  return (
    <Dialog
      open={props.open}
      keepMounted
      disableEscapeKeyDown
      onClose={handleClose}
    >
      <DialogTitle>{"API Servers Connection Error"}</DialogTitle>
      <DialogContent>
        <Alert severity="error" className={classes.alert}>
          Please check the connection with the API Servers and refresh the page.
        </Alert>
      </DialogContent>
    </Dialog>
  );
}
