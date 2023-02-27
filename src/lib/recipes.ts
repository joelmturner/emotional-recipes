import { s3 } from "@/lib/api";
import { v2 as cloudinary } from "cloudinary";
import { supabase } from "./api";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getLatestSubmittedRecipes() {
  let output = null;
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
    Key: "recipeList.json",
  };
  const boom = await new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
        if (err) {
        console.error(err);
        reject(err);
        } else {
        console.log("Successfully dowloaded data from  bucket");
        //   data.Body?.toString("utf-8");
        const contents = data.Body?.toString("utf-8");
        if (contents) {
            resolve(JSON.parse(contents));
        } else {
            reject('no contents');
        }
        }
    });
    });

  return boom ?? null;
}

export async function saveRecipe(recipe: any) {
  const { error } = await supabase
    .from("countries")
    .insert({ id: 1, url: recipe.url, config: recipe.config });

  console.log("error", error);
}

export async function saveNewRecipe(recipe: any): Promise<"success" | "error"> {
  try {
    const record = {
      url: recipe.url,
      config: recipe.config,
    };

    fs.writeFileSync(
      path.join(__dirname, `./public/recipes/${new Date().valueOf()}.json`),
      JSON.stringify(record)
    );
    return Promise.resolve("success");
  } catch (err) {
    console.error(err);
    return Promise.resolve("error");
  }
}
