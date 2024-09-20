import {NextApiRequest, NextApiResponse} from 'next';
import NewPatient from './../../models/patient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            const { q } = req.query;
            if (q) {
                // @ts-ignore
                const patients = await NewPatient.find({
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { surname: { $regex: q, $options: 'i' } },
                        { patronimo: { $regex: q, $options: 'i' } },
                        { amka: { $regex: q, $options: 'i' } },
                    ],
                });
                res.status(200).json(patients);
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
