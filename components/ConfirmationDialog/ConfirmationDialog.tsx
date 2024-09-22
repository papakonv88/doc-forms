import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import * as React from "react";
import {DialogContentText} from "@mui/material";

function ConfirmationDialog({patientId, openDialog, handleClose, title, message, action}) {
    return (
        <Dialog
            open={openDialog}
            onClose={handleClose}
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
                {title}
            </DialogTitle>
            <DialogContent >
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: 3 }}>
                <Button onClick={() => handleClose('cancel')}>
                    Ακυρωση
                </Button>
                <Button onClick={() => action(patientId)} variant={'contained'} autoFocus>
                    Επιβεβαιωση
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog
