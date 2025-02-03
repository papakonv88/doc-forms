import SectionContainer from "../../components/Containers/SectionContainer/SectionContainer";
import PageContainer from "../../components/Containers/PageContainer";
import ExamsTable from "../../components/Table/ExamsTable";
import axios from "axios";
import {GetServerSideProps} from "next";

export interface ExamData {
    id: number;
    name: string;
    surname: string;
    patronimo: string;
    amka: string;
    imerominia_genisis: Date;
}

function Exams(exams: ExamData[]) {
    return (
        <>
            <PageContainer>
                <SectionContainer>
                    <ExamsTable {...exams}/>
                </SectionContainer>
            </PageContainer>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;

    const baseUrl = `${protocol}://${host}`;

    try {
        const { data: exams } = await axios.get(`${baseUrl}/api/getAllExams`);

        return {
            props: { exams },
        };
    } catch (e) {
        return {
            props: { exams: [] },
        };
    }
};
export default Exams;
