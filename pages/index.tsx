import PageContainer from "../components/Containers/PageContainer";
import SectionContainer from "../components/Containers/SectionContainer/SectionContainer";
import {ExamData} from "./exams";
import ShortCutCards from "../components/ShortcutCards/ShortCutCards";
import {Box, Typography} from "@mui/material";

function Home(exams: ExamData[]) {
    return (
        <>
            <PageContainer>
                <SectionContainer>
                    <Box display={'flex'} flexDirection={'column'} py={4}>
                    <Typography variant={'h4'}>Πρόγραμμα Πορίσματος</Typography>
                    <ShortCutCards />
                    </Box>
                </SectionContainer>
            </PageContainer>
        </>
    )
}

export default Home
