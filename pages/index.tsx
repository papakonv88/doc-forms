import PageContainer from "../components/Containers/PageContainer";
import SectionContainer from "../components/Containers/SectionContainer/SectionContainer";
import {ExamData} from "./exams";
import ShortCutCards from "../components/ShortcutCards/ShortCutCards";
import {Box, Container} from "@mui/material";

function Home(exams: ExamData[]) {
    return (
        <>
            <PageContainer>
                <Container maxWidth="lg">
                    <SectionContainer>
                            <Box display="flex" gap={2} flexWrap="wrap">
                            </Box>
                        <ShortCutCards />
                    </SectionContainer>
                </Container>
            </PageContainer>
        </>
    )
}

export default Home
