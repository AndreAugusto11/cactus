import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  buttonTransfer: {
    margin: "auto",
    width: "105px",
    textTransform: "none",
    background: "#2B9BF6",
    color: "#FFFFFF",
    border: "0.5px solid #000000",
    "&:hover": {
      backgroundColor: "#444444",
      color: "#FFFFFF"
    },
  },
  buttonMint: {
    margin: "auto",
    width: "105px",
    textTransform: "none",
    background: "#2B9BF6",
    color: "#FFFFFF",
    border: "0.5px solid #000000",
    "&:hover": {
      backgroundColor: "#444444",
      color: "#FFFFFF"
    },
  },
  buttonEscrow: {
    margin: "auto",
    width: "105px",
    textTransform: "none",
    background: "#FF584B",
    color: "#FFFFFF",
    border: "0.5px solid #000000",
    "&:hover": {
      backgroundColor: "#444444",
      color: "#FFFFFF"
    },
  },
  buttonBridgeOut: {
    margin: "auto",
    width: "105px",
    textTransform: "none",
    background: "#FF584B",
    color: "#FFFFFF",
    border: "0.5px solid #000000",
    "&:hover": {
      backgroundColor: "#444444",
      color: "#FFFFFF"
    },
  },
  buttonTransferFullWidth: {
    margin: "auto",
    width: "100%",
    textTransform: "none",
    background: "#2B9BF6",
    color: "#FFFFFF",
    border: "0.5px solid #000000",
    "&:hover": {
      backgroundColor: "#444444",
      color: "#FFFFFF"
    },
  },
  buttonItem: {
    width: "105px",
    fontSize: "8px"
  },
  actionsContainer: {
    padding: "1rem",
    marginBottom: "1rem"
  },
  username: {
    textAlign: "left",
    fontSize: "15px",
    marginBottom: "1rem",
  },
  userAmount: {
    textAlign: "right",
    fontSize: "13px",
    marginBottom: "1rem",
  }
}));

export default function Ledger(props) {
  const classes = useStyles();

  useEffect(() => {
  });

  return (
    <Grid container spacing={1}>
      <Grid item lg={5} className={classes.username}>
        <span>{props.user}</span>
      </Grid>
      <Grid item lg={1} />
      <Grid item lg={6} className={classes.userAmount}>
        <span>500 CBDC</span>
      </Grid>

      {
        props.user === "Bridge" ?
        <Grid item md={12} lg={12}>
          <Button variant="contained" className={classes.buttonTransferFullWidth}>Transfer</Button>
        </Grid>
        : (
          props.ledger === "Besu" ?
          <Grid item md={12} lg={12}>
            <Button variant="contained" className={classes.buttonTransferFullWidth}>Transfer</Button>
          </Grid> :
          <Grid item md={12} lg={6}>
            <Button variant="contained" className={classes.buttonTransfer}>Transfer</Button>
          </Grid>
        )
      }
      {
        props.user !== "Bridge" && props.ledger !== "Besu" &&
        <Grid item md={12} lg={6} className={classes.buttonItem}>
          <Button variant="contained" className={classes.buttonMint}>Mint</Button>
        </Grid>
      }
      {
        props.user !== "Bridge" && 
      <Grid item md={12} lg={6} className={classes.buttonItem}>
        <Button variant="contained" className={classes.buttonEscrow}>Escrow</Button>
      </Grid>
      }
      {
        props.user !== "Bridge" && 
      <Grid item md={12} lg={6} className={classes.buttonItem}>
        <Button variant="contained" className={classes.buttonBridgeOut}>Bridge Out</Button>
      </Grid>
      }
    </Grid>
  );
}