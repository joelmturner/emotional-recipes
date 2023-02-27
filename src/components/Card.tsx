import { Recipe } from "@/types";
import Image from "next/image";

export function Card({ recipe }: { recipe: Recipe }) {
  return (
    <Image
      src={recipe.url}
      width="533"
      height="300"
      alt="emotional recipe background image"
      className="aspect-video rounded-xl"
    />
  );
}
