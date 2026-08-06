import {NextApiRequest, NextApiResponse} from 'next';
import NewPatient from './../../models/patient';
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
            const {amka} = req.query;
            // @ts-ignore
            const patient = await NewPatient.findOne({amka});
            res.status(200).json({patient});
            break;
        case 'POST':
            const row = new NewPatient(req.body);
            const newRow = await row.save()
            res.status(201).json({message: 'Patient added successfully', newRow});
            break;
        case 'PATCH':
            const {_id} = req.query;
            const payload = req.body
            // @ts-ignore
            await NewPatient.findByIdAndUpdate(_id, payload);
            res.status(201).json({message: 'Patient updated successfully'});
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
