import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AutocompleteWithAPI from "./AutocompleteWithAPI/AutocompleteWithAPI";
import {useState} from "react";

function SearchPatient({openDialog, handleDialog, getPatients, retrievePatient}) {
    const [activeOption, setActiveOption] = useState(null);
    const handleOptionChange = (option) => {
        setActiveOption(option)
    }

    const handleCancel = () => {
        handleOptionChange(null)
        handleDialog(false)
    }

    const handleConfirm = () => {
        retrievePatient(activeOption);
        handleOptionChange(null);
        handleDialog(false);
    }

    const handleDialogClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        handleOptionChange(null);
        handleDialog(false);
    }

    return (
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        maxWidth: '900px',
                        px: 2
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Ανάκτηση Στοιχείων Ασθενούς"}
                </DialogTitle>
                <DialogContent >
                    <AutocompleteWithAPI getPatients={getPatients} handleOptionChange={handleOptionChange} />
                </DialogContent>
                <DialogActions sx={{ padding: 3 }}>
                    <Button onClick={() => handleCancel()}>
                        Ακυρωση
                    </Button>
                    <Button onClick={() => handleConfirm()} disabled={!activeOption} variant={'contained'} autoFocus>
                        Επιβεβαιωση
                    </Button>
                </DialogActions>
            </Dialog>
    );
}

export default SearchPatient;
