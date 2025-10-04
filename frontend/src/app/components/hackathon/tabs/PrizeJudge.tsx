import React, { useState } from 'react';
import { HackathonInfoCard } from '../../shared/HackathonInfoCard';
interface EvaluationCriteriaProps {
  name: string;
  description: string;
  score: number;
}
interface JudgeProps {
  name: string;
  handle: string;
  avatar?: string;
}
function EvaluationCriteria({
  name,
  description,
  score
}: EvaluationCriteriaProps) {
  return <div className="grid grid-cols-12 py-4 border-b border-[#2a2a2a] text-sm">
      <div className="col-span-2 font-medium">{name}</div>
      <div className="col-span-8 text-gray-300">{description}</div>
      <div className="col-span-2 text-right">{score}</div>
    </div>;
}
function Judge({
  name,
  handle,
  avatar
}: JudgeProps) {
  return <div className="text-center p-4">
      <div className="h-16 w-16 mx-auto mb-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-xl font-bold">
        {avatar ? <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" /> : name[0]}
      </div>
      <div className="font-medium">{name}</div>
      <div className="text-xs text-gray-400">@{handle}</div>
    </div>;
}
function PrizeCategory({
  title,
  amount,
  description,
  items
}: {
  title: string;
  amount: string;
  description: string;
  items: {
    title: string;
    description: string;
    criteria: Array<EvaluationCriteriaProps>;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  return <div className="mb-12">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-xl font-bold">{amount}</h3>
        <button onClick={() => setIsOpen(!isOpen)} className="text-sm text-blue-500 flex items-center">
          Detail Breakdown
          <svg className={`h-4 w-4 ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <p className="text-lg font-medium mb-4">
        {title} ({description})
      </p>
      {isOpen && <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6 mb-6">
          <p className="text-gray-300 mb-6">{items.description}</p>
          <h4 className="text-lg font-medium mb-2">Evaluation Criteria</h4>
          <div className="grid grid-cols-12 py-2 border-b border-[#2a2a2a] text-sm text-gray-400">
            <div className="col-span-2">Name</div>
            <div className="col-span-8">Description</div>
            <div className="col-span-2 text-right">Score</div>
          </div>
          {items.criteria.map((criteria, index) => <EvaluationCriteria key={index} name={criteria.name} description={criteria.description} score={criteria.score} />)}
          <h4 className="text-lg font-medium mt-8 mb-2">Voting</h4>
          <div className="grid grid-cols-12 py-2 border-b border-[#2a2a2a] text-sm text-gray-400">
            <div className="col-span-4">Judges</div>
            <div className="col-span-4">Voting Mode</div>
            <div className="col-span-4">Max Votes per Judge</div>
          </div>
          <div className="grid grid-cols-12 py-4 text-sm">
            <div className="col-span-4">Judges Only</div>
            <div className="col-span-4">Project Scoring</div>
            <div className="col-span-4">100</div>
          </div>
          <h4 className="text-lg font-medium mt-8 mb-4">Judges</h4>
          <div className="grid grid-cols-3 gap-4">
            <Judge name="Wizzy" handle="WizzyOnChain" />
            <Judge name="Doodle" handle="DoodleIntelligence" />
            <Judge name="lynk" handle="lynknow" />
          </div>
        </div>}
    </div>;
}
export function PrizeJudgeTab() {
  const standardCriteria = [{
    name: 'Originality',
    description: 'Is the idea novel and imaginative? Does it offer a new take on an old problem?',
    score: 20
  }, {
    name: 'Relevance to Tech Fairness',
    description: 'Does the project address core fairness challenges (algorithm transparency, data sovereignty, sustainable income, etc.)?',
    score: 25
  }, {
    name: 'Functionality & Implementation',
    description: 'How well is the project executed? Is there a working demo or prototype?',
    score: 20
  }, {
    name: 'Impact & Usefulness',
    description: 'Can this project be applied to real communities or users? Is it scalable or integrable?',
    score: 20
  }, {
    name: 'Design & Clarity',
    description: 'Is the presentation intuitive? Is the design and documentation clear enough to be understood and used?',
    score: 15
  }];
  return <div className="grid grid-cols-3 gap-6">
      <div className="col-span-3 md:col-span-2">
        <PrizeCategory title="Tech Fairness Exploration Awards" amount="18,000 USD" description="9 winners" items={{
        title: 'Tech Fairness Exploration',
        description: 'This track is open to all topics as long as your work addresses "tech fairness." We welcome both builders and storytellers—whether you\'re coding a protocol, designing a governance interface, or building a meme engine.',
        criteria: standardCriteria
      }} />
        <PrizeCategory title="FAIR3 Public Infrastructure Awards" amount="6,000 USD" description="3 winners" items={{
        title: 'FAIR3 Public Infrastructure',
        description: 'This track is open to all topics as long as your work addresses "tech fairness." We welcome both builders and storytellers—whether you\'re coding a protocol, designing a governance interface, or building a meme engine.',
        criteria: standardCriteria
      }} />
        <PrizeCategory title="BRIChain Integration Awards" amount="4,000 USD" description="2 winners" items={{
        title: 'BRIChain Integration',
        description: 'This track is open to all topics as long as your work addresses "tech fairness." We welcome both builders and storytellers—whether you\'re coding a protocol, designing a governance interface, or building a meme engine.',
        criteria: standardCriteria
      }} />
        <PrizeCategory title="Unicorns Special Award" amount="2,000 USD" description="1 winner" items={{
        title: 'Unicorns Special',
        description: 'This track is open to all topics as long as your work addresses "tech fairness." We welcome both builders and storytellers—whether you\'re coding a protocol, designing a governance interface, or building a meme engine.',
        criteria: standardCriteria
      }} />
      </div>
      <div className="col-span-3 md:col-span-1">
        <HackathonInfoCard />
      </div>
    </div>;
}