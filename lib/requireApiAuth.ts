import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth";

export async function requireApiAuth(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({message: "Unauthorized"});
        return null;
    }

    return session;
}
