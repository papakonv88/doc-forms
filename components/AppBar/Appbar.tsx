import {AppBar, Toolbar, Typography, Box, Button} from "@mui/material";
import {useRouter} from "next/router";
import VaccinesIcon from '@mui/icons-material/Vaccines';

function Appbar() {
    const router = useRouter();
    const handleNavigation = (path) => {
        router.push(path);
    };
    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    {/*<Typography
                        variant="h6"
                        sx={{ flexGrow: 1, cursor: "pointer" }}
                        onClick={() => handleNavigation("/")}
                    >
                        MyApp
                    </Typography>*/}

                    <VaccinesIcon sx={{cursor: "pointer", fontSize: '1.8rem'}} onClick={() => handleNavigation("/")}/>
                    <Box flex={1}/>
                    <Box display={'flex'} columnGap={2}>
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/exams")}
                            sx={{textTransform: "none"}}
                        >
                            Εξετάσεις
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/patient")}
                            sx={{textTransform: "none"}}
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
