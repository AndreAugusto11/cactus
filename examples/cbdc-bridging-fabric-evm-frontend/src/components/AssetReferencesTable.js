import React, { useEffect } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const headCells = [
  {
    id: "id",
    first: true,
    label: "ID",
  },
  { id: "amount", numeric: true, label: "Amount" },
  {
    id: "owner",
    label: "Owner",
  }
];

function ItemsTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            style={
              headCell.first
                ? {
                    backgroundColor: "#EAEAEA",
                    color: "black",
                  }
                : {
                    backgroundColor: "#EAEAEA",
                    color: "black",
                  }
            }
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function AssetReferencesTable(props) {
  useEffect(() => {
  }, [props.ledger, props.assetRefs]);

  return (
    <div>
      {props.assetRefs && <TableContainer>
        <Table size="small" aria-label="a dense table">
          <ItemsTableHead />
          <TableBody>
            {props.assetRefs.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.numberTokens}</TableCell>
                <TableCell align="center">{row.recipient}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
    </div>
  );
}
