import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from "@material-ui/core/styles";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Alert from "@material-ui/lab/Alert";
import { escrowTokensFabric } from '../../remote-calls/fabric-api-calls';
import { escrowTokensBesu } from '../../remote-calls/besu-api-calls';

const useStyles = makeStyles((theme) => ({
  errorMessage: {
    marginTop: "0.5rem",
  },
  amountField: {
    margin: "1rem 0"
  }
}));

export default function EscrowDialog(props) {
  const classes = useStyles();
  const [assetRefID, setAssetRefID] = useState("");
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (props.open) {
      setSending(false);
      setAssetRefID(uuidv4());
      setAmount(0);
    }
  }, [props.open]);

  const handleChangeAmount = (event) => {
    const value = event.target.value;

    if (value < 0) {
      setErrorMessage("Amount must be a positive value")
      setAmount(0);
    } else {
      setErrorMessage("")
      setAmount(value);
    }
  };

  const performEscrowTransaction = async () => {
    if (parseInt(amount) === 0) {
      setErrorMessage("Amount must be a positive value");
    } else {
      setSending(true);
      if (props.ledger === "Fabric") {
        await escrowTokensFabric(props.user, amount.toString(), assetRefID);
      } else {
        await escrowTokensBesu(props.user, amount, assetRefID);
      }

      props.onClose();
    }
  }

  return (
    <Dialog
      open={props.open}
      keepMounted
      onClose={props.onClose}
    >
      <DialogTitle>{"Escrow CBDC"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the recipient of the CBDC and how many you would like to transfer from {props.user}'s address?
        </DialogContentText>
        <TextField
          fullWidth
          disabled
          id="assetRef"
          name="assetRef"
          value={assetRefID}
          label="Asset Reference ID"
          placeholder="Asset Reference ID"
          variant="outlined"
          className={classes.amountField}
        />
        <TextField
          required
          fullWidth
          autoFocus
          id="amount"
          name="amount"
          value={amount}
          label="Amount"
          type="number"
          placeholder="Amount"
          variant="outlined"
          onChange={handleChangeAmount}
          className={classes.amountField}
        />
        {errorMessage !== "" &&
          <Alert severity="error" className={classes.errorMessage}>{errorMessage}</Alert>
        }
      </DialogContent>
      <DialogActions>
        {
          sending ?
          <Button disabled>Sending...</Button> :
          <div>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={performEscrowTransaction}>Confirm</Button>
          </div> 
        }
      </DialogActions>
    </Dialog>
  );
}
