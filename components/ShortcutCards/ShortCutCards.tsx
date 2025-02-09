import React from "react";
import {Box, Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {useRouter} from "next/router";

const buttons = [
    {
        title: 'Λίστα Εξετάσεων',
        description: 'Πλοηγηθείτε στη σελίδα με την συνολική λίστα των εξετάσεων',
        buttonText: 'Εξετασεις',
        path: 'exams'
    },
    {
        title: 'Νέα Εξέταση',
        description: 'Πλοηγηθείτε στη σελίδα για να καταχωρήσετε τα στοιχεία ασθενή και της εξέτασης',
        buttonText: 'Νεα Εξεταση',
        path: 'patient'
    }
]

const ShortcutCards = () => {
    const router = useRouter();
    const handleNavigation = (path: string) => {
        router.push(path);
    };
    return (
        <Box mt={7} display={'flex'} columnGap={4}>
            {buttons.map((item) => (
                <Card sx={{ minWidth: 275, maxWidth: 375 }}>
                    <CardContent>
                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }} variant="h5" component="div">
                            {item.title}
                        </Typography>
                        <Typography variant="body2">
                            {item.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => handleNavigation(item.path)} size="small">{item.buttonText}</Button>
                    </CardActions>
                </Card>
            ))}
        </Box>
    );
};

export default ShortcutCards;
