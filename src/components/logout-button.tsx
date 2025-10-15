"use client";
import React from "react";
import { logout } from "@/actions/authAction";

export default function LogoutButton() {
  return (
    <span onClick={() => logout()} className="w-full">
      Sign out
    </span>
  );
}
