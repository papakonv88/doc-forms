import {Box, Typography} from "@mui/material";
import PageContainer from "../components/Containers/PageContainer";

export default function NotFoundPage() {
    return (
        <PageContainer>
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 2,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{fontSize: {xs: "4rem", md: "6rem"}, fontWeight: 700, mb: 2}}
                >
                    404
                </Typography>
                <Typography variant="h5">Η σελίδα δεν βρέθηκε</Typography>
            </Box>
        </PageContainer>
    );
}
