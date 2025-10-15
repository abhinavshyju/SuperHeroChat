import { Hero, HeroCard } from "./hero-card";
export const HEROES: Hero[] = [
  {
    slug: "batman",
    name: "Bruce Wayne",
    alias: "Batman",
    image: "/images/bat_man.png",
    blurb:
      "Strategic, disciplined, and armed with cutting-edge tech—the Dark Knight detective.",
  },
  {
    slug: "superman",
    name: "Clark Kent",
    alias: "Superman",
    image: "/images/super_man.png",
    blurb:
      "Hope from Krypton—super strength, flight, and a steadfast moral compass.",
  },

  {
    slug: "spider-man",
    name: "Peter Parker",
    alias: "Spider-Man",
    image: "/images/spider_man.png",
    blurb:
      "With great power comes great responsibility—agile, witty, and scientifically savvy.",
  },
  {
    slug: "captain-america",
    name: "Steve Rogers",
    alias: "Captain America",
    image: "/images/captain.png",
    blurb:
      "Super-soldier with unwavering courage—leader, strategist, and symbol of justice.",
  },
];

export function HeroList() {
  return (
    <section aria-label="Choose a superhero to chat with">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {HEROES.map((h) => (
          <HeroCard key={h.slug} hero={h} />
        ))}
      </div>
    </section>
  );
}
