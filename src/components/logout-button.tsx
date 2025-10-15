"use client";
import { signOut } from "next-auth/react";
import React from "react";

export default function LogoutButton() {
  return (
    <span onClick={() => signOut()} className="w-full">
      Sign out
    </span>
  );
}
