import {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {DialogContentText} from "@mui/material";

type ConfirmationDialogProps = {
    mode: string;
    openDialog: boolean;
    handleClose: (type?: string) => void;
    title: string;
    message: string;
    action: (mode: string) => void | Promise<void>;
};

function ConfirmationDialog({mode, openDialog, handleClose, title, message, action}: ConfirmationDialogProps) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async () => {
        if (isConfirming) return;

        setIsConfirming(true);
        try {
            await action(mode);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <Dialog
            open={openDialog}
            onClose={(_, reason) => {
                if (isConfirming) return;
                if (reason === "backdropClick" || reason === "escapeKeyDown") {
                    handleClose("cancel");
                }
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                "& .MuiPaper-root": {
                    maxWidth: "900px",
                    px: 2,
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{padding: 3}}>
                <Button onClick={() => handleClose("cancel")} disabled={isConfirming}>
                    Ακυρωση
                </Button>
                <Button
                    type="button"
                    onClick={handleConfirm}
                    variant="contained"
                    autoFocus
                    disabled={isConfirming}
                >
                    {isConfirming ? "Αποθήκευση..." : "Επιβεβαιωση"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
