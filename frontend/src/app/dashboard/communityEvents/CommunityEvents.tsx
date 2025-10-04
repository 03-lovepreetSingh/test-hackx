"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
export function CommunityEvents() {
  const [filter, setFilter] = useState('all')
  const events = [
    {
      id: 1,
      title: 'Blockchain Developer Summit',
      status: 'Upcoming',
      description:
        'Connect with leading blockchain developers and innovators in this two-day summit focused on the future of decentralized applications.',
      date: 'June 15-16, 2024',
      location: 'San Francisco, CA',
      participants: 350,
      registrationDays: 20,
      type: 'Conference',
      bannerGradient: 'from-[#0092ff] to-[#4ef467]',
      tags: ['Ethereum', 'Solana', 'Development'],
    },
    {
      id: 2,
      title: 'Web3 Community Meetup',
      status: 'Live',
      description:
        'Monthly gathering of Web3 enthusiasts to discuss the latest trends, share projects, and network with like-minded individuals.',
      date: 'May 20, 2024',
      location: 'New York, NY',
      participants: 120,
      registrationDays: 5,
      type: 'Meetup',
      bannerGradient: 'from-purple-500 to-pink-500',
      tags: ['Web3', 'Networking', 'Projects'],
    },
    {
      id: 3,
      title: 'DeFi Innovation Workshop',
      status: 'Live',
      description:
        'Hands-on workshop exploring innovative DeFi protocols and how to integrate them into your projects.',
      date: 'May 25, 2024',
      location: 'Online',
      participants: 200,
      registrationDays: 10,
      type: 'Workshop',
      bannerGradient: 'from-amber-500 to-red-500',
      tags: ['DeFi', 'Smart Contracts', 'Innovation'],
    },
    {
      id: 4,
      title: 'Crypto Security Conference',
      status: 'Upcoming',
      description:
        'Learn best practices for securing blockchain applications and protecting digital assets from industry experts.',
      date: 'July 8-10, 2024',
      location: 'London, UK',
      participants: 280,
      registrationDays: 30,
      type: 'Conference',
      bannerGradient: 'from-blue-700 to-indigo-500',
      tags: ['Security', 'Auditing', 'Best Practices'],
    },
    {
      id: 5,
      title: 'NFT Creator Showcase',
      status: 'Ended',
      description:
        'A showcase of innovative NFT projects with presentations from creators and artists pushing the boundaries of digital ownership.',
      date: 'April 5, 2024',
      location: 'Miami, FL',
      participants: 175,
      registrationDays: 0,
      type: 'Showcase',
      bannerGradient: 'from-gray-600 to-gray-800',
      tags: ['NFT', 'Digital Art', 'Creators'],
    },
    {
      id: 6,
      title: 'Blockchain Governance Forum',
      status: 'Upcoming',
      description:
        'Discussion forum on the evolution of governance models in blockchain projects and DAOs.',
      date: 'August 12, 2024',
      location: 'Berlin, Germany',
      participants: 150,
      registrationDays: 45,
      type: 'Forum',
      bannerGradient: 'from-green-600 to-teal-500',
      tags: ['Governance', 'DAOs', 'Policy'],
    },
  ]
  const filteredEvents =
    filter === 'all'
      ? events
      : events.filter((e) =>
          filter === 'live'
            ? e.status === 'Live'
            : filter === 'upcoming'
              ? e.status === 'Upcoming'
              : e.status === 'Ended',
        )
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Community Events</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949fa8]" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 pl-10 pr-4 text-sm text-[#949fa8] focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
          <button className="p-2 bg-[#1e1e24] border border-[#2a2a2e] rounded-md text-[#949fa8] hover:text-white">
            <Filter size={20} />
          </button>
        </div>
      </div>
      <div className="flex gap-2 border-b border-[#2a2a2e] pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('live')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'live' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Live
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'upcoming' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('ended')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'ended' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Ended
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs ${event.status === 'Live' ? 'bg-[#4ef467] text-black' : event.status === 'Upcoming' ? 'bg-[#0092ff] text-white' : 'bg-[#949fa8] text-black'} rounded`}
                  >
                    {event.status}
                  </span>
                </div>
                <span className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full">
                  {event.type}
                </span>
              </div>
              <p className="text-sm text-[#949fa8] mb-6">{event.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">
                    {event.participants} Attendees
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {event.status !== 'Ended' && (
                <div className="flex items-center">
                  <Link
                    href={`/community-events/${event.id}`}
                    className="bg-[#0092ff] text-white px-4 py-2 rounded-md flex items-center"
                  >
                    View Details
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                  {event.registrationDays > 0 && (
                    <div className="ml-4 flex items-center text-sm text-[#949fa8]">
                      <Clock size={16} className="mr-2" />
                      Registration closes in {event.registrationDays} days
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              className={`bg-gradient-to-r ${event.bannerGradient} p-6 flex justify-between items-center`}
            >
              <div>
                <div className="flex items-center">
                  <ExternalLink size={16} className="mr-2" />
                  <span className="font-medium">
                    {event.title.split(' ')[0]}
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-1">
                  {event.type.toUpperCase()}
                </h3>
                <div className="text-sm font-medium mt-1">
                  {event.tags[0]} Focus
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs">LOCATION</div>
                <div className="text-xl font-bold">
                  {event.location.split(',')[0]}
                </div>
                <div className="text-xs mt-2">{event.date.toUpperCase()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
