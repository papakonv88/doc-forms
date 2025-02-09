import {NextApiRequest, NextApiResponse} from 'next';
import NewExam from './../../models/exam';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            const row = new NewExam(req.body);
            try {
                const newRow = await row.save()
                res.status(201).json({message: 'Exam added successfully', newRow});
            } catch (e) {
                console.log(e, 'e')
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
