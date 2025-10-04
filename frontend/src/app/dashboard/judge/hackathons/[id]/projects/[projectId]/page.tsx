'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from '../../../../../../contexts/SessionContext';
import {
  ArrowLeft,
  Star,
  Users,
  Calendar,
  Code,
  ExternalLink,
  Github,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Award,
  Trophy,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  Target,
  Save,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  teamLeader: string;
  teamMembers: string[];
  githubUrl?: string;
  demoUrl?: string;
  sectors: string[];
  status: 'submitted' | 'under_review' | 'judged';
  submittedAt: string;
  lastEdited: string;
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
  demoVideo?: string;
  pitchVideo?: string;
  detailedDescription: string;
  achievements: string[];
  challenges: string[];
  futurePlans: string[];
}

interface Rating {
  id: string;
  judgeId: string;
  projectId: string;
  hackathonId: string;
  scores: {
    innovation: number;
    technical: number;
    design: number;
    presentation: number;
    impact: number;
  };
  comments: string;
  strengths: string[];
  improvements: string[];
  recommendation: 'approve' | 'reject' | 'needs_work';
  submittedAt: string;
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

export default function ProjectDetailPage() {
  const params = useParams();
  const { user, loading: sessionLoading } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hackathon' | 'judging'>('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState<'demo' | 'pitch'>('demo');

  // Rating form state
  const [scores, setScores] = useState({
    innovation: 0,
    technical: 0,
    design: 0,
    presentation: 0,
    impact: 0
  });
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<'approve' | 'reject' | 'needs_work'>('needs_work');
  const [newStrength, setNewStrength] = useState('');
  const [newImprovement, setNewImprovement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionLoading && user?.role !== 'judge' && user?.role !== 'admin') {
      setError('Access denied. Judge role required.');
      setLoading(false);
      return;
    }

    if (params.id && params.projectId) {
      fetchProjectData();
    }
  }, [sessionLoading, user, params.id, params.projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project details
      try {
        const projectResponse = await fetch(`/api/project-archives/${params.projectId}`);
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          if (projectData.success) {
            setProject(projectData.data);
          }
        }
      } catch (projectError) {
        console.log('Project API not available, using mock data');
      }

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

      // Fetch existing rating
      try {
        const ratingResponse = await fetch(`/api/judge/ratings?projectId=${params.projectId}&judgeId=${user?.id}`);
        if (ratingResponse.ok) {
          const ratingData = await ratingResponse.json();
          if (ratingData.success && ratingData.data) {
            setRating(ratingData.data);
            setScores(ratingData.data.scores);
            setComments(ratingData.data.comments);
            setStrengths(ratingData.data.strengths);
            setImprovements(ratingData.data.improvements);
            setRecommendation(ratingData.data.recommendation);
          }
        }
      } catch (ratingError) {
        console.log('Rating API not available');
      }

