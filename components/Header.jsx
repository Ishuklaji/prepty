import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { CalendarDays, Users } from "lucide-react";
import CreditButton from "./CreditButton";
import RoleRedirect from "./RoleRedirect";

const Header = async () => {
  const user = await checkUser();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-3 [padding-left:0.75rem] [padding-right:0.75rem]  py-3 border-b border-white/7 backdrop-blur-xl">
      {/* logo */}
      <Link href="/">
        <Image
          src={"/logo.png"}
          alt="Prepty Logo"
          width={100}
          height={100}
          className="h-11 w-auto"
        />
      </Link>

      {/* redirection logic */}
    {  user && <RoleRedirect  role={user.role} />}

      {/* sign in button */}
      <div className="flex items-center gap-3 ">
        <Show when="signed-out">
          <SignInButton>
            <Button variant="ghost">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="gold">Get Started →</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          {/* links */}
          {user?.role === "INTERVIEWER" && (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {user?.role === "INTERVIEWEE" && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/explore">
                  <Users size={16} />
                  <span className="hidden md:inline">Explore</span>
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/appointments">
                  <CalendarDays size={16} />
                  <span className="hidden md:inline">My Appointments</span>
                </Link>
              </Button>
            </>
          )}
          {/* credits */}
          <CreditButton
            role={user?.role === "INTERVIEWER" ? "INTERVIEWER" : "INTERVIEWEE"}
            credits={
              (user?.role === "INTERVIEWER"
                ? user?.creditBalance
                : user?.credits) ?? 0
            }
          />

          <UserButton />
        </Show>
      </div>
    </nav>
  );
};

export default Header;
