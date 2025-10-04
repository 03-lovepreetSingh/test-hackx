import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
interface HackathonHeaderProps {
  hackathonId: string;
  activeTab: string;
  onTabChange: (value: string) => void;
}
export function HackathonHeader({
  hackathonId,
  activeTab,
  onTabChange
}: HackathonHeaderProps) {
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Link href="/hackathons" className="inline-flex items-center text-sm text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Hackathons
        </Link>
        <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-[#2a2a2a]">
          <Share2 className="h-4 w-4 mr-2" />
          Share Link
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md h-12 p-1">
          <TabsTrigger value="overview" className={`flex-1 ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400'} rounded data-[state=active]:shadow-none`}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="prize-judge" className={`flex-1 ${activeTab === 'prize-judge' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400'} rounded data-[state=active]:shadow-none`}>
            Prize & Judge
          </TabsTrigger>
          <TabsTrigger value="schedule" className={`flex-1 ${activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400'} rounded data-[state=active]:shadow-none`}>
            Schedule
          </TabsTrigger>
          <TabsTrigger value="projects" className={`flex-1 ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400'} rounded data-[state=active]:shadow-none`}>
            Submitted Projects
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <h1 className="text-2xl font-bold">ChainSpark Hackathon</h1>
    </div>;
}