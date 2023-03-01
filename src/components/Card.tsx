import { Recipe } from "@/types";
import Image from "next/image";

export function Card({
  recipe,
  eager = false,
}: {
  recipe: Recipe;
  eager: boolean;
}) {
  return (
    <Image
      src={recipe.url}
      width="533"
      height="300"
      alt="emotional recipe image"
      className="aspect-video rounded-xl w-auto h-auto object-contain"
      priority={eager}
    />
  );
}
