import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("doc");
            const { name, surname, patronimo, amka } = req.body || {};
            const result = await db.collection('patients').insertOne({
                name,
                surname,
                patronimo,
                amka,
                createdAt: new Date(),
            });
            res.status(201).json({ message: 'Patient added successfully', result });
    } catch (e) {
        console.error(e);
        res.status(400).json(e);
    }
}