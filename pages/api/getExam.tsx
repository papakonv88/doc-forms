import {NextApiRequest, NextApiResponse} from "next";
import Exam from "../../models/exam";
import {requireApiAuth} from "../../lib/requireApiAuth";
import dbConnect from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await requireApiAuth(req, res);
    if (!session) {
        return;
    }

    await dbConnect();

    switch (req.method) {
        case 'GET':
            const { id } = req.query
            // @ts-ignore
            const exam = await Exam.findOne({ examId: id }).populate('patient')
            res.status(200).json(exam);
            break;
        default:
            res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
