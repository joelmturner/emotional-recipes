import Image from "next/image";

export function Card({
  url,
  eager = false,
}: {
  url: string | null;
  eager: boolean;
}) {
  return !url ? null : (
    <Image
      src={url}
      width="533"
      height="300"
      alt="emotional recipe image"
      className="aspect-video rounded-xl w-full h-full object-contain"
      priority={eager}
      sizes={"(max-width: 380px) 100vw, (max-width: 768px) 33vw, 25vw"}
      quality={80}
    />
  );
}
