import React, { useEffect, useState } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Alert from "@material-ui/lab/Alert";
import {
  bridgeBackTokensBesu,
  getAssetReferencesBesu,
} from "../../api-calls/besu-api";

export default function BridgeBackDialog(props) {
  const [assetRefs, setAssetRefs] = useState([]);
  const [assetRefID, setAssetRefID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const list = await getAssetReferencesBesu(props.user);
      setAssetRefs(list.filter((asset) => asset.recipient === props.user));
    }

    if (props.open) {
      setSending(false);
      setAssetRefID("");
      fetchData();
    }
  }, [props.open, props.user]);

  const handleChangeAssetRefID = (event) => {
    setAssetRefID(event.target.value);
  };

  const performBridgeBackTransaction = async () => {
    if (assetRefID === "") {
      setErrorMessage("Please choose a valid Asset Reference ID");
    } else {
      setSending(true);
      const amount = assetRefs.find((asset) => asset.id === assetRefID)
        .numberTokens;
      await bridgeBackTokensBesu(props.user, amount, assetRefID);
      props.onClose();
    }
  };

  return (
    <Dialog open={props.open} keepMounted onClose={props.onClose}>
      <DialogTitle>{"Bridge Back CBDC"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the {props.user}"s Asset Reference that represents the amount
          to bridge back.
        </DialogContentText>
        {assetRefs.length === 0 ? (
          <Alert severity="error">
            Must escrow tokens before trying to bridge back CBDC.
          </Alert>
        ) : (
          <Select
            fullWidth
            name="assetRefID"
            value={assetRefID}
            variant="outlined"
            defaultValue={assetRefID}
            onChange={handleChangeAssetRefID}
          >
            {assetRefs.map((asset) => (
              <MenuItem key={asset.id} value={asset.id}>
                {asset.id}
              </MenuItem>
            ))}
          </Select>
        )}
        {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
      </DialogContent>
      <DialogActions>
        {sending ? (
          <Button disabled>Sending...</Button>
        ) : (
          <div>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={performBridgeBackTransaction}>Confirm</Button>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
}
