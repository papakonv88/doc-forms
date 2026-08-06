export {default} from "next-auth/middleware";

export const config = {
    matcher: [
        "/",
        "/exams/:path*",
        "/patient/:path*",
        "/report/:path*",
        "/api/getAllExams",
        "/api/getExam",
        "/api/insertExam",
        "/api/insertPatient",
        "/api/searchPatient",
        "/api/deletePatient",
    ],
};
