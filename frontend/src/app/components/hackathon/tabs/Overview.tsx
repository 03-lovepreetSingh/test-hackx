import React from 'react';
import { Link } from 'lucide-react';
import { HackathonInfoCard } from '../../shared/HackathonInfoCard';
export function OverviewTab() {
  return <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="h-64 bg-gradient-to-r from-blue-900 to-blue-700 rounded-md flex items-center justify-center p-8">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <Link className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white uppercase">
              HACKATHON
            </h2>
            <p className="text-xl text-yellow-400 font-medium">
              DeFi Builders Edition
            </p>
            <div className="text-white/80 text-sm">
              <p>Smart Contracts</p>
              <p>& Financial Inclusion</p>
            </div>
            <div className="mt-4">
              <p className="text-white/80 text-sm">PRIZE:</p>
              <p className="text-3xl font-bold text-white">$38,000</p>
              <p className="text-white/80 text-sm mt-1">OCTOBER 12-16, 2024</p>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ChainSpark Hackathon</h3>
            <p className="text-lg">
              Calling All Builders, Dreamers, and Rule-Breakers!
            </p>
          </div>
          <div className="text-gray-300 space-y-4">
            <p>
              The crypto world is a wild ride—full of chaos, opportunity, and
              endless what-ifs. But one thing's for sure: Innovation thrives
              where builders and storytellers collide. That's why FAIR3 and CARV
              are teaming up to launch the Tech Fairness Hackathon, a
              high-octane sprint to redefine the future of AI, Data, and Web3.
            </p>
            <p>
              This isn't just another hackathon. It's a battlefield for
              fairness, a playground for disruptors, and a launchpad for the
              next wave of decentralized innovation. Whether you're an AI wizard
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">50,000 USD</h3>
              <button className="text-sm text-blue-500 flex items-center">
                Detail Breakdown
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-1">Available in Prizes</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tech Fairness Exploration Awards (9 winners)</span>
                <span className="font-medium">18,000 USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>FAIR3 Public Infrastructure Awards (3 winners)</span>
                <span className="font-medium">6,000 USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>BRIChain Integration Awards (2 winners)</span>
                <span className="font-medium">4,000 USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Unicorns Special Award (1 winner)</span>
                <span className="font-medium">2,000 USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>AI Agent Infrastructure on SVM Chain (2 winners)</span>
                <span className="font-medium">4,000 USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  Decentralized Data Orchestration with D.A.T.A. Framework (2
                  winners)
                </span>
                <span className="font-medium">4,000 USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  Mutual Identity & Reputation with CARV ID (SEC-1231) (2
                  winners)
                </span>
                <span className="font-medium">4,000 USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  Open Innovation: AI + Web3 for Real World Use Cases (4
                  winners)
                </span>
                <span className="font-medium">8,000 USD</span>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {Array.from({
            length: 3
          }).map((_, index) => <div key={index} className="space-y-4">
                <h3 className="text-xl font-bold">Why ChainSpark Hackathon?</h3>
                <h4 className="text-lg font-medium">
                  Saluting the Early Rebels—Redefining Data & Collaboration
                </h4>
                <p className="text-gray-300">
                  ChainSpark Hackathon was born from a simple but radical
                  belief: true innovation shouldn't be strangled by black-box
                  algorithms or centralized gatekeepers. In an era of platform
                  monopolies and diluted creator value, ChainSpark is rallying
                  builders to forge a transparent, platform-agnostic, and
                  verifiable future for data governance and the creator economy.
                </p>
              </div>)}
          </div>
        </div>
      </div>
      <div>
        <HackathonInfoCard />
      </div>
    </div>;
}