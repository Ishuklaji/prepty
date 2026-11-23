"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { StreamClient } from "@stream-io/node-sdk";

export const getCallData = async (callId) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const booking = await db.booking.findUnique({
    where: { streamCallId: callId },
    include: {
      interviewer: {
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          imageUrl: true,
          categories: true,
        },
      },
      interviewee: {
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!booking) return { error: "Call not found" };

  const isInterviewer = booking.interviewer.clerkUserId === user.id;
  const isInterviewee = booking.interviewee.clerkUserId === user.id;
  if (!isInterviewer && !isInterviewee) return { error: "Forbidden" };

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_SECRET_KEY,
  );

  const token = streamClient.generateUserToken({
    user_id: user.id,
    validity_in_seconds: 60 * 60,
  });

  return {
    token,
    isInterviewer,
    currentUser: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      imageUrl: user.imageUrl,
    },
    booking: {
      id: booking.id,
      interviewer: booking.interviewer,
      interviewee: booking.interviewee,
      categories: booking.interviewer.categories,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
    },
  };
};

// ─── Fresh recording link ────────────────────────────────────────────────────
// Stream recording URLs are signed and expire, so the URL saved by the
// webhook stops working (AccessDenied). Ask Stream for a fresh signed URL
// each time the user opens a recording.
export const getRecordingUrl = async (bookingId) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      streamCallId: true,
      interviewer: { select: { clerkUserId: true } },
      interviewee: { select: { clerkUserId: true } },
    },
  });

  if (!booking?.streamCallId) return { error: "Recording not found" };
  if (
    booking.interviewer.clerkUserId !== user.id &&
    booking.interviewee.clerkUserId !== user.id
  )
    return { error: "Forbidden" };

  try {
    const streamClient = new StreamClient(
      process.env.NEXT_PUBLIC_STREAM_API_KEY,
      process.env.STREAM_SECRET_KEY,
    );
    const { recordings } = await streamClient.video
      .call("default", booking.streamCallId)
      .listRecordings();

    // Newest first; skip files Stream has already purged
    const sorted = [...(recordings ?? [])].sort(
      (a, b) => new Date(b.start_time) - new Date(a.start_time),
    );
    for (const rec of sorted) {
      const res = await fetch(rec.url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
      });
      if (res.ok) return { url: rec.url };
    }

    return {
      error: "This recording has expired and is no longer available.",
    };
  } catch (error) {
    console.error("getRecordingUrl error:", error);
    return { error: "Could not load the recording. Please try again." };
  }
};
