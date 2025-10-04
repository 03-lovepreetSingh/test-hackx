import React from 'react'
import { MoreHorizontal } from 'lucide-react'
interface EventDetails {
  name: string
  edition?: string
  focus?: string
  prize: string
  date: string
}
interface Event {
  id: number
  title: string
  status: string
  description: string
  daysLeft: number
  techStack: string
  level: string
  prize: string
  participants: number
  bannerUrl: string
  eventDetails: EventDetails
}
interface VotingCardProps {
  event: Event
}
export function VotingCard({ event }: VotingCardProps) {
  return (
    <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <span
              className={`ml-2 px-2 py-0.5 text-xs ${event.status === 'Voting' ? 'bg-[#4ef467]' : 'bg-[#4ef467]'} text-black rounded`}
            >
              {event.status}
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8]">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
        <p className="text-sm text-[#949fa8] mb-6">{event.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <div className="text-xs text-[#949fa8] mb-1">Voting close</div>
            <div className="text-sm">Voting {event.daysLeft} days left</div>
          </div>
          <div>
            <div className="text-xs text-[#949fa8] mb-1">Tech stack</div>
            <div className="text-sm">{event.techStack}</div>
          </div>
          <div>
            <div className="text-xs text-[#949fa8] mb-1">Level</div>
            <div className="text-sm">{event.level}</div>
          </div>
          <div>
            <div className="text-xs text-[#949fa8] mb-1">Total prize</div>
            <div className="text-sm">{event.prize}</div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full mr-3">
            Online
          </span>
          <span className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full mr-3">
            {event.participants} Participants
          </span>
          <span className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full">
            Judges Only
          </span>
        </div>
      </div>
      <div className="bg-black p-6 flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          {event.eventDetails.name && (
            <h3 className="text-xl font-bold">{event.eventDetails.name}</h3>
          )}
          {event.eventDetails.edition && (
            <div className="text-sm font-medium mt-1">
              {event.eventDetails.edition}
            </div>
          )}
          {event.eventDetails.focus && (
            <div className="text-sm mt-1">{event.eventDetails.focus}</div>
          )}
          <div className="text-sm mt-1">{event.eventDetails.prize}</div>
          <div className="text-xs mt-1">{event.eventDetails.date}</div>
        </div>
        <div
          className="absolute inset-0 opacity-30 bg-center bg-cover"
          style={{
            backgroundImage: `url(${event.bannerUrl})`,
          }}
        ></div>
      </div>
    </div>
  )
}
