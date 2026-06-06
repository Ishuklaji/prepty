"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const INTERVIEWER_BLOCKED = ["/appointments"];
const INTERVIEWEE_BLOCKED = ["/dashboard"];

export default function RoleRedirect({ role }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!role || !pathname) return;

    if (role === "UNASSIGNED" && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }

    if (
      role === "INTERVIEWER" &&
      (pathname.startsWith("/onboarding") ||
        INTERVIEWER_BLOCKED.some((p) => pathname.startsWith(p)))
    ) {
      router.replace("/dashboard");
      return;
    }

    if (role === "INTERVIEWEE" && pathname.startsWith("/onboarding")) {
      router.replace("/explore");
      return;
    }

    if (
      role === "INTERVIEWEE" &&
      INTERVIEWEE_BLOCKED.some((p) => pathname.startsWith(p))
    ) {
      router.replace("/appointments");
    }
  }, [role, pathname, router]);

  return null;
}
