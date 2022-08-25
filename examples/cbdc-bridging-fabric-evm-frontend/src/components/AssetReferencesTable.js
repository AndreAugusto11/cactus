import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function createData(id, amount, owner) {
  return { id, amount, owner };
}

const filteredRows = [
  createData('c5dfbd04-a71b-4848-92d1-78cd1fafaaf1', 500, "Alice"),
  createData('889242f8-58ae-449e-b938-fa28fdca65b6', 500, "Charlie"),
  createData('d25fbcbb-0895-4905-b8d5-502d5e83b122', 1000, "Alice"),
];

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

function ItemsTableHead(props) {
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

export default function AssetReferencesTable() {
  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <ItemsTableHead
            rowCount={filteredRows.length}
          />
        <TableBody>
          {filteredRows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="center">{row.amount}</TableCell>
              <TableCell align="center">{row.owner}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
