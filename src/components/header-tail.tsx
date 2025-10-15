import LoginButton from "./login-button";
import authOptions from "@/config/auth.config";
import Image from "next/image";
import getServerSession from "next-auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import LogoutButton from "./logout-button";
import Link from "next/link";

export default async function HeaderTail() {
  const session = await getServerSession(authOptions).auth();
  if (!session) {
    return (
      <div className="">
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            src={session.user?.image || ""}
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/load"}>Load content</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
