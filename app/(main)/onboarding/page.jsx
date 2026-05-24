"use client";
import { GrayTitle, SectionLabel, GoldTitle } from "@/components/reusables";
import React, { useEffect, useState } from "react";

const OnboardingPage = () => {
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    yearsExp: "",
    bio: "",
    categories: [],
  });

  useEffect(() => {
    if (data && !loading) {
      router.push(role === "INTERVIEWER" ? "/dashboard" : "/explore");
    }
  }, [data, router]);

  return (
    <div className="min-h-screen  px-6 py-24 flex flex-col items-center ">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <SectionLabel>Welcome</SectionLabel>
          <h1 className="font-serif text-5xl leading-tight tracking-tighter mt-1">
            <GrayTitle>How will you be</GrayTitle>
            <br />
            <GoldTitle>using Prepty?</GoldTitle>
          </h1>
          <p className="text-sm text-stone-500 font-light mt-4 leading-relaxed">
            This helps us personalise your experience.
            <span className="text-stone-600">
              {" "}
              You can&apos;t change this later.
            </span>
          </p>
        </div>

        {!role && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {ONBOARDING_ROLES.map((r) => {
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className="text-left rounded-2xl p-8 border border-white/10 bg-[#0f0f11] hover:border-amber-400/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl mb-5">
                  {r.icon}
                </span>
                <h3 className="font-serif text-xl tracking-tight mb-3 text-stone-100">
                  {r.title}
                </h3>
                <p className="text-sm text-stone-400 font-light leading-relaxed">
                  {r.desc}
                </p>
              </button>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
