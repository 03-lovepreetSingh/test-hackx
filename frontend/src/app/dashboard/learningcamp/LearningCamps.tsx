"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Calendar,
  Clock,
  BookOpen,
  BarChart,
  ArrowRight,
  Users,
} from 'lucide-react'
export function LearningCamps() {
  const [filter, setFilter] = useState('all')
  const camps = [
    {
      id: 1,
      title: 'Ethereum Developer Bootcamp',
      status: 'Enrolling',
      description:
        'A comprehensive 8-week bootcamp covering Ethereum development from basics to advanced smart contract programming.',
      startDate: 'June 1, 2024',
      duration: '8 weeks',
      difficulty: 'Intermediate',
      students: 120,
      enrollmentDays: 15,
      bannerGradient: 'from-[#0092ff] to-[#4ef467]',
      tags: ['Ethereum', 'Solidity', 'Smart Contracts'],
      instructor: 'Alex Rivera',
    },
    {
      id: 2,
      title: 'Blockchain Fundamentals',
      status: 'Enrolling',
      description:
        'Learn the core concepts of blockchain technology, cryptography, and distributed systems in this beginner-friendly course.',
      startDate: 'May 25, 2024',
      duration: '4 weeks',
      difficulty: 'Beginner',
      students: 200,
      enrollmentDays: 10,
      bannerGradient: 'from-purple-500 to-pink-500',
      tags: ['Blockchain', 'Cryptography', 'Fundamentals'],
      instructor: 'Sarah Chen',
    },
    {
      id: 3,
      title: 'DeFi Protocols Masterclass',
      status: 'In Progress',
      description:
        'Deep dive into decentralized finance protocols, liquidity pools, yield farming, and DeFi security considerations.',
      startDate: 'April 15, 2024',
      duration: '6 weeks',
      difficulty: 'Advanced',
      students: 85,
      enrollmentDays: 0,
      bannerGradient: 'from-amber-500 to-red-500',
      tags: ['DeFi', 'Liquidity', 'Yield Farming'],
      instructor: 'Michael Johnson',
    },
    {
      id: 4,
      title: 'NFT Creation Workshop',
      status: 'Enrolling',
      description:
        'Learn to create, mint, and market your own NFT collections with hands‑on guidance from successful NFT artists.',
      startDate: 'June 10, 2024',
      duration: '3 weeks',
      difficulty: 'Beginner',
      students: 150,
      enrollmentDays: 20,
      bannerGradient: 'from-blue-700 to-indigo-500',
      tags: ['NFT', 'Digital Art', 'Minting'],
      instructor: 'Elena Rodriguez',
    },
    {
      id: 5,
      title: 'Solana Development Intensive',
      status: 'Completed',
      description:
        'An intensive program covering Solana architecture, and building high‑performance dApps on the Solana blockchain.',
      startDate: 'February 5, 2024',
      duration: '10 weeks',
      difficulty: 'Advanced',
      students: 70,
      enrollmentDays: 0,
      bannerGradient: 'from-gray-600 to-gray-800',
      tags: ['Solana', 'Rust', 'Performance'],
      instructor: 'David Kim',
    },
    {
      id: 6,
      title: 'Web3 for Frontend Developers',
      status: 'In Progress',
      description:
        'Bridge the gap between traditional frontend development and Web3 technologies with practical projects and real‑world examples.',
      startDate: 'April 20, 2024',
      duration: '5 weeks',
      difficulty: 'Intermediate',
      students: 110,
      enrollmentDays: 0,
      bannerGradient: 'from‑green‑600 to‑teal‑500',
      tags: ['Web3', 'Frontend', 'dApps'],
      instructor: 'Priya Sharma',
    },
  ]
  const filteredCamps =
    filter === 'all'
      ? camps
      : filter === 'beginner'
        ? camps.filter((c) => c.difficulty === 'Beginner')
        : filter === 'intermediate'
          ? camps.filter((c) => c.difficulty === 'Intermediate')
          : camps.filter((c) => c.difficulty === 'Advanced')
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Learning Camps</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949fa8]" />
            <input
              type="text"
              placeholder="Search learning camps..."
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
          All Levels
        </button>
        <button
          onClick={() => setFilter('beginner')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'beginner' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Beginner
        </button>
        <button
          onClick={() => setFilter('intermediate')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'intermediate' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Intermediate
        </button>
        <button
          onClick={() => setFilter('advanced')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'advanced' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Advanced
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCamps.map((camp) => (
          <div
            key={camp.id}
            className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">{camp.title}</h3>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs ${camp.status === 'Enrolling' ? 'bg-[#4ef467] text-black' : camp.status === 'In Progress' ? 'bg-[#0092ff] text-white' : 'bg-[#949fa8] text-black'} rounded`}
                  >
                    {camp.status}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded ${camp.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' : camp.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}
                >
                  {camp.difficulty}
                </span>
              </div>
              <p className="text-sm text-[#949fa8] mb-6">{camp.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">Starts: {camp.startDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">Duration: {camp.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">{camp.students} Students</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {camp.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {camp.status !== 'Completed' && (
                <div className="flex items-center">
                  <Link
                    href={`/learning-camps/${camp.id}`}
                    className="bg-[#0092ff] text-white px-4 py-2 rounded-md flex items-center"
                  >
                    {camp.status === 'Enrolling'
                      ? 'Enroll Now'
                      : 'View Details'}
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                  {camp.enrollmentDays > 0 && (
                    <div className="ml-4 flex items-center text-sm text-[#949fa8]">
                      <Clock size={16} className="mr-2" />
                      Enrollment closes in {camp.enrollmentDays} days
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              className={`bg-gradient-to-r ${camp.bannerGradient} p-6 flex justify-between items-center`}
            >
              <div>
                <div className="flex items-center">
                  <BookOpen size={16} className="mr-2" />
                  <span className="font-medium">
                    {camp.title.split(' ')[0]}
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-1">LEARNING CAMP</h3>
                <div className="text-sm font-medium mt-1">
                  Instructor: {camp.instructor}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs">DIFFICULTY</div>
                <div className="text-xl font-bold">{camp.difficulty}</div>
                <div className="text-xs mt-2">
                  {camp.duration.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
