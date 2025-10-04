import React, { useState } from 'react';
import { Link2, Plus, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
export function CreateProjectForm() {
  const [sectors, setSectors] = useState<string[]>([]);
  const [projectProgress, setProjectProgress] = useState(65);
  const toggleSector = (sector: string) => {
    if (sectors.includes(sector)) {
      setSectors(sectors.filter(s => s !== sector));
    } else {
      setSectors([...sectors, sector]);
    }
  };
  return <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* Project Logo */}
        <div className="space-y-2">
          <Label>Project Logo</Label>
          <div className="border border-dashed border-[#2a2a2a] rounded-lg bg-[#111111] h-40 w-40 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-2">
              <Link2 className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400">
              Drag/drop project logo here or
            </p>
            <button className="text-blue-400 text-xs mt-1">
              Click to browse
            </button>
          </div>
        </div>
        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            type="text"
            id="projectName"
            placeholder="Enter project name"
            className="bg-[#111111] border-[#2a2a2a] text-white focus:ring-blue-500"
          />
        </div>
        {/* Project Intro */}
        <div className="space-y-2">
          <Label htmlFor="projectIntro">Project Intro</Label>
          <Textarea
            id="projectIntro"
            placeholder="Short project intro"
            className="bg-[#111111] border-[#2a2a2a] text-white focus:ring-blue-500 min-h-[100px]"
          />
        </div>
        {/* Pitch Video */}
        <div className="space-y-2">
          <Label>
            Pitch Video <span className="text-gray-500">(optional)</span>
          </Label>
          <div className="border border-[#2a2a2a] rounded-lg bg-[#111111] aspect-video flex flex-col items-center justify-center p-6">
            <div className="flex gap-4">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Link2 className="h-4 w-4" />
                Add Video Link
              </Button>
            </div>
          </div>
        </div>
        {/* Sector */}
        <div className="space-y-2">
          <Label>Sector</Label>
          <div className="flex flex-wrap gap-2">
            {['SocialFi', 'DeFi', 'NFT', 'Infra', 'Gaming', 'DAO', 'RWA', 'AI', 'Other'].map(sector => <Button key={sector} variant={sectors.includes(sector) ? "default" : "outline"} className={`px-3 py-1.5 text-sm ${sectors.includes(sector) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-gray-400'}`} onClick={() => toggleSector(sector)}>
                {sectors.includes(sector) ? '- ' : '+ '}
                {sector}
              </Button>)}
          </div>
        </div>
        {/* Progress During Hackathon */}
        <div className="space-y-2">
          <Label htmlFor="progress">Progress During Hackathon</Label>
          <Textarea
            id="progress"
            placeholder="Describe what you have accomplished during the hackathon"
            className="bg-[#111111] border-[#2a2a2a] text-white focus:ring-blue-500 min-h-[100px]"
          />
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{projectProgress}%</span>
            </div>
            <Progress value={projectProgress} className="bg-[#1a1a1a]" />
          </div>
        </div>
        {/* Fundraising Status */}
        <div className="space-y-2">
          <Label htmlFor="fundraising">Fundraising Status</Label>
          <Textarea
            id="fundraising"
            placeholder="Have you raised any money already? How much do you need to finish the product? Etc."
            className="bg-[#111111] border-[#2a2a2a] text-white focus:ring-blue-500 min-h-[100px]"
          />
        </div>
        {/* Full Description */}
        <div className="space-y-2">
          <Label>Full Description</Label>
          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] p-2 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-2">
                  <button className="flex items-center gap-2 px-2 py-1 text-sm">
                    Paragraph text
                    <span className="border-l border-[#2a2a2a] pl-2 ml-2">
                      14
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-[#252525] rounded font-bold">
                    B
                  </button>
                  <button className="p-1 hover:bg-[#252525] rounded italic">
                    I
                  </button>
                  <button className="p-1 hover:bg-[#252525] rounded underline">
                    U
                  </button>
                  <button className="p-1 hover:bg-[#252525] rounded">S</button>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-[#252525] rounded">
                  <Link2 className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-[#252525] rounded">
                  <span className="block h-4 w-4">@</span>
                </button>
              </div>
            </div>
            <Textarea
              className="w-full p-4 bg-[#111111] text-white focus:outline-none min-h-[300px] border-0"
              placeholder="Write a detailed description of your project..."
            />
          </div>
        </div>
      </div>
    </div>;
}