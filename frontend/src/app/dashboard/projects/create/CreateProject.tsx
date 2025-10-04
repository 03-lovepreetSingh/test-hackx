'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Github,
  ExternalLink,
  FileText,
  Users,
  Tag,
  Award,
  Calendar,
  Code,
} from 'lucide-react';

interface ProjectFormData {
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Abandoned';
  hackathon: string;
  technologies: string[];
  result: string;
  prize: string;
  color: string;
  githubUrl: string;
  demoUrl: string;
  documentation: string;
  teamMembers: string[];
  tags: string[];
  date: string;
  stars: number;
}

export function CreateProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    status: 'In Progress',
    hackathon: '',
    technologies: [],
    result: '',
    prize: '',
    color: '#0092ff',
    githubUrl: '',
    demoUrl: '',
    documentation: '',
    teamMembers: [],
    tags: [],
    date: new Date().toISOString().split('T')[0],
    stars: 0
  });

  const [techInput, setTechInput] = useState('');
  const [teamInput, setTeamInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/project-archives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/projects');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const addTeamMember = () => {
    if (teamInput.trim() && !formData.teamMembers.includes(teamInput.trim())) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, teamInput.trim()]
      });
      setTeamInput('');
    }
  };

  const removeTeamMember = (member: string) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter(m => m !== member)
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center bg-[#1b1b1e] rounded-xl p-8 border border-[#2a2a2e]">
          <CheckCircle className="h-16 w-16 text-[#4ef467] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Project Created Successfully!</h1>
          <p className="text-[#949fa8] mb-4">Your project has been saved to IPFS and IPNS.</p>
          <p className="text-sm text-[#6b7280]">Redirecting to projects page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center text-[#0092ff] hover:text-[#0080e6] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-white">Create New Project</h1>
          <p className="text-[#949fa8] mt-2">
            Create a new project that will be stored on IPFS and IPNS for decentralized access.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#1b1b1e] rounded-xl shadow-lg border border-[#2a2a2e]">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Code className="w-5 h-5 mr-2 text-[#0092ff]" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                    placeholder="Enter project title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Abandoned">Abandoned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent"
                  rows={4}
                  placeholder="Describe your project in detail"
                  required
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Award className="w-5 h-5 mr-2 text-[#0092ff]" />
                Project Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">
                    Hackathon
                  </label>
                  <input
                    type="text"
                    value={formData.hackathon}
                    onChange={(e) => setFormData({...formData, hackathon: e.target.value})}
                    className="w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                    placeholder="Hackathon name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">
                    Result
                  </label>
                  <input
                    type="text"
                    value={formData.result}
                    onChange={(e) => setFormData({...formData, result: e.target.value})}
                    className="w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                    placeholder="1st Place, Finalist, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">
                    Prize
                  </label>
                  <input
                    type="text"
                    value={formData.prize}
                    onChange={(e) => setFormData({...formData, prize: e.target.value})}
                    className="w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                    placeholder="$5,000, -"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">
                    Project Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="flex-1 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                      placeholder="#0092ff"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Tag className="w-5 h-5 mr-2 text-[#0092ff]" />
                Technologies
              </h2>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="flex-1 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                  placeholder="Add technology (e.g., React, Solidity)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-3 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#0092ff]/10 text-[#0092ff]"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-2 text-[#0092ff] hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Team Members */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#0092ff]" />
                Team Members
              </h2>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={teamInput}
                  onChange={(e) => setTeamInput(e.target.value)}
                  className="flex-1 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                  placeholder="Add team member name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeamMember())}
                />
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-4 py-3 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.teamMembers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.teamMembers.map((member, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {member}
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <ExternalLink className="w-5 h-5 mr-2 text-[#0092ff]" />
                Project Links
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">
                    <Github className="w-4 h-4 inline mr-1" />
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    className="w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#949fa8] mb-2">
                    <ExternalLink className="w-4 h-4 inline mr-1" />
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                    className="w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                    placeholder="https://demo.example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Documentation URL
                </label>
                <input
                  type="url"
                  value={formData.documentation}
                  onChange={(e) => setFormData({...formData, documentation: e.target.value})}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent"
                  placeholder="https://docs.example.com"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Tag className="w-5 h-5 mr-2 text-[#0092ff]" />
                Project Tags
              </h2>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent transition-colors"
                  placeholder="Add tag (e.g., DeFi, Web3)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-green-600 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-[#2a2a2e]">
              <Link
                href="/dashboard/projects"
                className="px-6 py-3 border border-[#3a3a3e] text-[#949fa8] rounded-lg hover:bg-[#2a2a2e] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#0092ff] text-white rounded-lg hover:bg-[#0080e6] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
