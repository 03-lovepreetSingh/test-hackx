'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLighthouseHackathons } from '../../hooks/useLighthouseHackathons';
import { lighthouseConfig } from '../../../lib/config';
import { Hackathon, HackathonStatus } from '../../types';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';

interface LighthouseHackathonManagerProps {
  ipns?: string;
}

export function LighthouseHackathonManager({ 
  ipns = lighthouseConfig.defaultIPNS 
}: LighthouseHackathonManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Hackathon>>({});
  
  const {
    hackathons,
    loading,
    error,
    createHackathon,
    updateHackathon,
    deleteHackathon,
    refresh
  } = useLighthouseHackathons({ ipns });

  const handleCreate = async () => {
    if (!formData.title || !formData.description) return;
    
    try {
      await createHackathon({
        title: formData.title,
        description: formData.description,
        status: formData.status || 'live',
        registrationClose: formData.registrationClose || new Date().toISOString(),
        registrationDaysLeft: formData.registrationDaysLeft || 30,
        techStack: formData.techStack || 'All',
        level: formData.level || 'All levels',
        totalPrize: formData.totalPrize || 0,
        location: formData.location || 'Online',
        image: formData.image,
        subtitle: formData.subtitle,
        tags: formData.tags || []
      });
      
      setIsCreating(false);
      setFormData({});
    } catch (error) {
      console.error('Failed to create hackathon:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.title || !formData.description) return;
    
    try {
      await updateHackathon(editingId, formData as Hackathon);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Failed to update hackathon:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hackathon?')) return;
    
    try {
      await deleteHackathon(id);
    } catch (error) {
      console.error('Failed to delete hackathon:', error);
    }
  };

  const startEdit = (hackathon: Hackathon) => {
    setEditingId(hackathon.id);
    setFormData(hackathon);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const startCreate = () => {
    setIsCreating(true);
    setFormData({});
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setFormData({});
  };

  if (loading && hackathons.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading hackathons...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={refresh} variant="outline" className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hackathon Manager</h2>
        <div className="flex gap-2">
          <Button onClick={refresh} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Hackathon
          </Button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Hackathon' : 'Edit Hackathon'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Hackathon title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status || 'live'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as HackathonStatus })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="live">Live</option>
                  <option value="voting">Voting</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tech Stack</label>
                <Input
                  value={formData.techStack || ''}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="React, Node.js, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <Input
                  value={formData.level || ''}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="Beginner, Intermediate, Advanced"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Prize ($)</label>
                <Input
                  type="number"
                  value={formData.totalPrize || ''}
                  onChange={(e) => setFormData({ ...formData, totalPrize: Number(e.target.value) })}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Online, San Francisco, etc."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the hackathon..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <Input
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="AI, Web3, Blockchain"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={isCreating ? handleCreate : handleUpdate}
                disabled={!formData.title || !formData.description}
              >
                {isCreating ? 'Create' : 'Update'}
              </Button>
              <Button onClick={isCreating ? cancelCreate : cancelEdit} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hackathons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hackathons.map((hackathon) => (
          <Card key={hackathon.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(hackathon)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(hackathon.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge 
                variant={hackathon.status === 'live' ? 'default' : 'secondary'}
                className="w-fit"
              >
                {hackathon.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{hackathon.description}</p>
              <div className="space-y-1 text-sm">
                <div><strong>Prize:</strong> ${hackathon.totalPrize.toLocaleString()}</div>
                <div><strong>Location:</strong> {hackathon.location}</div>
                <div><strong>Tech Stack:</strong> {hackathon.techStack}</div>
                <div><strong>Level:</strong> {hackathon.level}</div>
                {hackathon.tags && hackathon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hackathon.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hackathons.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hackathons found. Create your first hackathon!
        </div>
      )}
    </div>
  );
}
