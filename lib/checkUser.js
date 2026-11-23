import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

const PLAN_CREDITS = {
  free: 1,
  starter: 5,
  pro: 15,
};

const getCurrentPlan = async () => {
  const { has } = await auth();
  if (has({ plan: "pro" })) {
    return "pro";
  } else if (has({ plan: "starter" })) {
    return "starter";
  }
  return "free";
};

const shouldAllocateCredits = (dbUser, currentPlan) => {
  // Always allocate if plan changed
  if (dbUser.currentPlan !== currentPlan) return true;

  // Allocate if never allocated before
  if (!dbUser.creditsLastAllocatedAt) return true;

  // Allocate if it's a new calendar month since last allocation
  const now = new Date();
  const last = new Date(dbUser.creditsLastAllocatedAt);
  const isNewMonth =
    now.getFullYear() > last.getFullYear() || now.getMonth() > last.getMonth();

  return isNewMonth;
};

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    const currentPlan = await getCurrentPlan();
    const credits = PLAN_CREDITS[currentPlan] || 0;

    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      // Interviewers don't have a credit subscription — skip allocation
      if (loggedInUser.role === "INTERVIEWER") return loggedInUser;

      if (shouldAllocateCredits(loggedInUser, currentPlan)) {
        // Roll forward any remaining credits from the previous period
        // Guard on the previous allocation state so concurrent requests
        // (Header + page both call checkUser) can't double-allocate.
        await db.user.updateMany({
          where: {
            clerkUserId: user.id,
            currentPlan: loggedInUser.currentPlan,
            creditsLastAllocatedAt: loggedInUser.creditsLastAllocatedAt,
          },
          data: {
            credits: { increment: credits },
            currentPlan,
            creditsLastAllocatedAt: new Date(),
          },
        });

        return await db.user.findUnique({ where: { clerkUserId: user.id } });
      }

      return loggedInUser;
    }
    // New user — create with credits from their current plan
    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    return await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        credits,
        currentPlan,
        creditsLastAllocatedAt: new Date(),
      },
    });
  } catch (err) {
    // A parallel request may have created the user first (unique clerkUserId)
    const existing = await db.user
      .findUnique({ where: { clerkUserId: user.id } })
      .catch(() => null);
    if (existing) return existing;

    console.log("Error checking user subscription status:", err);
    return null;
  }
};
