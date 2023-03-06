import { supabase } from "@/lib/api";
import { Recipe, CloudinaryAsset } from "@/types/general";
import { moderationStates } from "./constants";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getLatestSubmittedRecipes(
  filter: "FEATURED" | "APPROVED" = "APPROVED",
  limit?: number
): Promise<Recipe[]> {
  const query = supabase.from("recipes").select("*");

  if (filter === "FEATURED") {
    query.filter("featured", "eq", "true");
  } else {
    query.filter("moderation", "eq", moderationStates.APPROVED);
  }
  query.order("created_at", { ascending: false });

  const { data: results } = await query;

  if (limit) {
    return (results as Recipe[])?.slice(0, limit);
  }

  return (results as Recipe[]) ?? null;
}

export async function getSavedBackgroundImages(): Promise<CloudinaryAsset[]> {
  const { resources } = await cloudinary.search
    .expression(`folder:emotional-recipes && tags=${moderationStates.APPROVED}`)
    .sort_by("public_id", "desc")
    .max_results(30)
    .with_field("tags")
    .execute();

  return resources;
}
