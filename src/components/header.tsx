import Link from "next/link";
import { Activity } from "lucide-react";
import React from "react";
import HeaderTail from "./header-tail";

export default async function Header() {
  return (
    <header className="flex justify-between border-b border-border items-center p-4 sticky top-0 left-0 w-full bg-background z-50">
      <Link
        href={"/"}
        className="flex gap-2 items-center text-primary font-semibold"
      >
        <Activity /> <span>HeroChat</span>
      </Link>

      <div className="">
        <HeaderTail />
      </div>
    </header>
  );
}
