"use client"
import React, { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Clock, Upload, Link2, Plus, X, Trophy, Target, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

interface PrizeTier {
  position: string;
  amount: number;
  description: string;
}

interface Judge {
  name: string;
  email: string;
  title: string;
  company: string;
}

interface Organizer {
  name: string;
  email: string;
  role: string;
}

export default function CreateHackathonPage() {
  // Basic Information
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    mode: 'online',
    maxParticipants: 100,
    minTeamSize: 1,
    maxTeamSize: 4,
    tags: [] as string[]
  });

  // Timeline
  const [timeline, setTimeline] = useState({
    startDate: '',
    endDate: '',
    registrationStart: '',
    registrationEnd: '',
    judgingStart: '',
    judgingEnd: '',
    announcementDate: ''
  });

  // Prizes
  const [prizes, setPrizes] = useState<PrizeTier[]>([
    { position: '1st Place', amount: 10000, description: 'Grand Prize Winner' },
    { position: '2nd Place', amount: 5000, description: 'Runner Up' },
    { position: '3rd Place', amount: 2500, description: 'Third Place' }
  ]);

  // Judges
  const [judges, setJudges] = useState<Judge[]>([]);

  // Organizers
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  // Additional Info
  const [additionalInfo, setAdditionalInfo] = useState({
    eligibility: '',
    rules: '',
    judgingCriteria: '',
    resources: '',
    contactEmail: '',
    website: '',
    discord: '',
    twitter: ''
  });

  const [availableTags] = useState([
    'Web3', 'DeFi', 'NFT', 'AI/ML', 'Gaming', 'SocialFi', 'Infrastructure',
    'Security', 'DAO', 'RWA', 'Mobile', 'Open Source'
  ]);

  const [formProgress, setFormProgress] = useState(0);

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addPrize = () => {
    setPrizes(prev => [...prev, { position: '', amount: 0, description: '' }]);
  };

  const removePrize = (index: number) => {
    setPrizes(prev => prev.filter((_, i) => i !== index));
  };

  const updatePrize = (index: number, field: keyof PrizeTier, value: string | number) => {
    setPrizes(prev => prev.map((prize, i) =>
      i === index ? { ...prize, [field]: value } : prize
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Combine all form data into the expected format
      const hackathonData = {
        ...formData,
        ...timeline,
        prizes,
        judges,
        organizers,
        ...additionalInfo,
        // Generate ID and timestamps
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        // Set default status
        status: 'live',
        // Calculate additional fields
        totalPrize: prizes.reduce((total, prize) => total + prize.amount, 0),
        registrationDaysLeft: timeline.registrationEnd ?
          Math.max(0, Math.ceil((new Date(timeline.registrationEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0,
        registrationClose: timeline.registrationEnd,
        techStack: formData.category,
        level: 'All levels',
        location: formData.mode === 'online' ? 'Online' : 'TBD'
      };

      console.log('🚀 Creating hackathon with data:', hackathonData);

      const response = await fetch('/api/hackathons-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hackathonData),
      });

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (result.success) {
        alert(`Hackathon created successfully!\n\nTitle: ${hackathonData.title}\nSlug: ${result.data.slug}\nID: ${result.data.id}\n\nYour hackathon has been published to IPFS and IPNS!`);
        // Optional: redirect to the hackathon page
        // window.location.href = `/hackathons/${result.data.slug}`;
      } else {
        console.error('❌ API Error:', result);
        alert(`Error creating hackathon: ${result.error}\n\nPlease check your network connection and try again.`);
      }
    } catch (error) {
      console.error('❌ Submit Error:', error);
      alert('Failed to create hackathon. Please check your network connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#2a2a2a] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create New Hackathon</h1>
          <p className="text-gray-400">Set up an amazing hackathon experience for developers</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Setup Progress</span>
              <span>{Math.round(formProgress)}%</span>
            </div>
            <Progress value={formProgress} className="bg-[#1a1a1a]" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-[#2a2a2a] bg-[#111111]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Hackathon Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter hackathon title"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="Brief description for listings (max 200 characters)"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of your hackathon"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                      className="w-full p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">Select category</option>
                      <option value="web3">Web3 & Blockchain</option>
                      <option value="ai">AI & Machine Learning</option>
                      <option value="mobile">Mobile Development</option>
                      <option value="gaming">Gaming & VR</option>
                      <option value="fintech">FinTech</option>
                      <option value="social">Social Impact</option>
                      <option value="open-source">Open Source</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <select
                      className="w-full p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.mode}
                      onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value }))}
                    >
                      <option value="online">Online Only</option>
                      <option value="offline">In-Person Only</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      placeholder="100"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minTeamSize">Min Team Size</Label>
                    <Input
                      id="minTeamSize"
                      type="number"
                      placeholder="1"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={formData.minTeamSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, minTeamSize: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTeamSize">Max Team Size</Label>
                    <Input
                      id="maxTeamSize"
                      type="number"
                      placeholder="4"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={formData.maxTeamSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxTeamSize: parseInt(e.target.value) || 4 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.filter(tag => !formData.tags.includes(tag)).map(tag => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(tag)}
                        className="text-xs"
                      >
                        + {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-[#2a2a2a] bg-[#111111]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline & Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Hackathon Start Date *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={timeline.startDate}
                      onChange={(e) => setTimeline(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Hackathon End Date *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={timeline.endDate}
                      onChange={(e) => setTimeline(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationStart">Registration Start *</Label>
                    <Input
                      id="registrationStart"
                      type="datetime-local"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={timeline.registrationStart}
                      onChange={(e) => setTimeline(prev => ({ ...prev, registrationStart: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationEnd">Registration End *</Label>
                    <Input
                      id="registrationEnd"
                      type="datetime-local"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={timeline.registrationEnd}
                      onChange={(e) => setTimeline(prev => ({ ...prev, registrationEnd: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="judgingStart">Judging Period Start</Label>
                    <Input
                      id="judgingStart"
                      type="datetime-local"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={timeline.judgingStart}
                      onChange={(e) => setTimeline(prev => ({ ...prev, judgingStart: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="judgingEnd">Judging Period End</Label>
                    <Input
                      id="judgingEnd"
                      type="datetime-local"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={timeline.judgingEnd}
                      onChange={(e) => setTimeline(prev => ({ ...prev, judgingEnd: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="announcementDate">Winners Announcement</Label>
                  <Input
                    id="announcementDate"
                    type="datetime-local"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    value={timeline.announcementDate}
                    onChange={(e) => setTimeline(prev => ({ ...prev, announcementDate: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prizes */}
            <Card className="border-[#2a2a2a] bg-[#111111]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Prize Pool & Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prizes.map((prize, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4 space-y-2">
                      <Label>Position</Label>
                      <Input
                        placeholder="1st Place"
                        className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                        value={prize.position}
                        onChange={(e) => updatePrize(index, 'position', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label>Amount (USD)</Label>
                      <Input
                        type="number"
                        placeholder="10000"
                        className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                        value={prize.amount}
                        onChange={(e) => updatePrize(index, 'amount', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Grand Prize Winner"
                        className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                        value={prize.description}
                        onChange={(e) => updatePrize(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removePrize(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addPrize}
                  className="w-full border-dashed border-[#2a2a2a]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prize Tier
                </Button>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="border-[#2a2a2a] bg-[#111111]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Rules & Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eligibility">Eligibility Criteria</Label>
                  <Textarea
                    id="eligibility"
                    placeholder="Who can participate? Age restrictions, location requirements, etc."
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    rows={3}
                    value={additionalInfo.eligibility}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, eligibility: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rules">Rules & Guidelines</Label>
                  <Textarea
                    id="rules"
                    placeholder="Hackathon rules, submission requirements, etc."
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    rows={4}
                    value={additionalInfo.rules}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, rules: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="judgingCriteria">Judging Criteria</Label>
                  <Textarea
                    id="judgingCriteria"
                    placeholder="How will projects be judged? Innovation, technical complexity, design, etc."
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    rows={3}
                    value={additionalInfo.judgingCriteria}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, judgingCriteria: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resources">Resources & Mentors</Label>
                  <Textarea
                    id="resources"
                    placeholder="Available resources, mentorship opportunities, APIs, etc."
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    rows={3}
                    value={additionalInfo.resources}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, resources: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-[#2a2a2a] bg-[#111111]">
              <CardHeader>
                <CardTitle>Contact & Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="contact@hackathon.com"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={additionalInfo.contactEmail}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://hackathon.com"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={additionalInfo.website}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discord">Discord Server</Label>
                    <Input
                      id="discord"
                      type="url"
                      placeholder="https://discord.gg/hackathon"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={additionalInfo.discord}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, discord: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      type="url"
                      placeholder="https://twitter.com/hackathon"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      value={additionalInfo.twitter}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, twitter: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Create Hackathon
              </Button>
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <Card className="border-[#2a2a2a] bg-[#111111] sticky top-6">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {formData.title || "Hackathon Title"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {formData.shortDescription || "Short description will appear here"}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {timeline.startDate ? new Date(timeline.startDate).toLocaleDateString() : "Dates TBA"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{formData.mode === 'online' ? 'Online' : formData.mode === 'offline' ? 'In-Person' : 'Hybrid'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="h-4 w-4" />
                      <span>
                        ${prizes.reduce((total, prize) => total + prize.amount, 0).toLocaleString()} in prizes
                      </span>
                    </div>
                  </div>

                  {formData.tags.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-[#2a2a2a] bg-[#111111]">
              <CardHeader>
                <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-400 space-y-2">
                <p>• Be specific about your hackathon's focus and goals</p>
                <p>• Set realistic timelines for participants</p>
                <p>• Offer attractive prizes to attract quality projects</p>
                <p>• Provide clear judging criteria upfront</p>
                <p>• Plan for community engagement and support</p>
                <p>• Include resources and mentorship opportunities</p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}