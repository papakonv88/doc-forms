import {AppBar, Toolbar, Typography, Box, Button} from "@mui/material";
import { useRouter } from "next/router";

function Appbar() {
    const router = useRouter();
    const handleNavigation = (path) => {
        router.push(path);
    };
    return (
        <>
            <AppBar position="fixed">
                <Toolbar>

                    {/* Title */}
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, cursor: "pointer" }}
                        onClick={() => handleNavigation("/")}
                    >
                        MyApp
                    </Typography>

                    <Box display={'flex'} columnGap={2}>
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/exams")}
                            sx={{ textTransform: "none" }}
                        >
                            Εξετάσεις
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/patient")}
                            sx={{ textTransform: "none" }}
                        >
                            Νέα Εξέταση
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </>
    );
}

export default Appbar;
