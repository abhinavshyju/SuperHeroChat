import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Hero = {
  slug: string;
  name: string;
  alias: string;
  image: string;
  blurb: string;
};
type HeroCardProps = {
  hero: Hero;
  className?: string;
};

export function HeroCard({ hero, className }: HeroCardProps) {
  return (
    <Card className={cn("overflow-hidden ", className)}>
      <Link
        href={`/hero/chat?hero=${hero.slug}`}
        className="block "
        aria-label={`Open chat with ${hero.alias}`}
      >
        <CardContent className=" grid gap-4 grid-cols-[100px_1fr]">
          <div className="relative  w-full ">
            <Image
              src={hero.image || "/placeholder.svg"}
              alt={`${hero.alias} portrait`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain rounded-full"
              priority={false}
            />
          </div>
          <div className="">
            <h1 className="text-foreground font-semibold">{hero.alias}</h1>
            <p className=" text-sm text-muted-foreground">{hero.name}</p>
            <p className=" line-clamp-2 text-pretty text-sm text-muted-foreground">
              {hero.blurb}
            </p>
            {/* <div className="mt-4">
              <Button
                variant="default"
                className="w-full"
                aria-label={`Start chat with ${hero.alias}`}
              >
                Chat with {hero.alias}
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
