import {NextApiRequest, NextApiResponse} from "next";
import NewExam from "./../../models/exam";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            try {
                const row = new NewExam(req.body);
                const newRow = await row.save();
                res.status(201).json({message: "Exam added successfully", newRow});
            } catch (e) {
                console.error(e);
                res.status(500).json({message: "Failed to add exam"});
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
