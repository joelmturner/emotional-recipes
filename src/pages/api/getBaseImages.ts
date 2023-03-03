import { moderationStates } from "@/lib/constants";
import { Resource } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

type Data =
  | { data: Resource[] }
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

  try {
    const { resources } = await cloudinary.search
      .expression(
        `folder:emotional-recipes && tags=${moderationStates.APPROVED}`
      )
      .sort_by("public_id", "desc")
      .max_results(30)
      .with_field("tags")
      .execute();

    return res.status(200).json({ data: resources });
  } catch (err) {
    return res.status(400).json({ message: err + "" });
  }
}
