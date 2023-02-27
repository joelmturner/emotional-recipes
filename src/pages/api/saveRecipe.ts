import { Recipe } from "@/types";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
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
  const { name, type = "application/json", content } = req.body;

  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
      Key: "recipeList.json",
    };
    s3.getObject(params, function (err, data) {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: `failed: ${"no root file"}` });
      } else {
        console.log("Successfully dowloaded data from  bucket");
        const contents = data.Body?.toString("utf-8");
        if (!contents) {
          return res.status(400).json({ message: `failed: ${err}` });
        }
        const contentToSave = Array.from(JSON.parse(contents));
        const Body = JSON.stringify([...contentToSave, content]);

        s3.putObject({ ...params, Body }, function (err, data) {
          if (err) {
            console.error(err);
            return res.status(400).json({ message: `failed: ${err}` });
          } else {
            console.log("Successfully uploaded data to bucket");
            return res.status(200).json({ url: "success" });
          }
        });
      }
    });

    //     console.log('dataStoreFile', dataStoreFile);
    // if (!dataStoreFile) {
    //     return res.status(400).json({ message: `failed: ${'no root file'}` })
    // }

    // const buffer = Buffer.from((dataStoreFile as any).push(content));
    // const fileParams = {
    //     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
    //     Key: `recipeList.json`,
    //     Body: buffer,
    //     ContentType: type,
    //     // ACL: 'public-read'
    // }

    // s3.upload(fileParams, function (err: any, data: any) {
    //     if (err) {
    //         console.error(err);
    //         return res.status(400).json({ message: `failed: ${err}` })
    //     }
    //     console.log(data);
    //     return res.status(200).json({ url: data.Location})
    // })
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: `failed: ${err}` });
  }
}
