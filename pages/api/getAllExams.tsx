import {NextApiRequest, NextApiResponse} from 'next';
import Exam from "../../models/exam"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
         case 'GET':
             // @ts-ignore
             const examsAll = await Exam.find().populate('patient')
             res.status(200).json(examsAll);
             break;
        default:
            res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
