import { supabase } from "@/lib/api";
import { Recipe } from "@/types";
import { moderationStates } from "./constants";

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
