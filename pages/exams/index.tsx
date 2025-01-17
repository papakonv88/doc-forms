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
    console.log(exams, 'exams')
    return (
        <>
            <PageContainer>
                <SectionContainer>
                    <ExamsTable exams={exams}/>
                </SectionContainer>
            </PageContainer>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const res = await fetch('http://localhost:3000/api/getAllExams');
    const exams: ExamData[] = await res.json();

    return { props: { exams } };
};

export default Exams;