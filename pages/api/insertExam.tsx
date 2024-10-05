import {NextApiRequest, NextApiResponse} from 'next';
import NewExam from './../../models/exam';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
       /* case 'GET':
            const {amka} = req.query;
            // @ts-ignore
            const patient = await NewPatient.findOne({ amka });
            res.status(200).json({patient});
            break;*/
        case 'POST':
            const row = new NewExam(req.body);
            const newRow = await row.save()
            res.status(201).json({message: 'Exam added successfully', newRow});
            break;
      /*  case 'PATCH':
            const { id } = req.query;
            const payload = req.body
            await NewPatient.findByIdAndUpdate(id, payload, {
                runValidators: true
            });
            res.status(201).json({message: 'Patient updated successfully'});
            break;*/
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
