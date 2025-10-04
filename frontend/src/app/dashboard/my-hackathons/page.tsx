'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '../../contexts/SessionContext';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  Calendar,
  DollarSign,
  Trophy,
  Settings,
  UserPlus,
  Mail,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  participants: number;
  projectsSubmitted: number;
  judges: number;
  prizePool: string;
  categories: string[];
  techStack: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  judgesList: {
    id: string;
    name: string;
    email: string;
    status: 'invited' | 'accepted' | 'declined';
    invitedAt: string;
    acceptedAt?: string;
  }[];
}

export default function MyHackathonsPage() {
  const { user, loading: sessionLoading } = useSession();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled'>('all');
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [showJudgeModal, setShowJudgeModal] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !user) {
      setError('Please log in to view your hackathons.');
      setLoading(false);
      return;
    }

    if (!sessionLoading && user) {
      fetchMyHackathons();
    }
  }, [sessionLoading, user]);

  const fetchMyHackathons = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first
      try {
        const userId = user?.id || '1'; // Use current user's ID
        const response = await fetch(`/api/my-hackathons?userId=${userId}`);
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

      // Fallback to mock data - filter by current user
      const allMockHackathons: Hackathon[] = [
        {
          id: '1',
          title: 'ChainSpark Hackathon',
          description: 'ChainSpark Hackathon was born from a simple but radical belief: true innovation shouldn\'t be strangled by black-box algorithms or centralized gatekeepers.',
          status: 'live',
          startDate: '2024-10-12',
          endDate: '2024-10-16',
          participants: 405,
          projectsSubmitted: 3,
          judges: 5,
          prizePool: '$38,000',
          categories: ['Smart Contracts', 'Financial Inclusion'],
          techStack: ['All tech stack'],
          createdAt: '2024-09-01',
          updatedAt: '2024-10-15',
          creatorId: '1',
          creatorName: 'Alice Johnson',
          creatorEmail: 'alice@example.com',
          judgesList: [
            {
              id: '1',
              name: 'Alice Johnson',
              email: 'alice@example.com',
              status: 'accepted',
              invitedAt: '2024-09-15',
              acceptedAt: '2024-09-16'
            },
            {
              id: '2',
              name: 'Bob Smith',
              email: 'bob@example.com',
              status: 'accepted',
              invitedAt: '2024-09-15',
              acceptedAt: '2024-09-17'
            },
            {
              id: '3',
              name: 'Carol Davis',
              email: 'carol@example.com',
              status: 'invited',
              invitedAt: '2024-10-01'
            }
          ]
        },
        {
          id: '2',
          title: 'DeFi Innovation Challenge',
          description: 'Build the next generation of decentralized finance applications with cutting-edge protocols and innovative solutions.',
          status: 'upcoming',
          startDate: '2024-11-01',
          endDate: '2024-11-05',
          participants: 0,
          projectsSubmitted: 0,
          judges: 3,
          prizePool: '$50,000',
          categories: ['DeFi', 'Smart Contracts'],
          techStack: ['Ethereum', 'Polygon', 'Arbitrum'],
          createdAt: '2024-10-01',
          updatedAt: '2024-10-15',
          creatorId: '1',
          creatorName: 'Alice Johnson',
          creatorEmail: 'alice@example.com',
          judgesList: [
            {
              id: '4',
              name: 'David Wilson',
              email: 'david@example.com',
              status: 'accepted',
              invitedAt: '2024-10-05',
              acceptedAt: '2024-10-06'
            }
          ]
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
          judges: 4,
          prizePool: '$25,000',
          categories: ['Gaming', 'NFTs'],
          techStack: ['Unity', 'Web3.js', 'Ethereum'],
          createdAt: '2024-08-01',
          updatedAt: '2024-09-20',
          creatorId: '2',
          creatorName: 'Bob Smith',
          creatorEmail: 'bob@example.com',
          judgesList: [
            {
              id: '5',
              name: 'Eva Brown',
              email: 'eva@example.com',
              status: 'accepted',
              invitedAt: '2024-08-15',
              acceptedAt: '2024-08-16'
            }
          ]
        },
        {
          id: '4',
          title: 'AI & Machine Learning Challenge',
          description: 'Build innovative AI solutions using cutting-edge machine learning algorithms and frameworks.',
          status: 'draft',
          startDate: '2024-12-01',
          endDate: '2024-12-05',
          participants: 0,
          projectsSubmitted: 0,
          judges: 0,
          prizePool: '$30,000',
          categories: ['AI', 'Machine Learning', 'Data Science'],
          techStack: ['Python', 'TensorFlow', 'PyTorch'],
          createdAt: '2024-11-01',
          updatedAt: '2024-11-15',
          creatorId: '3',
          creatorName: 'Carol Davis',
          creatorEmail: 'carol@example.com',
          judgesList: []
        }
      ];

      // Filter hackathons by current user
      const currentUserId = user?.id || '1';
      const userHackathons = allMockHackathons.filter(hackathon => hackathon.creatorId === currentUserId);
      setHackathons(userHackathons);
    } catch (err) {
      console.error('Error fetching hackathons:', err);
      setError('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  };

  const filteredHackathons = hackathons.filter(hackathon => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      hackathon.title.toLowerCase().includes(searchLower) ||
      hackathon.description.toLowerCase().includes(searchLower) ||
      hackathon.status.toLowerCase().includes(searchLower) ||
      hackathon.prizePool.toLowerCase().includes(searchLower) ||
      hackathon.categories.some(cat => cat.toLowerCase().includes(searchLower)) ||
      hackathon.techStack.some(tech => tech.toLowerCase().includes(searchLower)) ||
      hackathon.judgesList.some(judge => 
        judge.name.toLowerCase().includes(searchLower) || 
        judge.email.toLowerCase().includes(searchLower)
      );
    const matchesStatus = statusFilter === 'all' || hackathon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-900/20 text-green-400';
      case 'upcoming': return 'bg-blue-900/20 text-blue-400';
      case 'completed': return 'bg-gray-900/20 text-gray-400';
      case 'draft': return 'bg-yellow-900/20 text-yellow-400';
      case 'cancelled': return 'bg-red-900/20 text-red-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="h-4 w-4" />;
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0092ff] mx-auto mb-4"></div>
          <p className="text-[#949fa8]">Loading your hackathons...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">My Hackathons</h1>
            <p className="text-[#949fa8]">Manage your hackathons and judges</p>
          </div>
          <Link
            href="/create-hackathon"
            className="flex items-center gap-2 px-4 py-2 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Hackathon
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#16161b] border-b border-[#2a2a2e] py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#949fa8]" />
              <input
                type="text"
                placeholder="Search your hackathons by title, description, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1e1e24] border border-[#2a2a2e] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 bg-[#1e1e24] border border-[#2a2a2e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-all min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-3 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-[#949fa8] hover:text-white hover:bg-[#3a3a3e] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Results Summary */}
          {hackathons.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-[#949fa8]">
              <div>
                Showing {filteredHackathons.length} of {hackathons.length} hackathons
                {searchTerm && (
                  <span> for "{searchTerm}"</span>
                )}
                {statusFilter !== 'all' && (
                  <span> with status "{statusFilter}"</span>
                )}
              </div>
              {filteredHackathons.length !== hackathons.length && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="text-[#0092ff] hover:text-[#0080e6] transition-colors"
                >
                  Show all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      {hackathons.length > 0 && (
        <div className="bg-[#16161b] border-b border-[#2a2a2e] py-4 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{hackathons.length}</div>
                <div className="text-sm text-[#949fa8]">Total Hackathons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#4ef467]">
                  {hackathons.filter(h => h.status === 'live').length}
                </div>
                <div className="text-sm text-[#949fa8]">Live</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0092ff]">
                  {hackathons.reduce((sum, h) => sum + h.participants, 0)}
                </div>
                <div className="text-sm text-[#949fa8]">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ffd700]">
                  {hackathons.reduce((sum, h) => sum + h.judges, 0)}
                </div>
                <div className="text-sm text-[#949fa8]">Total Judges</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {filteredHackathons.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-[#0092ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-12 w-12 text-[#0092ff]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {hackathons.length === 0 ? 'No hackathons yet' : 'No hackathons found'}
              </h3>
              <p className="text-[#949fa8] mb-8 leading-relaxed">
                {hackathons.length === 0 
                  ? 'Start your journey as a hackathon organizer! Create your first hackathon and bring together developers, designers, and innovators to build amazing projects.'
                  : 'Try adjusting your search or filter to find what you\'re looking for.'
                }
              </p>
              <div className="space-y-4">
                <Link
                  href="/create-hackathon"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] transition-colors font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Hackathon
                </Link>
                {hackathons.length > 0 && (
                  <div className="text-sm text-[#6b7280]">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                      className="text-[#0092ff] hover:text-[#0080e6] transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
              <div key={hackathon.id} className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6 hover:border-[#3a3a3e] transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{hackathon.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(hackathon.status)}`}>
                        {getStatusIcon(hackathon.status)}
                        {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-[#949fa8] text-sm mb-3 line-clamp-2">{hackathon.description}</p>
                  </div>
                  <button className="text-[#6b7280] hover:text-white p-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{hackathon.participants}</div>
                    <div className="text-xs text-[#949fa8]">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{hackathon.projectsSubmitted}</div>
                    <div className="text-xs text-[#949fa8]">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{hackathon.judges}</div>
                    <div className="text-xs text-[#949fa8]">Judges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#4ef467]">{hackathon.prizePool}</div>
                    <div className="text-xs text-[#949fa8]">Prize Pool</div>
                  </div>
                </div>

                {/* Judges Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#949fa8]">Judges</span>
                    <span className="text-white">{hackathon.judgesList.filter(j => j.status === 'accepted').length}/{hackathon.judgesList.length}</span>
                  </div>
                  <div className="flex -space-x-2">
                    {hackathon.judgesList.slice(0, 3).map((judge, index) => (
                      <div
                        key={judge.id}
                        className={`w-8 h-8 rounded-full border-2 border-[#1b1b1e] flex items-center justify-center text-xs font-medium ${
                          judge.status === 'accepted' ? 'bg-[#4ef467] text-black' :
                          judge.status === 'invited' ? 'bg-[#ffd700] text-black' :
                          'bg-[#6b7280] text-white'
                        }`}
                        title={`${judge.name} (${judge.status})`}
                      >
                        {judge.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {hackathon.judgesList.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#1b1b1e] bg-[#2a2a2e] flex items-center justify-center text-xs text-[#949fa8]">
                        +{hackathon.judgesList.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/hackathons/${hackathon.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#2a2a2e] text-[#949fa8] rounded-lg hover:bg-[#3a3a3e] hover:text-white transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedHackathon(hackathon);
                      setShowJudgeModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] transition-colors text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Manage Judges
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Judge Management Modal */}
      {showJudgeModal && selectedHackathon && (
        <JudgeManagementModal
          hackathon={selectedHackathon}
          onClose={() => {
            setShowJudgeModal(false);
            setSelectedHackathon(null);
          }}
          onUpdate={fetchMyHackathons}
        />
      )}
    </div>
  );
}

// Judge Management Modal Component
interface JudgeManagementModalProps {
  hackathon: Hackathon;
  onClose: () => void;
  onUpdate: () => void;
}

function JudgeManagementModal({ hackathon, onClose, onUpdate }: JudgeManagementModalProps) {
  const [judges, setJudges] = useState(hackathon.judgesList);
  const [newJudgeEmail, setNewJudgeEmail] = useState('');
  const [newJudgeName, setNewJudgeName] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');

  const handleInviteJudge = async () => {
    if (!newJudgeEmail.trim() || !newJudgeName.trim()) {
      alert('Please fill in both name and email');
      return;
    }

    try {
      setIsInviting(true);
      
      const response = await fetch('/api/hackathons/invite-judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hackathonId: hackathon.id,
          hackathonTitle: hackathon.title,
          judgeName: newJudgeName,
          judgeEmail: newJudgeEmail,
          message: inviteMessage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Add to local state
          const newJudge = {
            id: Date.now().toString(),
            name: newJudgeName,
            email: newJudgeEmail,
            status: 'invited' as const,
            invitedAt: new Date().toISOString()
          };
          setJudges(prev => [...prev, newJudge]);
          setNewJudgeEmail('');
          setNewJudgeName('');
          setInviteMessage('');
          alert('Judge invitation sent successfully!');
        } else {
          alert('Failed to send invitation: ' + data.error);
        }
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Error inviting judge:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveJudge = async (judgeId: string) => {
    if (confirm('Are you sure you want to remove this judge?')) {
      setJudges(prev => prev.filter(judge => judge.id !== judgeId));
      // In a real app, you'd also call an API to remove the judge
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Manage Judges - {hackathon.title}</h2>
            <button
              onClick={onClose}
              className="text-[#6b7280] hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Current Judges */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Current Judges</h3>
            <div className="space-y-3">
              {judges.map((judge) => (
                <div key={judge.id} className="flex items-center justify-between p-3 bg-[#2a2a2e] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      judge.status === 'accepted' ? 'bg-[#4ef467] text-black' :
                      judge.status === 'invited' ? 'bg-[#ffd700] text-black' :
                      'bg-[#6b7280] text-white'
                    }`}>
                      {judge.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-white font-medium">{judge.name}</div>
                      <div className="text-sm text-[#949fa8]">{judge.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      judge.status === 'accepted' ? 'bg-green-900/20 text-green-400' :
                      judge.status === 'invited' ? 'bg-yellow-900/20 text-yellow-400' :
                      'bg-red-900/20 text-red-400'
                    }`}>
                      {judge.status}
                    </span>
                    <button
                      onClick={() => handleRemoveJudge(judge.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite New Judge */}
          <div className="border-t border-[#2a2a2e] pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Invite New Judge</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">Judge Name</label>
                  <input
                    type="text"
                    value={newJudgeName}
                    onChange={(e) => setNewJudgeName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff]"
                    placeholder="Enter judge name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newJudgeEmail}
                    onChange={(e) => setNewJudgeEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff]"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#949fa8] mb-2">Custom Message (Optional)</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] resize-none"
                  rows={3}
                  placeholder="Add a personal message to the invitation..."
                />
              </div>

              <button
                onClick={handleInviteJudge}
                disabled={isInviting || !newJudgeEmail.trim() || !newJudgeName.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isInviting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
