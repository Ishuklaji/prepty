"use server";

export const getinterviewers = async () => {
  try {
    const interviewers = await db.user.findMany({
      where: {
        role: "INTERVIEWER",
        // Exclude the logged-in user so an interviewer
        // browsing explore doesn't see themselves
        ...(user && { clerkUserId: { not: user.id } }),
      },
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
      },
      orderBy: { createdAt: "desc" },
    });

    return interviewers;
  } catch (error) {
    console.error("Error fetching interviewers:", error);
    return [];
  }
};
