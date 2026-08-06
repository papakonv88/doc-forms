import PageContainer from "../../components/Containers/PageContainer";
import SectionContainer from "../../components/Containers/SectionContainer/SectionContainer";
import {GetServerSideProps} from "next";
import axios from "axios";
import ExamDetails from "../../components/ExamDetails/ExamDetails";

function ExamPage({exam}: any) {
    return (
        <>
            <PageContainer>
                <SectionContainer>
                   <ExamDetails {...exam} />
                </SectionContainer>
            </PageContainer>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, params } = context;

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;

    const baseUrl = `${protocol}://${host}`;

    const { data: exam } = await axios.get(`${baseUrl}/api/getExam?id=${params.id}`, {
        headers: {
            cookie: req.headers.cookie || '',
        },
    });

    return {
        props: { exam },
    };
};

export default ExamPage;
