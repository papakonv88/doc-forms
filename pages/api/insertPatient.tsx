import {NextApiRequest, NextApiResponse} from 'next';
import NewPatient from './../../models/patient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            const {amka} = req.query;
            const isAmka = await NewPatient.exists({ amka });
            res.status(200).json({isAmka});
            break;
        case 'POST':
            const newPatient = new NewPatient(req.body);
            const result = await newPatient.save()
            res.status(201).json({message: 'Patient added successfully', result});
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
