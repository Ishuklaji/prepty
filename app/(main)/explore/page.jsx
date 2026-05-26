import { getinterviewers } from '@/actions/explore';
import PageHeader from '@/components/reusables';
import React from 'react'
import ExploreGrid from './_components/ExploreGrid';

const ExplorePage = async () => {
  const interviewers = await getinterviewers();
  return (
    <main className="min-h-screen bg-black">
      {/* Page header */}
      <PageHeader
        label="Explore"
        gray="Find your"
        gold="expert interviewer"
        description="Browse senior expert engineers from top organizations."
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 xl:px-0 py-10">
        <ExploreGrid interviewers={interviewers} />
      </div>
    </main>
  );
}

export default ExplorePage
