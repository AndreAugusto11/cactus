import React, { useEffect, useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

const assetRefs = [
  {
    id: "c5dfbd04-a71b-4848-92d1-78cd1fafaaf1",
    amount: 500,
    owner: "Alice"
  },
  {
    id: "889242f8-58ae-449e-b938-fa28fdca65b6",
    amount: 500,
    owner: "Charlie"
  },
  {
    id: "d25fbcbb-0895-4905-b8d5-502d5e83b122",
    amount: 1000,
    owner: "Alice"
  },
]

export default function BridgeOutDialog(props) {
  const [assetRefID, setAssetRefID] = useState("");

  useEffect(() => {
    if (props.open) {
      setAssetRefID("");
    }
  }, [props.open]);

  const handleChangeAssetRefID = (event) => {
    setAssetRefID(event.target.value);
  }

  return (
    <Dialog
      open={props.open}
      keepMounted
      onClose={props.onClose}
    >
      <DialogTitle>{"Bridge Out CBDC"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the {props.user}'s Asset Reference that represents the amount to bridge out.
        </DialogContentText>
        <Select
          fullWidth
          name="assetRefID"
          value={assetRefID}
          label="Asset Reference ID"
          variant="outlined"
          defaultValue={assetRefID}
          onChange={handleChangeAssetRefID}
        >
          {
            assetRefs.map(asset => 
              asset.owner === props.user && <MenuItem key={asset.id} value={asset.id}>{asset.id}</MenuItem>
            )
          }
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onClose}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
