import {AppBar, Toolbar, Typography, Box, Button} from "@mui/material";
import {useRouter} from "next/router";
import {signOut, useSession} from "next-auth/react";
import {Vaccines, Assessment, AddCircle, Logout} from '@mui/icons-material';

function Appbar() {
    const router = useRouter();
    const {data: session} = useSession();

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                    color: 'text.primary',
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
                                color: 'text.primary',
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
                                color: 'text.primary',
                                '&:hover': {
                                    background: 'rgba(25, 118, 210, 0.08)',
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
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                                }
                            }}
                        >
                            Νέα Εξέταση
                        </Button>
                        {session?.user?.name && (
                            <Typography
                                variant="body2"
                                sx={{color: 'text.secondary', px: 1}}
                            >
                                {session.user.name}
                            </Typography>
                        )}
                        <Button
                            color="inherit"
                            onClick={() => signOut({callbackUrl: "/login"})}
                            startIcon={<Logout />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                color: 'text.primary',
                                '&:hover': {
                                    background: 'rgba(0, 0, 0, 0.04)',
                                }
                            }}
                        >
                            Έξοδος
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </>
    );
}

export default Appbar;