      // Fallback to mock data
      const mockProject: Project = {
        id: params.projectId as string,
        title: 'Init Club Pro',
        description: 'Dunk Verse is an innovative blockchain-based sports engagement platform designed to revolutionize the fan experience.',
        teamLeader: 'Amaan Sayyiad',
        teamMembers: ['Amaan Sayyiad', 'Sarah Chen', 'Alex Rodriguez', 'Mike Johnson'],
        githubUrl: 'https://github.com/initclub/pro',
        demoUrl: 'https://demo.initclub.com',
        sectors: ['SocialFi', 'Infra', 'GameFi', 'NFT', 'AI', 'DeFi'],
        status: 'submitted',
        submittedAt: '2024-10-15',
        lastEdited: '6 days ago',
        technologies: ['React', 'Node.js', 'Ethereum', 'Solidity', 'Mantle'],
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
        },
        demoVideo: '/api/placeholder/video',
        pitchVideo: '/api/placeholder/video',
        detailedDescription: `Dunk Verse leverages Mantle's Layer 2 infrastructure to create a seamless experience that combines GameFi, SocialFi, and NFT technologies. The platform features AI-generated quizzes, live NFT auctions tied to Top Shots NBA sports events, and leaderboard competitions. Fans can upload videos that are automatically minted into NFTs, participate in AI quizzes, and engage in real-time auctions.`,
        achievements: [
          'Frontend Development: Built a user-friendly interface for NFT auctions, AI quizzes, and Social Interaction.',
          'Smart Contracts: Deployed key smart contracts for the token and Betting Pool on the Mantle Testnet.',
          'AI Quiz Integration: Implemented AIGC DALL-E3 GPT models that generate dynamic quizzes based on live sports events.',
          'Developed a functional NFT auction system that allows users to bid using our tokens.',
          'Testing and Deployment: Conducted rigorous testing to ensure seamless operations and deployed the project with all features integrated.'
        ],
        challenges: [
          'Integrating multiple blockchain networks',
          'Real-time data synchronization',
          'User experience optimization',
          'Scalability concerns'
        ],
        futurePlans: [
          'Mobile app development',
          'Cross-chain integration',
          'Advanced AI features',
          'Community governance'
        ]
      };

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

      setProject(mockProject);
      setHackathon(mockHackathon);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (category: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const addStrength = () => {
    if (newStrength.trim()) {
      setStrengths(prev => [...prev, newStrength.trim()]);
      setNewStrength('');
    }
  };

  const removeStrength = (index: number) => {
    setStrengths(prev => prev.filter((_, i) => i !== index));
  };

  const addImprovement = () => {
    if (newImprovement.trim()) {
      setImprovements(prev => [...prev, newImprovement.trim()]);
      setNewImprovement('');
    }
  };

  const removeImprovement = (index: number) => {
    setImprovements(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRating = async () => {
    try {
      setIsSubmitting(true);
      
      const ratingData = {
        projectId: params.projectId,
        hackathonId: params.id,
        scores,
        comments,
        strengths,
        improvements,
        recommendation
      };

      const response = await fetch('/api/judge/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Rating submitted successfully!');
          // Optionally redirect or update UI
        }
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  };

  const getAverageScore = () => {
    const total = getTotalScore();
    return total > 0 ? (total / Object.keys(scores).length).toFixed(1) : '0.0';
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0092ff] mx-auto mb-4"></div>
          <p className="text-[#949fa8]">Loading project details...</p>
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
            href={`/dashboard/judge/hackathons/${params.id}`}
            className="flex items-center gap-2 text-[#0092ff] hover:text-[#0080e6] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to ChainSpark Hackathon Projects
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#2a2a2e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {project?.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project?.title}</h1>
              <p className="text-[#949fa8]">by {project?.teamLeader}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-[#949fa8] mb-1">Total Score</div>
            <div className="text-2xl font-bold text-white">{getTotalScore()}/50</div>
            <div className="text-sm text-[#4ef467]">Avg: {getAverageScore()}/10</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#16161b] border-b border-[#2a2a2e]">
        <div className="flex">
          {[
            { id: 'overview', label: 'Project Overview', icon: Eye },
            { id: 'hackathon', label: 'Hackathon', icon: Trophy },
            { id: 'judging', label: 'Judging', icon: Star }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-[#0092ff] border-b-2 border-[#0092ff] bg-[#0092ff]/5'
                  : 'text-[#949fa8] hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'overview' && project && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Description */}
              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Project Description</h2>
                <p className="text-[#949fa8] leading-relaxed">{project.detailedDescription}</p>
              </div>

              {/* Video Section */}
              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveVideo('demo')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeVideo === 'demo'
                        ? 'bg-[#0092ff] text-white'
                        : 'bg-[#2a2a2e] text-[#949fa8] hover:text-white'
                    }`}
                  >
                    Demo Video
                  </button>
                  <button
                    onClick={() => setActiveVideo('pitch')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeVideo === 'pitch'
                        ? 'bg-[#0092ff] text-white'
                        : 'bg-[#2a2a2e] text-[#949fa8] hover:text-white'
                    }`}
                  >
                    Pitch Video
                  </button>
                </div>
                
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      {isVideoPlaying ? (
                        <Pause className="h-6 w-6 text-white" />
                      ) : (
                        <Play className="h-6 w-6 text-white ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress During Hackathon */}
              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Progress During Hackathon</h2>
                <ul className="space-y-3">
                  {project.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#4ef467] mt-0.5 flex-shrink-0" />
                      <span className="text-[#949fa8]">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fundraising Status */}
              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Fundraising Status</h2>
                <p className="text-[#949fa8]">
                  {project.fundraising.status === 'not_started' 
                    ? 'Not raised any funds, but actively looking to raise.'
                    : `Raised $${project.fundraising.raised.toLocaleString()} of $${project.fundraising.target.toLocaleString()} target.`
                  }
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info Card */}
              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-[#6b7280] mb-1">Team Leader</div>
                    <div className="text-white font-medium">{project.teamLeader}</div>
                  </div>
                  
                  {project.githubUrl && (
                    <div>
                      <div className="text-sm text-[#6b7280] mb-1">GitHub</div>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#0092ff] hover:text-[#0080e6] transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        github.com
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-sm text-[#6b7280] mb-2">Sector</div>
                    <div className="flex flex-wrap gap-2">
                      {project.sectors.map((sector, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#0092ff]/10 text-[#0092ff] text-xs rounded-full"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
                <div className="space-y-3">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#2a2a2e] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-[#949fa8]">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#2a2a2e] text-[#949fa8] text-sm rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hackathon' && hackathon && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">{hackathon.title}</h2>
              <p className="text-[#949fa8] mb-6">{hackathon.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{hackathon.participants}</div>
                  <div className="text-sm text-[#949fa8]">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{hackathon.projectsSubmitted}</div>
                  <div className="text-sm text-[#949fa8]">Projects Submitted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{hackathon.prizeCohorts}</div>
                  <div className="text-sm text-[#949fa8]">Prize Cohorts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{hackathon.techStack.length}</div>
                  <div className="text-sm text-[#949fa8]">Tech Stack</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#2a2a2e]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#4ef467]">{hackathon.prize}</div>
                    <div className="text-sm text-[#949fa8]">Total Prize Pool</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#949fa8]">Duration</div>
                    <div className="text-white font-medium">{hackathon.startDate} - {hackathon.endDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'judging' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Project Evaluation</h2>
              
              {/* Scoring Section */}
              <div className="space-y-6">
                {[
                  { key: 'innovation', label: 'Innovation', description: 'How innovative and original is the solution?' },
                  { key: 'technical', label: 'Technical Quality', description: 'Quality of code, architecture, and implementation' },
                  { key: 'design', label: 'Design & UX', description: 'User experience and interface design quality' },
                  { key: 'presentation', label: 'Presentation', description: 'Clarity of pitch and demonstration' },
                  { key: 'impact', label: 'Impact & Potential', description: 'Potential impact and real-world applicability' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-medium text-white">{label}</h3>
                        <span className="text-[#0092ff] font-semibold">{scores[key as keyof typeof scores]}/10</span>
                      </div>
                      <p className="text-sm text-[#949fa8]">{description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleScoreChange(key as keyof typeof scores, score)}
                          className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                            scores[key as keyof typeof scores] >= score
                              ? 'bg-[#0092ff] border-[#0092ff] text-white'
                              : 'bg-transparent border-[#2a2a2e] text-[#949fa8] hover:border-[#3a3a3e]'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comments Section */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-white">Comments</h3>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide detailed feedback about the project..."
                  className="w-full h-32 px-4 py-3 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] resize-none"
                />
              </div>

              {/* Strengths Section */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-white">Strengths</h3>
                <div className="space-y-2">
                  {strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#4ef467]/10 text-[#4ef467] text-sm rounded-full">
                        {strength}
                      </span>
                      <button
                        onClick={() => removeStrength(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStrength}
                      onChange={(e) => setNewStrength(e.target.value)}
                      placeholder="Add a strength..."
                      className="flex-1 px-3 py-2 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff]"
                    />
                    <button
                      onClick={addStrength}
                      className="px-4 py-2 bg-[#4ef467] text-white rounded-lg hover:bg-[#3dd55f] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Improvements Section */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-white">Areas for Improvement</h3>
                <div className="space-y-2">
                  {improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#ff6b35]/10 text-[#ff6b35] text-sm rounded-full">
                        {improvement}
                      </span>
                      <button
                        onClick={() => removeImprovement(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImprovement}
                      onChange={(e) => setNewImprovement(e.target.value)}
                      placeholder="Add an improvement..."
                      className="flex-1 px-3 py-2 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff]"
                    />
                    <button
                      onClick={addImprovement}
                      className="px-4 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommendation Section */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-white">Recommendation</h3>
                <div className="flex gap-4">
                  {[
                    { value: 'approve', label: 'Approve', color: 'bg-[#4ef467] hover:bg-[#3dd55f]' },
                    { value: 'needs_work', label: 'Needs Work', color: 'bg-[#ffd700] hover:bg-[#e6c200] text-black' },
                    { value: 'reject', label: 'Reject', color: 'bg-[#ff6b35] hover:bg-[#e55a2b]' }
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => setRecommendation(value as any)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        recommendation === value
                          ? color
                          : 'bg-[#2a2a2e] text-[#949fa8] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-[#2a2a2e]">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#949fa8]">
                    Total Score: <span className="text-white font-semibold">{getTotalScore()}/50</span> 
                    (Average: <span className="text-[#4ef467] font-semibold">{getAverageScore()}/10</span>)
                  </div>
                  <button
                    onClick={handleSubmitRating}
                    disabled={isSubmitting || getTotalScore() === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Rating
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
