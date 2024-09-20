import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AutocompleteWithAPI from "./AutocompleteWithAPI/AutocompleteWithAPI";

function SearchPatient({openDialog, handleDialog, getPatients}) {

    return (
            <Dialog
                open={openDialog}
                onClose={() => handleDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Ανάκτηση Στοιχείων Ασθενούς"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                    <AutocompleteWithAPI getPatients={getPatients} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialog(false)} autoFocus>
                        Επιβεβαίωση
                    </Button>
                </DialogActions>
            </Dialog>
    );
}

export default SearchPatient;
