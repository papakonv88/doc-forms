import {NextApiRequest, NextApiResponse} from 'next';
import NewPatient from './../../models/patient';

export async function AddPatient(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {name, surname, patronimo, amka} = req.body || {};
        const newPatient = new NewPatient({name, surname, patronimo, amka});
        const result = await newPatient.save()
        return res.status(201).json({message: 'Patient added successfully', result});
    } catch (e) {
        console.error(e);
        return res.status(400).json(e);
    }
}
