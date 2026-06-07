import {Box, Button, Typography} from "@mui/material";
import {NextPageContext} from "next";
import {useRouter} from "next/router";
import PageContainer from "../components/Containers/PageContainer";
import SectionContainer from "../components/Containers/SectionContainer/SectionContainer";

type ErrorPageProps = {
    statusCode: number;
};

function getErrorMessage(statusCode: number): {title: string; description: string} {
    if (statusCode >= 500) {
        return {
            title: "Σφάλμα διακομιστή",
            description: "Παρουσιάστηκε πρόβλημα κατά την επεξεργασία του αιτήματος. Δοκιμάστε ξανά αργότερα.",
        };
    }

    return {
        title: "Παρουσιάστηκε σφάλμα",
        description: "Κάτι πήγε στραβά. Δοκιμάστε να επιστρέψετε στην αρχική ή να ξαναφορτώσετε τη σελίδα.",
    };
}

function ErrorPage({statusCode}: ErrorPageProps) {
    const router = useRouter();
    const {title, description} = getErrorMessage(statusCode);

    return (
        <PageContainer>
            <SectionContainer sx={{py: 10, px: 2, textAlign: "center"}}>
                <Typography
                    variant="h1"
                    sx={{fontSize: {xs: "3rem", md: "5rem"}, fontWeight: 700, mb: 2}}
                >
                    {statusCode}
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{mb: 4, maxWidth: 520, mx: "auto"}}
                >
                    {description}
                </Typography>
                <Box sx={{display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap"}}>
                    <Button variant="contained" onClick={() => router.push("/")}>
                        Αρχική
                    </Button>
                    <Button variant="outlined" onClick={() => router.reload()}>
                        Επαναφόρτωση
                    </Button>
                </Box>
            </SectionContainer>
        </PageContainer>
    );
}

ErrorPage.getInitialProps = ({res, err}: NextPageContext) => {
    const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
    return {statusCode};
};

export default ErrorPage;
