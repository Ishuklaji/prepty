import { getInterviewerProfile } from "@/actions/booking";
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
const InterviewerProfilePage = async ({ params }) => {
  const { id } = await params;

  const interviewer = await getInterviewerProfile(id);
  if (!interviewer) notFound();

  return (
    <main className="min-h-screen bg-black">
      {/* ── Hero identity banner ── */}
      <section className="relative border-b border-white/8 overflow-hidden">
        <StarsBackgroundDemo />
        <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-14 flex flex-col gap-8">
          <Link href="/explore">
            <Button variant="link" className="text-stone-500 cursor-pointer">
              <ArrowLeft size={13} />
              Back to explore
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default InterviewerProfilePage;
