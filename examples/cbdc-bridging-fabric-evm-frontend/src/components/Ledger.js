import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AssetReferencesTable from "./AssetReferencesTable";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ActionsContainer from "./ActionsContainer";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "95%",
  },
  paper: {
    border: "0.5px solid #000000",
    margin: "auto",
    padding: "0 1rem 1rem 1rem",
  },
  button: {
    margin: "auto",
    width: "130px"
  },
  buttonItem: {
    width: "130px"
  },
  userContainer: {
    background: "#EAEAEA",
    padding: "0.5rem 1.1rem 1.1rem 1.1rem",
  },
  spacing: {
    marginTop: "5rem"
  },
  label: {
    textAlign: "left",
    margin: "3rem 0 1rem 0.5rem",
    color: "#999999"
  }
}));

export default function Ledger(props) {
  const classes = useStyles();

  useEffect(() => {
    if (props.ledger) {

    }
  }, [props.ledger]);

  return (
    <Paper elevation={1} className={classes.paper}>
      <h2>Hyperledger {props.ledger}</h2>
      {
        props.ledger === "Fabric" ?
        <p className={classes.label}>Org1</p> :
        <div className={classes.spacing}></div>
      }
      <Grid container spacing={2}>
        <Grid item sm={12} md={6}>
          <Paper elevation={0} className={classes.userContainer}>
            <ActionsContainer user={"Alice"} ledger={props.ledger}/>
          </Paper>
        </Grid>
        <Grid item sm={12} md={6}>
          <Paper elevation={0} className={classes.userContainer}>
            <ActionsContainer user={"Charlie"} ledger={props.ledger}/>
          </Paper>
        </Grid>
      </Grid>
      {
        props.ledger === "Fabric" ? 
        <p className={classes.label}>Org2</p> :
        <div className={classes.spacing}></div>
      }
      <Paper elevation={0} className={classes.userContainer}>
        <ActionsContainer user={"Bridge"} ledger={props.ledger}/>
      </Paper>
      <p className={classes.label}>Asset References</p>
      <AssetReferencesTable ledger={props.ledger}/>
    </Paper>
  );
}