import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
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

      {/* sign in button */}
      <div className="flex items-center gap-3 ">
        <Show when="signed-out">
          {/* links */}

          {/* credits */}
          <SignInButton>
            <Button variant="ghost">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="gold">Get Started →</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  );
};

export default Header;
