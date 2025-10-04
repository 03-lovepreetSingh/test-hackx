import React from 'react'
import { Link2, MoreHorizontal } from 'lucide-react'
export default function ActiveProjects() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Active Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-dashed border-[#2a2a2e] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#0092ff] transition-colors">
          <div className="w-16 h-16 bg-[#0092ff]/20 rounded flex items-center justify-center mb-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                stroke="#0092ff"
                strokeWidth="2"
              />
              <path
                d="M12 8V16"
                stroke="#0092ff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 12H16"
                stroke="#0092ff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[#0092ff] font-medium">Create New Project</span>
        </div>
        <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#16161b] p-2 rounded-md">
                <div className="font-bold text-xl flex items-center">
                  <span>init</span>
                  <span className="text-xs bg-gradient-to-r from-[#0092ff] to-[#4ef467] text-transparent bg-clip-text ml-1">
                    PRO
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8]">
                  <Link2 size={16} />
                </button>
                <button className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Init Club Pro</h3>
              <p className="text-sm text-[#949fa8]">
                PAIRS was born from a simple but radical belief: true innovation
                shouldn't...
              </p>
            </div>
          </div>
          <div className="bg-[#1e1e24] px-6 py-3 text-xs text-[#949fa8]">
            Last edited 6 days ago
          </div>
        </div>
      </div>
    </section>
  )
}
