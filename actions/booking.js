"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { StreamClient } from "@stream-io/node-sdk";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import { createRateLimiter, checkRateLimit } from "@/lib/arcjet";

export const getInterviewerProfile = async (interviewerId) => {
  try {
    const interviewer = await db.user.findUnique({
      where: { id: interviewerId, role: "INTERVIEWER" },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        title: true,
        company: true,
        yearsExp: true,
        bio: true,
        categories: true,
        creditRate: true,
        availabilities: {
          where: { status: "AVAILABLE" },
          select: { startTime: true, endTime: true },
          take: 1,
        },
        bookingsAsInterviewer: {
          where: { status: "SCHEDULED" },
          select: { startTime: true, endTime: true },
        },
      },
    });

    return interviewer ?? null;
  } catch (error) {
    console.error("Error fetching interviewer profile:", error);
    return null;
  }
};

export const bookSlot = async ({ interviewerId, startTime, endTime }) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // ── Arcjet rate limit ──────────────────────────────────────────────────────
  const req = await request();
  const rateLimitError = await checkRateLimit(bookingLimiter, req, user.id);
  if (rateLimitError) throw new Error(rateLimitError);
  // ──────────────────────────────────────────────────────────────────────────

  const [dbUser, interviewer] = await Promise.all([
    db.user.findUnique({ where: { clerkUserId: user.id } }),
    db.user.findUnique({ where: { id: interviewerId } }),
  ]);

  if (!dbUser || dbUser.role !== "INTERVIEWEE")
    throw new Error("Only interviewees can book sessions");
  if (!interviewer || interviewer.role !== "INTERVIEWER")
    throw new Error("Interviewer not found");

  const credits = interviewer.creditRate ?? 1;

  if (dbUser.credits < credits)
    throw new Error("Insufficient credits. Please upgrade your plan.");

  // Check slot isn't already taken
  const conflict = await db.booking.findFirst({
    where: {
      interviewerId,
      status: "SCHEDULED",
      startTime: { lt: new Date(endTime) },
      endTime: { gt: new Date(startTime) },
    },
  });
  if (conflict)
    throw new Error("This slot was just booked. Please pick another.");

  // ── Create Stream call ─────────────────────────────────────────────────────
  let streamCallId;
};;
