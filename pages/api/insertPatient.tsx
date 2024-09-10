import {NextApiRequest, NextApiResponse} from 'next';
import NewPatient from './../../models/patient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const newPatient = new NewPatient(req.body);
            const result = await newPatient.save()
            return res.status(201).json({message: 'Patient added successfully', result});
        } catch (e) {
            console.error(e);
            return res.status(400).json(e);
        }
    } else {
        res.status(405).json({ success: false, error: "Method not allowed" });
    }
}
