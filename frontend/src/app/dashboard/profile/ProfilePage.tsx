"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from '../../contexts/SessionContext'
import {
  User,
  Settings,
  Key,
  Shield,
  Bell,
  Award,
  Edit,
  Save,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Users,
  Code,
  Trophy,
  ExternalLink,
} from 'lucide-react'

interface UserProfileData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  avatar: string;
  location: string;
  website: string;
  github: string;
  twitter: string;
  linkedin: string;
  skills: string[];
  interests: string[];
  achievements: {
    title: string;
    description: string;
    date: string;
    type: 'hackathon' | 'certification' | 'award' | 'other';
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'archived';
    technologies: string[];
    githubUrl?: string;
    demoUrl?: string;
  }[];
  socialStats: {
    followers: number;
    following: number;
    projects: number;
    hackathons: number;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    publicProfile: boolean;
  };
  createdAt: number;
  updatedAt: number;
}

export function UserProfile() {
  const { user: sessionUser, loading: sessionLoading, error: sessionError, refreshUser } = useSession()
  const [activeTab, setActiveTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserProfileData | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!sessionUser) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
      setError(null)
      
      // First try to get detailed profile from user-profiles API
      try {
        const response = await fetch(`/api/user-profiles/${sessionUser.id}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setUser(data.data)
            setLoading(false)
            return
          }
        }
      } catch (profileError) {
        console.log('User profiles API not available, using session data')
      }

      // Fallback to session user data
      const userProfileData: UserProfileData = {
        id: sessionUser.id,
        username: sessionUser.username,
        email: sessionUser.email,
        fullName: sessionUser.fullName,
        bio: sessionUser.bio || '',
        avatar: sessionUser.avatar || '',
        location: sessionUser.location || '',
        website: sessionUser.website || '',
        github: sessionUser.github || '',
        twitter: sessionUser.twitter || '',
        linkedin: sessionUser.linkedin || '',
        skills: sessionUser.skills || [],
        interests: sessionUser.interests || [],
        achievements: [], // Will be populated from API if available
        projects: [], // Will be populated from API if available
        socialStats: {
          followers: 0,
          following: 0,
          projects: 0,
          hackathons: 0
        },
        preferences: {
          theme: 'dark',
          notifications: true,
          publicProfile: true
        },
        createdAt: sessionUser.createdAt,
        updatedAt: sessionUser.updatedAt
      }
      
      setUser(userProfileData)
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [sessionUser])

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-[#0092ff] animate-spin mx-auto mb-4" />
          <p className="text-[#949fa8]">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (sessionError || error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 mb-4">Failed to load profile</p>
          <p className="text-[#6b7280] text-sm">{sessionError || error}</p>
        </div>
      </div>
    )
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <User className="h-8 w-8 text-[#6b7280] mx-auto mb-4" />
          <p className="text-[#949fa8] mb-4">Please log in to view your profile</p>
          <a href="/auth/login" className="text-[#0092ff] hover:text-[#0080e6]">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <User className="h-8 w-8 text-[#6b7280] mx-auto mb-4" />
          <p className="text-[#949fa8]">Loading user data...</p>
        </div>
      </div>
    )
  }
  const securitySettings = {
    twoFactorEnabled: true,
    lastPasswordChange: '2 months ago',
    loginHistory: [
      {
        device: 'MacBook Pro',
        location: 'San Francisco, CA',
        time: 'Today, 10:32 AM',
      },
      {
        device: 'iPhone 13',
        location: 'San Francisco, CA',
        time: 'Yesterday, 8:15 PM',
      },
      {
        device: 'Windows PC',
        location: 'San Jose, CA',
        time: 'Aug 15, 2023, 3:22 PM',
      },
    ],
  }
  const notificationSettings = {
    emailDigest: 'Weekly',
    newHackathons: true,
    projectUpdates: true,
    teamMessages: true,
    platformUpdates: true,
    marketingEmails: false,
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden sticky top-6">
          <div className="p-6 flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-[#472915] flex items-center justify-center text-white text-2xl font-bold mb-4">
              {user.fullName
                .split(' ')
                .map((n: string) => n[0])
                .join('')}
            </div>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <div className="text-sm text-[#949fa8] mb-4">@{user.username}</div>
            <div className="flex items-center text-xs bg-[#0092ff]/20 text-[#0092ff] px-2 py-1 rounded-full mb-4">
              <Award size={12} className="mr-1" />
              {user.socialStats.followers} Followers • {user.socialStats.projects} Projects
            </div>
            <div className="w-full space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-3 py-2 rounded-md ${activeTab === 'profile' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
              >
                <User size={16} className="mr-3" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center w-full px-3 py-2 rounded-md ${activeTab === 'account' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
              >
                <Settings size={16} className="mr-3" />
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center w-full px-3 py-2 rounded-md ${activeTab === 'security' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
              >
                <Shield size={16} className="mr-3" />
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center w-full px-3 py-2 rounded-md ${activeTab === 'notifications' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
              >
                <Bell size={16} className="mr-3" />
                Notifications
              </button>
            </div>
          </div>
          <div className="p-4 border-t border-[#2a2a2e] text-center text-sm text-[#949fa8]">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="md:col-span-3 space-y-6">
        {activeTab === 'profile' && (
          <>
            <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-[#2a2a2e]">
                <h3 className="text-xl font-semibold">Profile Information</h3>
                {editMode ? (
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center bg-[#0092ff] text-white px-3 py-1.5 rounded-md text-sm"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center bg-[#1e1e24] text-[#949fa8] px-3 py-1.5 rounded-md text-sm hover:bg-[#2a2a2e]"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="p-6 space-y-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.fullName}
                          className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          defaultValue={user.username}
                          className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        defaultValue={user.location}
                        className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bio
                      </label>
                      <textarea
                        defaultValue={user.bio}
                        rows={4}
                        className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Website
                        </label>
                        <input
                          type="text"
                          defaultValue={user.website}
                          className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          GitHub
                        </label>
                        <input
                          type="text"
                          defaultValue={user.github}
                          className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Twitter
                        </label>
                        <input
                          type="text"
                          defaultValue={user.twitter}
                          className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          defaultValue={user.linkedin}
                          className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Skills
                      </label>
                      <input
                        type="text"
                        defaultValue={user.skills.join(', ')}
                        className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                      />
                      <div className="text-xs text-[#949fa8] mt-1">
                        Separate skills with commas
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-[#949fa8] mb-1">
                          Full Name
                        </div>
                        <div>{user.fullName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#949fa8] mb-1">
                          Username
                        </div>
                        <div>@{user.username}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[#949fa8] mb-1">Email</div>
                      <div>{user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#949fa8] mb-1">
                        Location
                      </div>
                      <div>{user.location}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#949fa8] mb-1">Bio</div>
                      <div>{user.bio}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#949fa8] mb-1">
                        Social Profiles
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {user.website && (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm hover:text-[#0092ff]"
                          >
                            <Globe size={16} className="mr-1" />
                            Website
                          </a>
                        )}
                        {user.github && (
                          <a
                            href={`https://github.com/${user.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm hover:text-[#0092ff]"
                          >
                            <Github size={16} className="mr-1" />
                            GitHub
                          </a>
                        )}
                        {user.twitter && (
                          <a
                            href={`https://twitter.com/${user.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm hover:text-[#0092ff]"
                          >
                            <Twitter size={16} className="mr-1" />
                            Twitter
                          </a>
                        )}
                        {user.linkedin && (
                          <a
                            href={`https://linkedin.com/in/${user.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm hover:text-[#0092ff]"
                          >
                            <Linkedin size={16} className="mr-1" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[#949fa8] mb-1">Skills</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Hackathon Stats</h4>
                  <div className="text-xs text-[#949fa8]">All time</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">{user.socialStats.hackathons}</div>
                    <div className="text-sm text-[#949fa8]">Hackathons</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{user.socialStats.projects}</div>
                    <div className="text-sm text-[#949fa8]">Projects</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Advocate Status</h4>
                  <div className="px-2 py-0.5 text-xs bg-[#cd7f32]/20 text-[#cd7f32] rounded">
                    Bronze
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#949fa8]">Progress to Silver</span>
                    <span>{user.socialStats.projects} / 500</span>
                  </div>
                  <div className="w-full bg-[#1e1e24] rounded-full h-2 mb-4">
                    <div
                      className="bg-[#0092ff] h-2 rounded-full"
                      style={{
                        width: '55%',
                      }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-[#1e1e24] text-[#949fa8] py-2 rounded-md text-sm hover:bg-[#2a2a2e]">
                  View Advocate Dashboard
                </button>
              </div>
              <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Upcoming Hackathons</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Web3 Innovate Jam</div>
                      <div className="text-xs text-[#949fa8]">
                        May 10-12, 2024
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#949fa8]" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        Quantum Computing Challenge
                      </div>
                      <div className="text-xs text-[#949fa8]">
                        October 1-7, 2024
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#949fa8]" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Achievements Section */}
            {user.achievements && user.achievements.length > 0 && (
              <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
                <div className="p-6 border-b border-[#2a2a2e]">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-[#0092ff]" />
                    Achievements
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {user.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-[#1e1e24] rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-[#0092ff]/20 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-[#0092ff]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{achievement.title}</h4>
                          <p className="text-sm text-[#949fa8] mt-1">{achievement.description}</p>
                          <div className="flex items-center mt-2 text-xs text-[#6b7280]">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(achievement.date).toLocaleDateString()}
                            <span className="ml-2 px-2 py-0.5 bg-[#2a2a2e] rounded text-[#949fa8]">
                              {achievement.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects Section */}
            {user.projects && user.projects.length > 0 && (
              <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
                <div className="p-6 border-b border-[#2a2a2e]">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Code className="w-5 h-5 mr-2 text-[#0092ff]" />
                    Projects
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.projects.map((project) => (
                      <div key={project.id} className="p-4 bg-[#1e1e24] rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white">{project.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded ${
                            project.status === 'completed' ? 'bg-green-900/20 text-green-400' :
                            project.status === 'active' ? 'bg-blue-900/20 text-blue-400' :
                            'bg-gray-900/20 text-gray-400'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#949fa8] mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="px-2 py-1 bg-[#2a2a2e] text-xs text-[#949fa8] rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-xs text-[#0092ff] hover:text-[#0080e6]"
                            >
                              <Github className="w-3 h-3 mr-1" />
                              GitHub
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-xs text-[#0092ff] hover:text-[#0080e6]"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {activeTab === 'account' && (
          <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2e]">
              <h3 className="text-xl font-semibold">Account Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium mb-4">Email Address</h4>
                <div className="flex items-center">
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="flex-1 bg-[#1e1e24] border border-[#2a2a2e] rounded-l-md py-2 px-4 text-sm text-[#949fa8]"
                  />
                  <button className="bg-[#1e1e24] text-[#949fa8] px-4 py-2 rounded-r-md border-t border-r border-b border-[#2a2a2e] text-sm hover:bg-[#2a2a2e]">
                    Change
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">Password</h4>
                <button className="bg-[#1e1e24] text-[#949fa8] px-4 py-2 rounded-md text-sm hover:bg-[#2a2a2e]">
                  Change Password
                </button>
              </div>
              <div className="pt-4 border-t border-[#2a2a2e]">
                <h4 className="font-medium mb-4">Connected Accounts</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-[#1e1e24] flex items-center justify-center mr-3">
                        <Github size={18} />
                      </div>
                      <div>
                        <div className="font-medium">GitHub</div>
                        <div className="text-xs text-[#949fa8]">
                          Connected as {user.github}
                        </div>
                      </div>
                    </div>
                    <button className="text-[#949fa8] text-sm hover:text-white">
                      Disconnect
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-[#1e1e24] flex items-center justify-center mr-3">
                        <Twitter size={18} />
                      </div>
                      <div>
                        <div className="font-medium">Twitter</div>
                        <div className="text-xs text-[#949fa8]">
                          Connected as @{user.twitter}
                        </div>
                      </div>
                    </div>
                    <button className="text-[#949fa8] text-sm hover:text-white">
                      Disconnect
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-[#1e1e24] flex items-center justify-center mr-3">
                        <Linkedin size={18} />
                      </div>
                      <div>
                        <div className="font-medium">LinkedIn</div>
                        <div className="text-xs text-[#949fa8]">
                          Not connected
                        </div>
                      </div>
                    </div>
                    <button className="text-[#0092ff] text-sm">Connect</button>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#2a2a2e]">
                <h4 className="font-medium mb-4">Danger Zone</h4>
                <button className="bg-red-900/20 text-red-400 px-4 py-2 rounded-md text-sm hover:bg-red-900/30">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2e]">
              <h3 className="text-xl font-semibold">Security Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      Status:{' '}
                      {securitySettings.twoFactorEnabled
                        ? 'Enabled'
                        : 'Disabled'}
                    </div>
                    <div className="text-sm text-[#949fa8]">
                      Last updated: {securitySettings.lastPasswordChange}
                    </div>
                  </div>
                  {securitySettings.twoFactorEnabled ? (
                    <button className="bg-[#1e1e24] text-[#949fa8] px-4 py-2 rounded-md text-sm hover:bg-[#2a2a2e]">
                      Disable
                    </button>
                  ) : (
                    <button className="bg-[#0092ff] text-white px-4 py-2 rounded-md text-sm">
                      Enable
                    </button>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-[#2a2a2e]">
                <h4 className="font-medium mb-4">Password</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      Last changed: {securitySettings.lastPasswordChange}
                    </div>
                    <div className="text-sm text-[#949fa8]">
                      We recommend changing your password regularly
                    </div>
                  </div>
                  <button className="bg-[#1e1e24] text-[#949fa8] px-4 py-2 rounded-md text-sm hover:bg-[#2a2a2e]">
                    Change Password
                  </button>
                </div>
              </div>
              <div className="pt-4 border-t border-[#2a2a2e]">
                <h4 className="font-medium mb-4">Login History</h4>
                <div className="space-y-3">
                  {securitySettings.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-8 w-8 rounded-md bg-[#1e1e24] flex items-center justify-center mr-3 flex-shrink-0">
                        <Key size={16} />
                      </div>
                      <div>
                        <div className="font-medium">{login.device}</div>
                        <div className="text-xs text-[#949fa8]">
                          {login.location} • {login.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-[#0092ff]">
                  View Complete History
                </button>
              </div>
              <div className="pt-4 border-t border-[#2a2a2e]">
                <h4 className="font-medium mb-4">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-md bg-[#1e1e24] flex items-center justify-center mr-3 flex-shrink-0">
                        <Key size={16} />
                      </div>
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-xs text-[#949fa8]">
                          San Francisco, CA • Started today at 10:32 AM
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-green-400">Active</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-md bg-[#1e1e24] flex items-center justify-center mr-3 flex-shrink-0">
                        <Key size={16} />
                      </div>
                      <div>
                        <div className="font-medium">iPhone 13</div>
                        <div className="text-xs text-[#949fa8]">
                          San Francisco, CA • Started yesterday at 8:15 PM
                        </div>
                      </div>
                    </div>
                    <button className="text-[#949fa8] text-sm hover:text-white">
                      Logout
                    </button>
                  </div>
                </div>
                <button className="mt-4 bg-[#1e1e24] text-[#949fa8] px-4 py-2 rounded-md text-sm hover:bg-[#2a2a2e]">
                  Logout of All Other Sessions
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2e]">
              <h3 className="text-xl font-semibold">Notification Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium mb-4">Email Digest</h4>
                <select className="w-full md:w-64 bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]">
                  <option value="daily">Daily</option>
                  <option value="weekly" selected>
                    Weekly
                  </option>
                  <option value="monthly">Monthly</option>
                  <option value="none">Don't send</option>
                </select>
                <div className="text-xs text-[#949fa8] mt-2">
                  How often you receive a summary of platform activity
                </div>
              </div>
              <div className="pt-4 border-t border-[#2a2a2e]">
                <h4 className="font-medium mb-4">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">New Hackathons</div>
                      <div className="text-sm text-[#949fa8]">
                        Get notified about new hackathon announcements
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.newHackathons}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#1e1e24] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0092ff]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Project Updates</div>
                      <div className="text-sm text-[#949fa8]">
                        Updates about your projects and submissions
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.projectUpdates}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#1e1e24] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0092ff]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Team Messages</div>
                      <div className="text-sm text-[#949fa8]">
                        Messages from your team members
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.teamMessages}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#1e1e24] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0092ff]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Platform Updates</div>
                      <div className="text-sm text-[#949fa8]">
                        New features and improvements to HackX
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.platformUpdates}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#1e1e24] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0092ff]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Marketing Emails</div>
                      <div className="text-sm text-[#949fa8]">
                        Promotional content and special offers
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#1e1e24] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0092ff]"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#2a2a2e]">
                <h4 className="font-medium mb-4">In-App Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        All In-App Notifications
                      </div>
                      <div className="text-sm text-[#949fa8]">
                        Enable or disable all in-app notifications
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={true}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#1e1e24] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0092ff]"></div>
                    </label>
                  </div>
                  <button className="bg-[#1e1e24] text-[#949fa8] px-4 py-2 rounded-md text-sm hover:bg-[#2a2a2e]">
                    Configure Individual Notifications
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#2a2a2e] flex justify-end">
              <button className="bg-[#0092ff] text-white px-6 py-2 rounded-md text-sm">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
