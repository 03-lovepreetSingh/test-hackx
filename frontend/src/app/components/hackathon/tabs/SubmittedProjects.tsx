import React from 'react';
import { Heart } from 'lucide-react';
import { Badge } from '../../ui/badge';
interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  builder: string;
  lastEdited: string;
  likes: number;
  isHighlighted?: boolean;
  tags: string[];
}
function ProjectCard({
  title,
  description,
  image,
  builder,
  lastEdited,
  likes,
  isHighlighted = false,
  tags
}: ProjectCardProps) {
  return <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md overflow-hidden hover:border-blue-500/50 transition-all">
      <div className="relative">
        {image && <div className="h-40 bg-[#232323] flex items-center justify-center">
            <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
          </div>}
        <button className={`absolute top-2 right-2 flex items-center justify-center p-1 rounded-md ${isHighlighted ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}>
          <Heart className="h-5 w-5" fill={isHighlighted ? 'currentColor' : 'none'} />
          <span className="ml-1 text-xs">{likes}</span>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{description}</p>
        <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <div>Last edited</div>
          <div>{lastEdited}</div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
          <div>Builder</div>
          <div>{builder}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => <Badge key={index} variant="outline" className="bg-[#232323] border-[#2a2a2a] text-xs">
              {tag}
            </Badge>)}
        </div>
      </div>
    </div>;
}
export function SubmittedProjectsTab() {
  const projects = [{
    title: 'Init Club Pro',
    description: "Init Club Pro was born from a simple but radical belief: true innovation shouldn't...",
    builder: 'John McKenzie',
    lastEdited: '6 days ago',
    likes: 5,
    tags: ['DeFi', 'Infra']
  }, {
    title: 'Ward',
    description: "Ward was born from a simple but radical belief: true innovation shouldn't...",
    image: "/01-2-One-hackathon.png",
    builder: 'John McKenzie',
    lastEdited: '6 days ago',
    likes: 10,
    isHighlighted: true,
    tags: ['DeFi', 'Infra']
  }, {
    title: 'Wiral',
    description: "Wiral was born from a simple but radical belief: true innovation shouldn't...",
    builder: 'John McKenzie',
    lastEdited: '6 days ago',
    likes: 5,
    tags: ['DeFi', 'Infra']
  }, {
    title: 'DeFi Pulse',
    description: "DeFi Pulse was born from a simple but radical belief: true innovation shouldn't...",
    builder: 'Emma Wilson',
    lastEdited: '3 days ago',
    likes: 8,
    tags: ['DeFi', 'Analytics']
  }, {
    title: 'BlockVault',
    description: "BlockVault was born from a simple but radical belief: true innovation shouldn't...",
    builder: 'Alex Johnson',
    lastEdited: '5 days ago',
    likes: 7,
    tags: ['Security', 'Storage']
  }, {
    title: 'ChainGuard',
    description: "ChainGuard was born from a simple but radical belief: true innovation shouldn't...",
    builder: 'Sarah Miller',
    lastEdited: '2 days ago',
    likes: 12,
    isHighlighted: true,
    tags: ['Security', 'Monitoring']
  }];
  return <div>
      <h2 className="text-2xl font-bold mb-6">Submitted Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => <ProjectCard key={index} title={project.title} description={project.description} image={project.image} builder={project.builder} lastEdited={project.lastEdited} likes={project.likes} isHighlighted={project.isHighlighted} tags={project.tags} />)}
      </div>
    </div>;
}