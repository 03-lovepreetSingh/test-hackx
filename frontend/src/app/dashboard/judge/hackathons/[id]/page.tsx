'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from '../../../../contexts/SessionContext';
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  Users,
  Calendar,
  Code,
  ExternalLink,
  MoreHorizontal,
  Trophy,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  teamLeader: string;
  githubUrl?: string;
  demoUrl?: string;
  sectors: string[];
  status: 'submitted' | 'under_review' | 'judged';
  submittedAt: string;
  lastEdited: string;
  teamMembers: number;
  technologies: string[];
  imageUrl?: string;
  progress: {
    frontend: boolean;
    backend: boolean;
    smartContracts: boolean;
    testing: boolean;
    deployment: boolean;
  };
  fundraising: {
    raised: number;
    target: number;
    status: 'not_started' | 'active' | 'completed';
  };
}

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
  organizer: string;
}

export default function HackathonProjectsPage() {
  const params = useParams();
  const { user, loading: sessionLoading } = useSession();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'under_review' | 'judged'>('all');

  useEffect(() => {
    if (!sessionLoading && user?.role !== 'judge' && user?.role !== 'admin') {
      setError('Access denied. Judge role required.');
      setLoading(false);
      return;
    }

    if (params.id) {
      fetchHackathonAndProjects();
    }
  }, [sessionLoading, user, params.id]);

  const fetchHackathonAndProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch hackathon details
      try {
        const hackathonResponse = await fetch(`/api/hackathons/${params.id}`);
        if (hackathonResponse.ok) {
          const hackathonData = await hackathonResponse.json();
          if (hackathonData.success) {
            setHackathon(hackathonData.data);
          }
        }
      } catch (hackathonError) {
        console.log('Hackathon API not available, using mock data');
      }

      // Fetch projects for this hackathon
      try {
        const projectsResponse = await fetch(`/api/project-archives?hackathonId=${params.id}`);
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          if (projectsData.success && projectsData.data) {
            setProjects(projectsData.data);
            setLoading(false);
            return;
          }
        }
      } catch (projectsError) {
        console.log('Projects API not available, using mock data');
      }

      // Fallback to mock data
      const mockHackathon: Hackathon = {
        id: params.id as string,
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
        organizer: 'ChainSpark'
      };

      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Init Club Pro',
          description: 'Init Club Pro was born from a simple but radical belief: true innovation shouldn\'t be strangled by black-box algorithms or centralized gatekeepers.',
          teamLeader: 'John McKenzie',
          githubUrl: 'https://github.com/initclub/pro',
          demoUrl: 'https://demo.initclub.com',
          sectors: ['DeFi', 'Infra'],
          status: 'submitted',
          submittedAt: '2024-10-15',
          lastEdited: '6 days ago',
          teamMembers: 4,
          technologies: ['React', 'Node.js', 'Ethereum', 'Solidity'],
          progress: {
            frontend: true,
            backend: true,
            smartContracts: true,
            testing: true,
            deployment: false
          },
          fundraising: {
            raised: 0,
            target: 50000,
            status: 'not_started'
          }
        },
        {
          id: '2',
          title: 'Ward',
          description: 'A decentralized identity management system that provides secure and privacy-preserving identity verification for Web3 applications.',
          teamLeader: 'Sarah Chen',
          githubUrl: 'https://github.com/ward/identity',
          sectors: ['Infra', 'Security'],
          status: 'under_review',
          submittedAt: '2024-10-14',
          lastEdited: '2 days ago',
          teamMembers: 3,
          technologies: ['Rust', 'Substrate', 'Polkadot'],
          progress: {
            frontend: true,
            backend: true,
            smartContracts: true,
            testing: false,
            deployment: false
          },
          fundraising: {
            raised: 15000,
            target: 100000,
            status: 'active'
          }
        },
        {
          id: '3',
          title: 'Wiral',
          description: 'An AI-powered content creation platform that helps creators generate engaging social media content using advanced machine learning algorithms.',
          teamLeader: 'Alex Rodriguez',
          githubUrl: 'https://github.com/wiral/ai-content',
          sectors: ['AI', 'SocialFi'],
          status: 'submitted',
          submittedAt: '2024-10-13',
          lastEdited: '1 day ago',
          teamMembers: 5,
          technologies: ['Python', 'TensorFlow', 'React', 'Node.js'],
          progress: {
            frontend: true,
            backend: true,
            smartContracts: false,
            testing: true,
            deployment: true
          },
          fundraising: {
            raised: 25000,
            target: 75000,
            status: 'active'
          }
        }
      ];

      setHackathon(mockHackathon);
      setProjects(mockProjects);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load hackathon and projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.teamLeader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0092ff] mx-auto mb-4"></div>
          <p className="text-[#949fa8]">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 mb-4">Error</p>
          <p className="text-[#6b7280] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-[#16161b] border-b border-[#2a2a2e] py-6 px-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard/judge"
            className="flex items-center gap-2 text-[#0092ff] hover:text-[#0080e6] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hackathons to judge
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {hackathon?.title} Projects
            </h1>
            <p className="text-[#949fa8] mb-4">{hackathon?.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-[#949fa8]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{hackathon?.participants} Participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>{hackathon?.projectsSubmitted} Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{hackathon?.startDate} - {hackathon?.endDate}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-[#4ef467] mb-1">{hackathon?.prize}</div>
            <div className="text-sm text-[#949fa8]">Total Prize Pool</div>
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
              placeholder="Search projects..."
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
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="judged">Judged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-[#6b7280] mx-auto mb-4" />
            <p className="text-[#949fa8]">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6 hover:border-[#3a3a3e] transition-colors">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#2a2a2e] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {project.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="text-sm text-[#949fa8]">by {project.teamLeader}</p>
                    </div>
                  </div>
                  <button className="text-[#6b7280] hover:text-white p-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Project Description */}
                <p className="text-[#949fa8] text-sm mb-4 line-clamp-3">{project.description}</p>

                {/* Project Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-[#6b7280]">
                    <span>Last edited</span>
                    <span>{project.lastEdited}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6b7280]">
                    <span>Builder</span>
                    <span>{project.teamLeader}</span>
                  </div>
                </div>

                {/* Sectors/Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.sectors.map((sector, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#0092ff]/10 text-[#0092ff] text-xs rounded-full"
                    >
                      {sector}
                    </span>
                  ))}
                </div>

                {/* Progress Indicators */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
                    <span>Progress</span>
                    <span>{Object.values(project.progress).filter(Boolean).length}/5</span>
                  </div>
                  <div className="flex gap-1">
                    {Object.entries(project.progress).map(([key, completed]) => (
                      <div
                        key={key}
                        className={`h-2 flex-1 rounded ${
                          completed ? 'bg-[#4ef467]' : 'bg-[#2a2a2e]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Fundraising Status */}
                {project.fundraising.status !== 'not_started' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-[#6b7280] mb-1">
                      <span>Fundraising</span>
                      <span>${project.fundraising.raised.toLocaleString()} / ${project.fundraising.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#2a2a2e] rounded-full h-2">
                      <div
                        className="bg-[#4ef467] h-2 rounded-full"
                        style={{ width: `${(project.fundraising.raised / project.fundraising.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={`/dashboard/judge/hackathons/${params.id}/projects/${project.id}`}
                  className="w-full bg-[#0092ff] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#0080e6] transition-colors text-center block"
                >
                  Review Project
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
