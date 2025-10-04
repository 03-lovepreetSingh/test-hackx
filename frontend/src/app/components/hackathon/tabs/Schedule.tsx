import React from 'react';
import { HackathonInfoCard } from '../../shared/HackathonInfoCard';
import { Badge } from '../../ui/badge';
interface ScheduleEventProps {
  date: string;
  isActive?: boolean;
  isLive?: boolean;
  children: React.ReactNode;
}
function ScheduleEvent({
  date,
  isActive,
  isLive,
  children
}: ScheduleEventProps) {
  return <div className={`border-l-2 ${isActive ? 'border-blue-500' : 'border-[#2a2a2a]'} pl-6 pb-12 relative`}>
      {isLive && <div className="absolute -left-[5px] -translate-x-1/2 top-0 h-2.5 w-2.5 rounded-full bg-green-500" />}
      <div className="absolute -left-[5px] -translate-x-1/2 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#2a2a2a] bg-[#1a1a1a]" />
      <div className="mb-2 flex items-center">
        <div className="text-sm">{date}</div>
        {isLive && <Badge variant="live" className="ml-2">
            Live
          </Badge>}
      </div>
      <div className="text-gray-300">{children}</div>
    </div>;
}
export function ScheduleTab() {
  return <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="max-w-3xl mx-auto">
          <ScheduleEvent date="Jun 17, 2025 19:00 - Jul 19, 2025 19:00">
            <h3 className="font-medium">Registration</h3>
          </ScheduleEvent>
          <ScheduleEvent date="Jun 26, 2025 15:00">
            <h3 className="font-medium">Kickoff Event</h3>
            <p className="text-sm mt-1">
              Join us for the virtual kickoff where we'll explain the hackathon
              themes, prizes, and answer your questions.
            </p>
          </ScheduleEvent>
          <ScheduleEvent date="Jun. 28, 2025; 15:00" isActive isLive>
            <h3 className="font-medium">
              Workshop: Building for Tech Fairness
            </h3>
            <p className="text-sm mt-1">
              Learn about the core principles of tech fairness and how to
              incorporate them into your projects. We'll cover data sovereignty,
              algorithmic transparency, and sustainable creator economies.
            </p>
          </ScheduleEvent>
          <ScheduleEvent date="Jun. 30, 2025; 15:00">
            <h3 className="font-medium">Office Hours with Judges</h3>
            <p className="text-sm mt-1">
              Get feedback on your project ideas and ask questions directly to
              our panel of judges.
            </p>
          </ScheduleEvent>
          <ScheduleEvent date="Jul 19, 2025 19:00 - Jul 30, 2025 19:00">
            <h3 className="font-medium">Project Submissions</h3>
            <p className="text-sm mt-1">
              Submit your completed projects for judging. Make sure to include a
              demo video and comprehensive documentation.
            </p>
          </ScheduleEvent>
          <ScheduleEvent date="Aug 3, 2025 19:00">
            <h3 className="font-medium">Winners Announcement</h3>
            <p className="text-sm mt-1">
              Join us for the live announcement of winners across all
              categories.
            </p>
          </ScheduleEvent>
        </div>
      </div>
      <div>
        <HackathonInfoCard />
      </div>
    </div>;
}