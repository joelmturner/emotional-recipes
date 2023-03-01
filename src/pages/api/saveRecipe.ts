import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/api";

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
  const { content } = req.body;

  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
      Key: "recipeList.json",
    };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    const contents = await response.Body?.transformToString("utf-8");

    if (!contents) {
      return res.status(400).json({ message: `failed: no file contents` });
    }

    const contentToSave = Array.from(JSON.parse(contents));
    const Body = JSON.stringify([...contentToSave, content]);

    const putCommand = new PutObjectCommand({ ...params, Body });
    await s3.send(putCommand);

    console.log("Successfully uploaded data to bucket");
    return res.status(200).json({ url: "success" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: `failed: ${err}` });
  }
}
