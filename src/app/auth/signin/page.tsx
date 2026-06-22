import { Suspense } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  const available: ("google" | "github" | "discord" | "nodemailer")[] = [];
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) available.push("google");
  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) available.push("github");
  if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) available.push("discord");
  if (process.env.EMAIL_SERVER) available.push("nodemailer");

  return (
    <Suspense>
      <SignInForm available={available} />
    </Suspense>
  );
}
