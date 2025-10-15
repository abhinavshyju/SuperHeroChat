"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/authAction";

export default function LoginButton() {
  return <Button onClick={() => login()}>Sign In</Button>;
}
