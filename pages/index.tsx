import PageContainer from "../components/Containers/PageContainer";
import SectionContainer from "../components/Containers/SectionContainer/SectionContainer";
import {ExamData} from "./exams";

function Home(exams: ExamData[]) {
    return (
        <>
            <PageContainer>
                <SectionContainer>
                    <h1>Welcome to MyApp</h1>
                    <p>
                        This is the homepage of your Next.js app. You can customize this content
                        as needed.
                    </p>
                </SectionContainer>
            </PageContainer>
        </>
    )
}

export default Home
