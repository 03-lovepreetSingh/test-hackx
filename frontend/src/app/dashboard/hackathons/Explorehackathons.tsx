"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  ArrowRight,
  Link as LinkIcon,
  Calendar,
  MapPin,
  Users,
  Award,
  Clock,
  RefreshCw,
  Plus,
} from 'lucide-react'
export function ExploreHackathons() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchHackathons = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/hackathons-simple')
      const result = await response.json()

      if (result.success) {
        setHackathons(result.data || [])
      } else {
        setError(result.error || 'Failed to fetch hackathons')
        // Use fallback data on error
        setHackathons([])
      }
    } catch (err) {
      console.error('Error fetching hackathons:', err)
      setError('Network error. Using fallback data.')
      setHackathons([])
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    fetchHackathons()
  }

  // Initial fetch
  React.useEffect(() => {
    fetchHackathons()
  }, [])

  // Fallback mock data for demo purposes
  const mockHackathons = [
    {
      id: '1',
      title: 'Web3 Innovate Jam',
      status: 'live' as const,
      description: 'The Web3 Innovate Jam is designed to inspire developers, designers, and innovators to build innovative applications that integrate blockchain technology.',
      registrationClose: '2024-05-12',
      registrationDaysLeft: 12,
      techStack: 'Web3, Blockchain, DeFi',
      level: 'All levels',
      totalPrize: 30000,
      location: 'Online',
      tags: ['Web3', 'Blockchain', 'DeFi'],
    },
    {
      id: '2',
      title: 'Coindora Hackfest',
      status: 'live' as const,
      description: 'Coindora Hackfest is a premier event for blockchain enthusiasts to collaborate and build innovative solutions for real-world problems.',
      registrationClose: '2024-09-08',
      registrationDaysLeft: 20,
      techStack: 'Crypto, Smart Contracts, NFT',
      level: 'All levels',
      totalPrize: 35000,
      location: 'Hybrid',
      tags: ['Crypto', 'Smart Contracts', 'NFT'],
    },
  ]

  // Combine API data with fallback mock data
  const allHackathons = hackathons.length > 0 ? [...hackathons, ...mockHackathons] : mockHackathons
  const filteredHackathons = allHackathons.filter((h) => {
    const matchesFilter = filter === 'all' || 
      (filter === 'live' && h.status === 'live') ||
      (filter === 'upcoming' && h.status === 'live' && h.registrationDaysLeft > 0) ||
      (filter === 'ended' && h.status === 'ended')
    
    const matchesSearch = !searchTerm || 
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesFilter && matchesSearch
  })
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Explore Hackathons</h1>
          {loading && <RefreshCw className="h-5 w-5 animate-spin text-[#0092ff]" />}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Link
            href="/create-hackathon"
            className="bg-[#0092ff] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#0080dd] transition-colors justify-center"
          >
            <Plus size={16} className="mr-2" />
            Create New Hackathon
          </Link>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949fa8]" />
              <input
                type="text"
                placeholder="Search hackathons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 pl-10 pr-4 text-sm text-[#949fa8] focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
              />
            </div>
            <button
              onClick={refresh}
              className="p-2 bg-[#1e1e24] border border-[#2a2a2e] rounded-md text-[#949fa8] hover:text-white"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2 bg-[#1e1e24] border border-[#2a2a2e] rounded-md text-[#949fa8] hover:text-white">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Error loading hackathons: {error}</p>
          <button 
            onClick={refresh}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}
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
        {filteredHackathons.map((hackathon) => (
          <div
            key={hackathon.id}
            className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">{hackathon.title}</h3>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs ${
                      hackathon.status === 'live' 
                        ? 'bg-[#4ef467] text-black' 
                        : hackathon.status === 'voting'
                        ? 'bg-[#0092ff] text-white'
                        : 'bg-[#949fa8] text-black'
                    } rounded`}
                  >
                    {hackathon.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#949fa8] mb-6">
                {hackathon.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">{hackathon.registrationClose}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">{hackathon.location}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">
                    {hackathon.registrationDaysLeft} days left
                  </span>
                </div>
                <div className="flex items-center">
                  <Award size={16} className="mr-2 text-[#949fa8]" />
                  <span className="text-sm">${hackathon.totalPrize.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {hackathon.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {hackathon.status !== 'ended' ? (
                <div className="flex items-center">
                  <Link
                    href={`/dashboard/hackathons/${hackathon.slug || hackathon.id}`}
                    className="bg-[#0092ff] text-white px-4 py-2 rounded-md flex items-center"
                  >
                    {hackathon.status === 'live'
                      ? 'Register Now'
                      : 'Get Notified'}
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                  {hackathon.registrationDaysLeft > 0 && (
                    <div className="ml-4 flex items-center text-sm text-[#949fa8]">
                      <Clock size={16} className="mr-2" />
                      Registration closes in {hackathon.registrationDaysLeft} days
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/explore/${hackathon.id}`}
                  className="bg-[#1e1e24] text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-[#2a2a2e]"
                >
                  View Details
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              )}
            </div>
            <div className="bg-gradient-to-r from-[#0092ff] to-[#4ef467] p-6 flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <LinkIcon size={16} className="mr-2" />
                  <span className="font-medium">
                    {hackathon.title.split(' ')[0]}
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-1">HACKATHON</h3>
                <div className="text-sm font-medium mt-1">
                  {hackathon.tags?.[0] || 'Tech'} Edition
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs">PRIZE</div>
                <div className="text-2xl font-bold">${hackathon.totalPrize.toLocaleString()}</div>
                <div className="text-xs mt-2">
                  {hackathon.registrationClose?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
