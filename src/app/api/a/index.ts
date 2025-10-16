import { getUser } from "@/actions/userAction";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a
  } else {
    console.log(await getUser());
    res.status(200).json({ message: "Hey" });
  }
}
