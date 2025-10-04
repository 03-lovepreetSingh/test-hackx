import React from 'react'
import { ArrowRight, Link, MoreHorizontal } from 'lucide-react'
export default function RegisteredHackathons() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Registered Hackathons</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">ChainSpark Hackathon</h3>
                <span className="ml-2 px-2 py-0.5 text-xs bg-[#4ef467] text-black rounded">
                  Live
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-[#949fa8] mb-6">
              ChainSpark Hackathon was born from a simple but radical belief:
              true innovation shouldn't be strangled by black-box algorithms or
              centralized gatekeepers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-xs text-[#949fa8] mb-1">
                  Registration close
                </div>
                <div className="text-sm">Registration 12 days left</div>
              </div>
              <div>
                <div className="text-xs text-[#949fa8] mb-1">Tech stack</div>
                <div className="text-sm">All tech stack</div>
              </div>
              <div>
                <div className="text-xs text-[#949fa8] mb-1">Level</div>
                <div className="text-sm">All levels accepted</div>
              </div>
              <div>
                <div className="text-xs text-[#949fa8] mb-1">Total prize</div>
                <div className="text-sm">50,000.00 USD</div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-[#0092ff] text-white px-4 py-2 rounded-md flex items-center">
                Submit Project
                <ArrowRight size={16} className="ml-2" />
              </button>
              <button className="ml-3 p-2 rounded-md hover:bg-[#2a2a2e] text-[#949fa8]">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#0092ff] to-[#4ef467] p-6 flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <Link size={16} className="mr-2" />
                <span className="font-medium">ChainSpark</span>
              </div>
              <h3 className="text-xl font-bold mt-1">HACKATHON</h3>
              <div className="text-sm font-medium mt-1">
                DeFi Builders Edition
              </div>
              <div className="text-xs mt-2">
                <span className="font-medium">Smart Contracts</span>
                <span className="mx-2">•</span>
                <span>4 Finalists Promotion</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs">PRIZE</div>
              <div className="text-2xl font-bold">$38,000</div>
              <div className="text-xs mt-2">OCTOBER 12-16, 2024</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
