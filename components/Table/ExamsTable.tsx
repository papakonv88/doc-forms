// pages/index.tsx
import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, TablePagination, DialogContentText
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {ExamData} from "../../pages/exams";


function ExamsTable(exams: any) {
    console.log(exams, 'exams')
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<ExamData | null>(null);
    const [actionType, setActionType] = useState<'view' | 'delete' | null>(null);

    const handleView = (row: ExamData) => {
        setSelectedRow(row);
        setActionType('view');
        setOpenDialog(true);
    };

    const handleDelete = (row: ExamData) => {
        setSelectedRow(row);
        setActionType('delete');
        setOpenDialog(true);
    };

    const handleConfirm = () => {
        if (actionType === 'view' && selectedRow) {
            alert(`Viewing row: ${JSON.stringify(selectedRow)}`);
        } else if (actionType === 'delete' && selectedRow) {
            alert(`Deleting row with ID: ${selectedRow.id}`);
        }
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRow(null);
        setActionType(null);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
     {/*               {exams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: ExamData) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => handleView(row)}>
                                    View
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDelete(row)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}*/}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={exams.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-description"
            >
                <DialogTitle id="confirmation-dialog-title">
                    {actionType === 'view' ? 'View Row' : 'Delete Row'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirmation-dialog-description">
                        {actionType === 'view'
                            ? `Do you want to view the details of ${selectedRow?.name}?`
                            : `Are you sure you want to delete ${selectedRow?.name}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}

export default ExamsTable;
