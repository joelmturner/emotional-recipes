import { Recipe } from "@/types";
import { s3 } from "@/lib/api";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getLatestSubmittedRecipes(
  limit?: number
): Promise<Recipe[]> {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
    Key: "recipeList.json",
  };

  const command = new GetObjectCommand(params);
  const response = await s3.send(command);
  const contents = await response.Body?.transformToString("utf-8");

  const results =
    contents &&
    JSON.parse(contents)?.filter((content: Recipe) => !!content.url);

  if (limit) {
    return results?.slice(0, limit);
  }

  return results ?? null;
}
