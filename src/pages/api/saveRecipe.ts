import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/api";

type Data =
  | {
      url: string;
    }
  | {
      message: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "method not allowed" });
  }

  // Get data submitted in request's body.
  const { url } = JSON.parse(req.body);
  const response = await supabase.from("recipes").insert([
    {
      url,
    },
  ]);

  if (response.error) {
    return res.status(400).json({ message: response.error.message });
  }

  return res.status(200).json({ message: "success" });
}
