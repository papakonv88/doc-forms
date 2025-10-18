import {AppBar, Toolbar, Typography, Box, Button} from "@mui/material";
import {useRouter} from "next/router";
import {Vaccines, Assessment, AddCircle} from '@mui/icons-material';

function Appbar() {
    const router = useRouter();
    const handleNavigation = (path) => {
        router.push(path);
    };
    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: 'rgba(18, 18, 18, 0.35)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
            >
                <Toolbar sx={{ py: 1 }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleNavigation("/")}
                    >
                        <Box
                            sx={{
                                background: '#1976d2',
                                borderRadius: 2,
                                p: 1,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Vaccines sx={{ color: 'white', fontSize: '1.5rem' }} />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: '#ffffff',
                            }}
                        >
                            ΗΕΓ Πρόγραμμα Πορίσματος
                        </Typography>
                    </Box>

                    <Box flex={1}/>

                    <Box display={'flex'} gap={1} alignItems="center">
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/exams")}
                            startIcon={<Assessment />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                color: '#ffffff',
                                '&:hover': {
                                    background: 'rgba(25, 118, 210, 0.1)',
                                }
                            }}
                        >
                            Εξετάσεις
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleNavigation("/patient")}
                            startIcon={<AddCircle />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                backgroundColor: '#1976d2',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                }
                            }}
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
