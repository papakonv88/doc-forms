import Snackbar from '@mui/material/Snackbar';
import {SnackbarCloseReason} from "@mui/base";
import {Alert} from "@mui/material";

function InfoMessages({isOpen, message, type, handleClose}) {

    const handleCloseInfoMessage = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        handleClose();
    };
    return (
        <Snackbar open={isOpen} autoHideDuration={10000} onClose={handleCloseInfoMessage}>
            <Alert
                onClose={handleCloseInfoMessage}
                severity={type}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default InfoMessages;
