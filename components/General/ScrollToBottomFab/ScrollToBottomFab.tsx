import {Fab} from "@mui/material";
import {KeyboardArrowDown as KeyboardArrowDownIcon} from "@mui/icons-material";

function ScrollToBottomFab() {
    const handleClick = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    return (
        <Fab
            color="primary"
            size="small"
            aria-label="Μετάβαση στο τέλος της σελίδας"
            onClick={handleClick}
            sx={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: (theme) => theme.zIndex.speedDial,
                width: 40,
                height: 40,
                minHeight: 40,
            }}
        >
            <KeyboardArrowDownIcon sx={{fontSize: 24}}/>
        </Fab>
    );
}

export default ScrollToBottomFab;
