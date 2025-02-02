import PageContainer from "../components/Containers/PageContainer";
import SectionContainer from "../components/Containers/SectionContainer/SectionContainer";
import {ExamData} from "./exams";

function Home(exams: ExamData[]) {
    return (
        <>
            <PageContainer>
                <SectionContainer>
                    <h1>Πρόγραμμα Πορίσματος</h1>
                    <p>
                       Καλωσήρθατε στο Πρόγραμμα Πορίσματος
                    </p>
                </SectionContainer>
            </PageContainer>
        </>
    )
}

export default Home
