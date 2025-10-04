"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Tag,
  Award,
  MoreHorizontal,
  ExternalLink,
  Code,
  FileText,
  Star,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react'
interface Project {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Abandoned';
  description: string;
  date: string;
  hackathon: string;
  technologies: string[];
  result: string;
  prize: string;
  stars: number;
  color: string;
  githubUrl?: string;
  demoUrl?: string;
  documentation?: string;
  teamMembers?: string[];
  tags?: string[];
  images?: string[];
  video?: string;
}

export function ProjectArchive() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [refreshKey, setRefreshKey] = useState(0) // Add refresh key to force refetch

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/project-archives?t=${refreshKey}`)
        const data = await response.json()

        if (data.success) {
          setProjects(data.data)
        } else {
          setError(data.error || 'Failed to fetch projects')
        }
      } catch (err) {
        setError('Failed to fetch projects')
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [refreshKey])

  // Refetch when window gains focus (user returns from create page)
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Manual refresh function
  const refreshProjects = () => {
    setRefreshKey(prev => prev + 1)
  }

  // Search projects
  const searchProjects = async (query: string) => {
    try {
      const response = await fetch(`/api/project-archives/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setProjects(data.data)
      }
    } catch (err) {
      console.error('Error searching projects:', err)
    }
  }

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.trim()) {
      searchProjects(query)
    } else {
      // Reset to all projects
      refreshProjects()
    }
  }

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`/api/project-archives/${projectId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        refreshProjects() // Refresh the list instead of manual filtering
      } else {
        alert('Failed to delete project: ' + data.error)
      }
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Failed to delete project')
    }
  }
  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) =>
          filter === 'completed'
            ? p.status === 'Completed'
            : filter === 'in-progress'
              ? p.status === 'In Progress'
              : p.status === 'Abandoned',
        )

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#0092ff]" />
            <p className="text-[#949fa8]">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#0092ff] text-white px-4 py-2 rounded-md hover:bg-[#0080e6]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949fa8]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 pl-10 pr-4 text-sm text-[#949fa8] focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
          <Link
            href="/dashboard/projects/create"
            className="p-2 bg-[#0092ff] text-white rounded-md hover:bg-[#0080e6] flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create Project</span>
          </Link>
          <button
            onClick={refreshProjects}
            className="p-2 bg-[#1e1e24] border border-[#2a2a2e] rounded-md text-[#949fa8] hover:text-white"
            disabled={loading}
            title="Refresh projects"
          >
            <Loader2 size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="p-2 bg-[#1e1e24] border border-[#2a2a2e] rounded-md text-[#949fa8] hover:text-white">
            <Filter size={20} />
          </button>
          <button className="p-2 bg-[#1e1e24] border border-[#2a2a2e] rounded-md text-[#949fa8] hover:text-white">
            <ArrowUpDown size={20} />
          </button>
        </div>
      </div>
      <div className="flex gap-2 border-b border-[#2a2a2e] pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          All Projects
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'completed' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'in-progress' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('abandoned')}
          className={`px-4 py-2 rounded-md text-sm ${filter === 'abandoned' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Abandoned
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className="h-8 w-8 rounded-md mr-3"
                    style={{
                      backgroundColor: project.color,
                    }}
                  ></div>
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${project.status === 'Completed' ? 'bg-[#4ef467]/20 text-[#4ef467]' : project.status === 'In Progress' ? 'bg-[#0092ff]/20 text-[#0092ff]' : 'bg-[#949fa8]/20 text-[#949fa8]'}`}
                      >
                        {project.status}
                      </span>
                      <span className="mx-2 text-xs text-[#949fa8]">•</span>
                      <span className="text-xs text-[#949fa8]">
                        {project.hackathon}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8] hover:text-white"
                      title="View on GitHub"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button 
                    onClick={() => setEditingProject(project)}
                    className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8] hover:text-white"
                    title="Edit Project"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8] hover:text-red-500"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#949fa8] mb-6">
                {project.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="flex items-center text-xs text-[#949fa8] mb-1">
                    <Calendar size={12} className="mr-1" />
                    <span>Date</span>
                  </div>
                  <div className="text-sm">{project.date}</div>
                </div>
                <div>
                  <div className="flex items-center text-xs text-[#949fa8] mb-1">
                    <Tag size={12} className="mr-1" />
                    <span>Technologies</span>
                  </div>
                  <div className="text-sm">
                    {project.technologies.join(', ')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-xs text-[#949fa8] mb-1">
                    <Award size={12} className="mr-1" />
                    <span>Result</span>
                  </div>
                  <div className="text-sm">{project.result}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {project.status !== 'Abandoned' && (
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="bg-[#1e1e24] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#2a2a2e]"
                  >
                    <Code size={16} className="mr-2" />
                    View Project
                  </Link>
                )}
                {project.documentation && (
                  <a
                    href={project.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1e1e24] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#2a2a2e]"
                  >
                    <FileText size={16} className="mr-2" />
                    Documentation
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0092ff] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#0080e6]"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Live Demo
                  </a>
                )}
                <div className="flex items-center ml-auto">
                  <Star size={16} className="text-yellow-500 mr-1" />
                  <span className="text-sm">{project.stars}</span>
                </div>
              </div>
            </div>
            {project.prize !== '-' && (
              <div className="bg-[#1e1e24] px-6 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-[#949fa8]">Prize won: </span>
                  <span className="font-medium">{project.prize}</span>
                </div>
                <div className="text-sm text-[#949fa8]">
                  Submitted to {project.hackathon}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Project Form Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProjectForm
              project={editingProject}
              onClose={() => setEditingProject(null)}
              onSave={(projectData) => {
                // Update existing project
                fetch(`/api/project-archives/${editingProject.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(projectData)
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      // Refresh projects
                      refreshProjects()
                      setEditingProject(null)
                    } else {
                      alert('Failed to update project: ' + data.error)
                    }
                  })
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Project Form Component
interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

