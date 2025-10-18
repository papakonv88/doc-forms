import React from "react";
import {Box, Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {Assignment, AddCircle} from '@mui/icons-material';

const buttons = [
    {
        id: 1,
        title: 'Λίστα Εξετάσεων',
        description: 'Πλοηγηθείτε στη σελίδα με την συνολική λίστα των εξετάσεων και διαχειριστείτε τις υπάρχουσες καταγραφές',
        buttonText: 'Δείτε Εξετάσεις',
        path: 'exams',
        icon: <Assignment sx={{ fontSize: 40 }} />,
        color: 'primary',
        backgroundColor: '#1976d2'
    },
    {
        id: 2,
        title: 'Νέα Εξέταση',
        description: 'Πλοηγηθείτε στη σελίδα για να καταχωρήσετε τα στοιχεία ασθενή και της εξέτασης',
        buttonText: 'Δημιουργία Εξέτασης',
        path: 'patient',
        icon: <AddCircle sx={{ fontSize: 40 }} />,
        color: 'secondary',
        backgroundColor: '#424242'
    }
]

const ShortcutCards = () => {
    const router = useRouter();
    const handleNavigation = (path: string) => {
        router.push(path);
    };
    return (
        <Box
            display={'flex'}
            gap={4}
            flexWrap="wrap"
            justifyContent="center"
            sx={{ mt: 4 }}
        >
            {buttons.map((item) => (
                <Card
                    key={`${item.id}_card`}
                    sx={{
                        minWidth: 320,
                        maxWidth: 400,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        }
                    }}
                >
                    <Box
                        sx={{
                            background: item.backgroundColor,
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                        }}
                    >
                        <Box sx={{ color: 'white' }}>
                            {item.icon}
                        </Box>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: 'text.primary'
                            }}
                        >
                            {item.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 3, lineHeight: 1.6 }}
                        >
                            {item.description}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                            onClick={() => handleNavigation(item.path)}
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                backgroundColor: item.backgroundColor,
                                fontWeight: 600,
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: item.backgroundColor,
                                    filter: 'brightness(1.1)',
                                }
                            }}
                        >
                            {item.buttonText}
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </Box>
    );
};

export default ShortcutCards;
