'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '../../contexts/SessionContext';
import {
  Trophy,
  Users,
  Calendar,
  DollarSign,
  ArrowRight,
  Star,
  Clock,
  Award,
  TrendingUp,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  status: 'upcoming' | 'live' | 'completed';
  startDate: string;
  endDate: string;
  participants: number;
  projectsSubmitted: number;
  prizeCohorts: number;
  techStack: string[];
  prize: string;
  categories: string[];
  imageUrl?: string;
  organizer: string;
}

export default function JudgeDashboard() {
  const { user, loading: sessionLoading } = useSession();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    if (!sessionLoading && user?.role !== 'judge' && user?.role !== 'admin') {
      setError('Access denied. Judge role required.');
      setLoading(false);
      return;
    }

    fetchHackathons();
  }, [sessionLoading, user]);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first
      try {
        const response = await fetch('/api/hackathons');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setHackathons(data.data);
            setLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Fallback to mock data
      const mockHackathons: Hackathon[] = [
        {
          id: '1',
          title: 'ChainSpark Hackathon',
          description: 'ChainSpark Hackathon was born from a simple but radical belief: true innovation shouldn\'t be strangled by black-box algorithms or centralized gatekeepers.',
          status: 'live',
          startDate: '2024-10-12',
          endDate: '2024-10-16',
          participants: 405,
          projectsSubmitted: 3,
          prizeCohorts: 2,
          techStack: ['All tech stack'],
          prize: '$38,000',
          categories: ['Smart Contracts', 'Financial Inclusion'],
          organizer: 'ChainSpark',
          imageUrl: '/api/placeholder/400/200'
        },
        {
          id: '2',
          title: 'DeFi Innovation Challenge',
          description: 'Build the next generation of decentralized finance applications with cutting-edge protocols and innovative solutions.',
          status: 'upcoming',
          startDate: '2024-11-01',
          endDate: '2024-11-05',
          participants: 250,
          projectsSubmitted: 0,
          prizeCohorts: 3,
          techStack: ['Ethereum', 'Polygon', 'Arbitrum'],
          prize: '$50,000',
          categories: ['DeFi', 'Smart Contracts'],
          organizer: 'DeFi Alliance'
        },
        {
          id: '3',
          title: 'Web3 Gaming Hackathon',
          description: 'Create immersive gaming experiences powered by blockchain technology and NFT integration.',
          status: 'completed',
          startDate: '2024-09-15',
          endDate: '2024-09-19',
          participants: 180,
          projectsSubmitted: 12,
          prizeCohorts: 2,
          techStack: ['Unity', 'Web3.js', 'Ethereum'],
          prize: '$25,000',
          categories: ['Gaming', 'NFTs'],
          organizer: 'GameFi Labs'
        }
      ];

      setHackathons(mockHackathons);
    } catch (err) {
      console.error('Error fetching hackathons:', err);
      setError('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  };

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hackathon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0092ff] mx-auto mb-4"></div>
          <p className="text-[#949fa8]">Loading judge dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 mb-4">Access Denied</p>
          <p className="text-[#6b7280] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-[#16161b] border-b border-[#2a2a2e] py-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Judge Dashboard</h1>
            <p className="text-[#949fa8]">Review and rate hackathon projects</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-[#949fa8]">Welcome back,</p>
              <p className="text-white font-medium">{user?.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#16161b] border-b border-[#2a2a2e] py-4 px-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949fa8]" />
            <input
              type="text"
              placeholder="Search hackathons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1e1e24] border border-[#2a2a2e] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-[#1e1e24] border border-[#2a2a2e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0092ff]"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hackathons List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Hackathons to Judge</h2>
            
            {filteredHackathons.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-[#6b7280] mx-auto mb-4" />
                <p className="text-[#949fa8]">No hackathons found</p>
              </div>
            ) : (
              filteredHackathons.map((hackathon) => (
                <div key={hackathon.id} className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6 hover:border-[#3a3a3e] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{hackathon.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hackathon.status === 'live' ? 'bg-green-900/20 text-green-400' :
                          hackathon.status === 'upcoming' ? 'bg-blue-900/20 text-blue-400' :
                          'bg-gray-900/20 text-gray-400'
                        }`}>
                          {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-[#949fa8] text-sm mb-4 line-clamp-2">{hackathon.description}</p>
                    </div>
                    <button className="text-[#6b7280] hover:text-white p-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{hackathon.participants}</div>
                      <div className="text-xs text-[#949fa8]">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{hackathon.projectsSubmitted}</div>
                      <div className="text-xs text-[#949fa8]">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{hackathon.prizeCohorts}</div>
                      <div className="text-xs text-[#949fa8]">Prize Cohorts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{hackathon.techStack.length}</div>
                      <div className="text-xs text-[#949fa8]">Tech Stack</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#4ef467]" />
                      <span className="text-[#4ef467] font-semibold">{hackathon.prize}</span>
                    </div>
                    <Link
                      href={`/dashboard/judge/hackathons/${hackathon.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] transition-colors"
                    >
                      Go to judging
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
            
            {/* Featured Hackathon Card */}
            {hackathons.length > 0 && (
              <div className="bg-gradient-to-br from-[#0092ff]/10 to-[#4ef467]/10 border border-[#2a2a2e] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0092ff] rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Featured Hackathon</h3>
                    <p className="text-[#949fa8] text-sm">Currently Active</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-1">{hackathons[0]?.title}</h4>
                  <p className="text-[#949fa8] text-sm mb-2">{hackathons[0]?.categories.join(' & ')}</p>
                  <p className="text-[#6b7280] text-xs">{hackathons[0]?.organizer}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">{hackathons[0]?.prize}</div>
                  <div className="text-[#949fa8] text-sm">{hackathons[0]?.startDate} - {hackathons[0]?.endDate}</div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-[#0092ff]" />
                  <span className="text-sm text-[#949fa8]">Total Participants</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {hackathons.reduce((sum, h) => sum + h.participants, 0)}
                </div>
              </div>

              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-5 w-5 text-[#4ef467]" />
                  <span className="text-sm text-[#949fa8]">Projects to Review</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {hackathons.reduce((sum, h) => sum + h.projectsSubmitted, 0)}
                </div>
              </div>

              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-[#ff6b35]" />
                  <span className="text-sm text-[#949fa8]">Active Hackathons</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {hackathons.filter(h => h.status === 'live').length}
                </div>
              </div>

              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-[#ffd700]" />
                  <span className="text-sm text-[#949fa8]">Upcoming</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {hackathons.filter(h => h.status === 'upcoming').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}