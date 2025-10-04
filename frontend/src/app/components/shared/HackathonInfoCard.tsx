import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Calendar, MapPin, Users, Clock, Award, Code, X, MessageCircle } from 'lucide-react';
import { HackathonDetail } from '../../data/hackathons';
import { CountdownTimer } from './CountdownTimer';
interface HackathonInfoCardProps {
  hackathon?: HackathonDetail;
}
export function HackathonInfoCard({
  hackathon
}: HackathonInfoCardProps) {
  if (!hackathon) {
    return null;
  }
  return <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Left to register</p>
        <CountdownTimer daysLeft={hackathon.registrationDaysLeft} />
      </div>
      <div className="my-4">
        <Link href={`/hackathons/${hackathon.id}/register`}>
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Register to Hackathon
          </Button>
        </Link>
      </div>
      <div className="border-t border-[#2a2a2a] py-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Registration</span>
          <span className="text-sm">
            {hackathon.registrationDaysLeft} days left
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Tech stack</span>
          <span className="text-sm">{hackathon.techStack}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Level</span>
          <span className="text-sm">All levels</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total Prize</span>
          <span className="text-sm">
            ${hackathon.totalPrize.toLocaleString()} USD
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Location</span>
          <span className="text-sm">{hackathon.location}</span>
        </div>
      </div>
      <div className="border-t border-[#2a2a2a] py-4">
        <p className="text-sm text-gray-400 mb-3">Links</p>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
            <X className="h-4 w-4" />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
            <MessageCircle className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="border-t border-[#2a2a2a] pt-4">
        <p className="text-sm font-medium mb-3">Project Quests</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Join Telegram Group</p>
              <p className="text-xs text-blue-400">Join Community</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Follow Tech Fairness Hackathon on X</p>
              <p className="text-xs text-blue-400">Follow on X</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Join Tech Fairness Hackathon on Discord</p>
              <p className="text-xs text-blue-400">Join Discord</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}