import {NextApiRequest, NextApiResponse} from "next";
import NewPatient from "../../models/patient";
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

            const { id } = req.query;
            // @ts-ignore
            const deletedPatient = await NewPatient.findByIdAndDelete(id);

            if (!deletedPatient) throw new Error('Patient not found');

            res.status(200).json({ message: 'Patient deleted successfully', deletedPatient });
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