function ProjectForm({ project, onClose, onSave }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'In Progress',
    hackathon: project?.hackathon || '',
    technologies: project?.technologies?.join(', ') || '',
    result: project?.result || '',
    prize: project?.prize || '',
    color: project?.color || '#0092ff',
    githubUrl: project?.githubUrl || '',
    demoUrl: project?.demoUrl || '',
    documentation: project?.documentation || '',
    teamMembers: project?.teamMembers?.join(', ') || '',
    tags: project?.tags?.join(', ') || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
      teamMembers: formData.teamMembers.split(',').map(t => t.trim()).filter(t => t),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      date: project?.date || new Date().toISOString().split('T')[0],
      stars: project?.stars || 0
    }

    onSave(projectData)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {project ? 'Edit Project' : 'Create New Project'}
        </h2>
        <button
          onClick={onClose}
          className="text-[#949fa8] hover:text-white"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Abandoned">Abandoned</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hackathon</label>
            <input
              type="text"
              value={formData.hackathon}
              onChange={(e) => setFormData({...formData, hackathon: e.target.value})}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Result</label>
            <input
              type="text"
              value={formData.result}
              onChange={(e) => setFormData({...formData, result: e.target.value})}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
            className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            placeholder="React, Solidity, Web3.js"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prize</label>
            <input
              type="text"
              value={formData.prize}
              onChange={(e) => setFormData({...formData, prize: e.target.value})}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demo URL</label>
            <input
              type="url"
              value={formData.demoUrl}
              onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Documentation URL</label>
          <input
            type="url"
            value={formData.documentation}
            onChange={(e) => setFormData({...formData, documentation: e.target.value})}
            className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Team Members (comma-separated)</label>
          <input
            type="text"
            value={formData.teamMembers}
            onChange={(e) => setFormData({...formData, teamMembers: e.target.value})}
            className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            placeholder="Alice Johnson, Bob Smith"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            placeholder="DeFi, Smart Contracts, Web3"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[#949fa8] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0092ff] text-white rounded-md hover:bg-[#0080e6]"
          >
            {project ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
