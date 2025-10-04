"use client"
import React, { useMemo, useState, lazy, memo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Tag,
  Award,
  ArrowLeft,
  Share2,
  Bookmark,
  ExternalLink,
  Code,
  FileText,
  Star,
  Users,
  GitBranch,
  GitCommit,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Link as LinkIcon,
  Terminal,
  Zap,
  Shield,
  AlertTriangle,
  BarChart,
  Github,
} from 'lucide-react'
export function ProjectDetail() {
  const { id } = useParams<{
    id: string
  }>()
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'challenges',
  )
  // This would normally come from an API call using the id
  const project = {
    id: parseInt(id || '1'),
    title: 'DeFi Yield Optimizer',
    status: 'Completed',
    description:
      'An automated yield farming protocol that optimizes returns across multiple DeFi platforms.',
    fullDescription: `
      DeFi Yield Optimizer is an automated protocol designed to maximize returns for liquidity providers and yield farmers in the decentralized finance ecosystem. The protocol analyzes yields across multiple platforms and automatically allocates funds to the most profitable opportunities.
      Our solution addresses the complexity and time-consuming nature of yield farming by providing a simple interface that abstracts away the underlying complexity while implementing sophisticated strategies to maximize returns.
      The protocol includes features like gas optimization, risk assessment, and automated rebalancing to ensure optimal performance in changing market conditions.
    `,
    date: 'April 15, 2024',
    hackathon: 'ChainSpark Hackathon',
    technologies: ['React', 'Solidity', 'Web3.js', 'Hardhat', 'TheGraph'],
    result: '1st Place',
    prize: '$12,000',
    stars: 24,
    forks: 8,
    color: '#0092ff',
    repoUrl: 'https://github.com/defi-yield-optimizer',
    demoUrl: 'https://defi-yield-optimizer.xyz',
    team: [
      {
        name: 'Alex Chen',
        role: 'Lead Developer & Smart Contracts',
        avatar: 'AC',
        github: 'alexchen',
      },
      {
        name: 'Maria Rodriguez',
        role: 'Frontend Developer',
        avatar: 'MR',
        github: 'mariarodriguez',
      },
      {
        name: 'David Kim',
        role: 'Blockchain Engineer',
        avatar: 'DK',
        github: 'davidkim',
      },
      {
        name: 'Sarah Johnson',
        role: 'Product Manager & UX',
        avatar: 'SJ',
        github: 'sarahjohnson',
      },
    ],
    problemStatement: `
      Yield farming in DeFi requires constant monitoring of multiple platforms to find the best returns. Users need to manually move funds between protocols, pay high gas fees, and stay updated on changing APYs. This process is time-consuming, technically complex, and often results in suboptimal returns.
      Additionally, the risk assessment of different protocols is challenging for average users, making it difficult to balance potential returns with security considerations.
    `,
    solution: `
      Our solution automates the entire yield farming process through a smart contract system that:
      1. Continuously monitors yield rates across major DeFi platforms
      2. Implements optimal fund allocation strategies based on APY, risk, and gas costs
      3. Automatically rebalances portfolios when better opportunities arise
      4. Provides a simple dashboard for users to deposit, monitor, and withdraw funds
      5. Implements risk scoring to balance returns with security
      The protocol uses a combination of on-chain and off-chain components to achieve this, with secure oracles providing real-time data on yields and a governance system allowing parameter adjustments.
    `,
    features: [
      {
        name: 'Multi-Protocol Yield Aggregation',
        description:
          'Automatically allocates funds across Aave, Compound, Curve, and other leading DeFi protocols',
      },
      {
        name: 'Gas-Optimized Rebalancing',
        description:
          'Smart rebalancing algorithm that considers gas costs when deciding whether to move funds',
      },
      {
        name: 'Risk Assessment',
        description:
          'Protocol risk scoring system to balance potential returns with platform security',
      },
      {
        name: 'Governance System',
        description:
          'DAO-based governance allowing token holders to vote on protocol parameters and supported platforms',
      },
      {
        name: 'User Dashboard',
        description:
          'Intuitive interface showing current allocations, returns, and historical performance',
      },
    ],
    challenges: [
      {
        challenge: 'Gas Optimization',
        description:
          'Rebalancing funds between protocols can be expensive due to Ethereum gas fees. We implemented batched transactions and optimal timing mechanisms to reduce costs.',
        resolved: true,
      },
      {
        challenge: 'Accurate Yield Data',
        description:
          'Getting reliable, real-time yield data from multiple protocols required building a custom oracle system with fallback mechanisms.',
        resolved: true,
      },
      {
        challenge: 'Smart Contract Security',
        description:
          'Ensuring the security of user funds while interacting with multiple protocols required extensive testing and auditing.',
        resolved: true,
      },
      {
        challenge: 'Flash Loan Protection',
        description:
          'Protecting against flash loan attacks and other DeFi-specific vulnerabilities required implementing rate limits and other security measures.',
        resolved: true,
      },
      {
        challenge: 'Cross-Chain Functionality',
        description:
          'Expanding beyond Ethereum to other chains like Polygon and Optimism presented technical challenges with cross-chain messaging.',
        resolved: false,
      },
    ],
    learnings: [
      'Deep understanding of DeFi protocol integrations and composability',
      'Advanced Solidity patterns for gas optimization',
      'Importance of thorough testing in complex financial systems',
      'Balancing automation with user control in financial applications',
      'Managing security considerations across multiple integrated protocols',
    ],
    futureWork: [
      'Expand to additional blockchains including Solana and Avalanche',
      'Implement more sophisticated yield strategies using derivatives',
      'Develop a mobile application for monitoring and management',
      'Add support for concentrated liquidity positions in Uniswap v3',
      'Integrate with institutional DeFi platforms',
    ],
    screenshots: [
      {
        caption: 'Dashboard Overview',
        description:
          'Main user dashboard showing current allocations and performance',
      },
      {
        caption: 'Strategy Selection',
        description:
          'Interface for selecting risk profiles and yield strategies',
      },
      {
        caption: 'Performance Analytics',
        description:
          'Detailed analytics showing historical performance and comparisons',
      },
    ],
  }
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center mb-4">
        <Link
            href="/archive"
          className="flex items-center text-[#949fa8] hover:text-white"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Projects
        </Link>
      </div>
      <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#2a2a2e]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start">
              <div
                className="h-12 w-12 rounded-md mr-4 flex-shrink-0"
                style={{
                  backgroundColor: project.color,
                }}
              ></div>
              <div>
                <h1 className="text-2xl font-bold">{project.title}</h1>
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
              <button className="p-2 bg-[#1e1e24] rounded-full hover:bg-[#2a2a2e] text-[#949fa8]">
                <Share2 size={20} />
              </button>
              <button className="p-2 bg-[#1e1e24] rounded-full hover:bg-[#2a2a2e] text-[#949fa8]">
                <Bookmark size={20} />
              </button>
            </div>
          </div>
          <p className="text-[#949fa8]">{project.description}</p>
        </div>
        <div className="border-b border-[#2a2a2e]">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'code' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Code & Documentation
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'team' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'challenges' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Challenges & Learnings
            </button>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {activeTab === 'overview' && (
                <section className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Project Overview
                    </h2>
                    <p className="text-[#949fa8] whitespace-pre-line mb-6">
                      {project.fullDescription}
                    </p>
                    <div className="bg-[#1e1e24] p-6 rounded-lg mb-6">
                      <h3 className="font-semibold mb-4">Problem Statement</h3>
                      <p className="text-[#949fa8] whitespace-pre-line">
                        {project.problemStatement}
                      </p>
                    </div>
                    <div className="bg-[#1e1e24] p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Our Solution</h3>
                      <p className="text-[#949fa8] whitespace-pre-line">
                        {project.solution}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.features.map((feature, index) => (
                        <div
                          key={index}
                          className="bg-[#1e1e24] p-4 rounded-lg"
                        >
                          <h3 className="font-medium mb-2">{feature.name}</h3>
                          <p className="text-sm text-[#949fa8]">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                    <div className="space-y-4">
                      {project.screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className="bg-[#1e1e24] p-6 rounded-lg"
                        >
                          <div className="h-48 bg-[#0092ff]/10 rounded-md flex items-center justify-center mb-4">
                            <FileText size={48} className="text-[#0092ff]/40" />
                          </div>
                          <h3 className="font-medium">{screenshot.caption}</h3>
                          <p className="text-sm text-[#949fa8] mt-1">
                            {screenshot.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Future Development
                    </h2>
                    <div className="bg-[#1e1e24] p-6 rounded-lg">
                      <ul className="space-y-3">
                        {project.futureWork.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight
                              width={18}
                              height={18}
                              className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'code' && (
                <section className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Code Repository
                    </h2>
                    <div className="bg-[#1e1e24] p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <Github size={20} className="mr-2 text-[#949fa8]" />
                          <h3 className="font-medium">GitHub Repository</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-500 mr-1" />
                            <span className="text-sm">{project.stars}</span>
                          </div>
                          <div className="flex items-center">
                            <GitBranch
                              size={16}
                              className="text-[#949fa8] mr-1"
                            />
                            <span className="text-sm">{project.forks}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0092ff] text-sm"
                        >
                          {project.repoUrl.replace('https://', '')}
                        </a>
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#16161b] hover:bg-[#2a2a2e] px-3 py-1.5 rounded-md text-sm flex items-center"
                        >
                          View Repository
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                      <div className="border-t border-[#2a2a2e] pt-4">
                        <h4 className="font-medium mb-3">
                          Repository Structure
                        </h4>
                        <div className="space-y-2 text-sm text-[#949fa8]">
                          <div className="flex items-start">
                            <span className="font-mono bg-[#16161b] px-2 py-1 rounded mr-2 w-24">
                              /contracts
                            </span>
                            <span>Smart contracts for yield optimization</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-mono bg-[#16161b] px-2 py-1 rounded mr-2 w-24">
                              /frontend
                            </span>
                            <span>React-based dashboard interface</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-mono bg-[#16161b] px-2 py-1 rounded mr-2 w-24">
                              /scripts
                            </span>
                            <span>Deployment and management scripts</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-mono bg-[#16161b] px-2 py-1 rounded mr-2 w-24">
                              /test
                            </span>
                            <span>Test suite for smart contracts</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-mono bg-[#16161b] px-2 py-1 rounded mr-2 w-24">
                              /subgraph
                            </span>
                            <span>TheGraph subgraph for indexing events</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Live Demo</h2>
                    <div className="bg-[#1e1e24] p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <LinkIcon size={20} className="mr-2 text-[#949fa8]" />
                          <h3 className="font-medium">Demo Application</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0092ff] text-sm"
                        >
                          {project.demoUrl.replace('https://', '')}
                        </a>
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#16161b] hover:bg-[#2a2a2e] px-3 py-1.5 rounded-md text-sm flex items-center"
                        >
                          View Demo
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                      <div className="border-t border-[#2a2a2e] pt-4">
                        <h4 className="font-medium mb-3">Demo Credentials</h4>
                        <div className="space-y-2 text-sm text-[#949fa8]">
                          <div className="flex items-start">
                            <span className="font-mono bg-[#16161b] px-2 py-1 rounded mr-2 w-24">
                              Username
                            </span>
                            <span>demo@example.com</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-mono bg-[#16161b] px-2 py-1 rounded mr-2 w-24">
                              Password
                            </span>
                            <span>demodemo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Technical Documentation
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-[#1e1e24] p-6 rounded-lg">
                        <h3 className="font-medium mb-3">
                          Architecture Overview
                        </h3>
                        <div className="h-48 bg-[#0092ff]/10 rounded-md flex items-center justify-center mb-4">
                          <FileText size={48} className="text-[#0092ff]/40" />
                        </div>
                        <p className="text-sm text-[#949fa8]">
                          The system uses a modular architecture with three main
                          components:
                          <br />
                          <br />
                          1. Smart Contract Core: Handles fund management and
                          strategy execution
                          <br />
                          2. Data Provider Service: Monitors yields across DeFi
                          platforms
                          <br />
                          3. User Interface: React-based dashboard for user
                          interactions
                        </p>
                      </div>
                      <div className="bg-[#1e1e24] p-6 rounded-lg">
                        <h3 className="font-medium mb-3">
                          Smart Contract Integration
                        </h3>
                        <div className="bg-[#16161b] p-4 rounded-md mb-4 font-mono text-sm overflow-x-auto">
                          <code>
                            // YieldOptimizer.sol (simplified example)
                            <br />
                            <br />
                            function deposit() external payable &#123;
                            <br />
                            &nbsp;&nbsp;// Calculate optimal allocation
                            <br />
                            &nbsp;&nbsp;(uint256[] memory amounts, address[]
                            memory platforms) = calculateAllocation(msg.value);
                            <br />
                            <br />
                            &nbsp;&nbsp;// Distribute funds to platforms
                            <br />
                            &nbsp;&nbsp;for (uint i = 0; i &lt;
                            platforms.length; i++) &#123;
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;IPlatformAdapter(platforms[i]).deposit&#123;value:
                            amounts[i]&#125;();
                            <br />
                            &nbsp;&nbsp;&#125;
                            <br />
                            <br />
                            &nbsp;&nbsp;// Update user balance
                            <br />
                            &nbsp;&nbsp;userBalance[msg.sender] += msg.value;
                            <br />
                            &#125;
                          </code>
                        </div>
                        <p className="text-sm text-[#949fa8]">
                          The contract uses adapter patterns to interface with
                          different DeFi protocols while maintaining a
                          consistent API for the core logic.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'team' && (
                <section className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Team Members</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.team.map((member, index) => (
                        <div
                          key={index}
                          className="bg-[#1e1e24] p-6 rounded-lg flex items-start"
                        >
                          <div className="h-16 w-16 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-white font-medium text-xl mr-4 flex-shrink-0">
                            {member.avatar}
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              {member.name}
                            </h3>
                            <p className="text-sm text-[#949fa8] mb-2">
                              {member.role}
                            </p>
                            <a
                              href={`https://github.com/${member.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0092ff] text-sm flex items-center"
                            >
                              <Github size={14} className="mr-1" />
                              {member.github}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Team Collaboration
                    </h2>
                    <div className="bg-[#1e1e24] p-6 rounded-lg">
                      <h3 className="font-medium mb-4">Development Process</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Terminal
                            size={18}
                            className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="font-medium">Agile Development</div>
                            <div className="text-sm text-[#949fa8]">
                              Used one-week sprints with daily standups to track
                              progress and address blockers
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <GitBranch
                            size={18}
                            className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="font-medium">Version Control</div>
                            <div className="text-sm text-[#949fa8]">
                              Git workflow with feature branches and pull
                              request reviews
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle
                            size={18}
                            className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="font-medium">Testing Strategy</div>
                            <div className="text-sm text-[#949fa8]">
                              Comprehensive test suite with unit, integration,
                              and end-to-end tests
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MessageSquare
                            size={18}
                            className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="font-medium">Communication</div>
                            <div className="text-sm text-[#949fa8]">
                              Regular team meetings and Discord channel for
                              async communication
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Roles & Responsibilities
                    </h2>
                    <div className="bg-[#1e1e24] p-6 rounded-lg">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">
                            Alex Chen - Lead Developer & Smart Contracts
                          </h3>
                          <ul className="space-y-1 text-sm text-[#949fa8]">
                            <li>• Architected the overall system design</li>
                            <li>• Developed core smart contract logic</li>
                            <li>• Implemented protocol integrations</li>
                            <li>• Led security reviews and testing</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">
                            Maria Rodriguez - Frontend Developer
                          </h3>
                          <ul className="space-y-1 text-sm text-[#949fa8]">
                            <li>• Designed and implemented user interface</li>
                            <li>• Created interactive dashboard components</li>
                            <li>• Integrated Web3 wallet connections</li>
                            <li>• Built data visualization features</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">
                            David Kim - Blockchain Engineer
                          </h3>
                          <ul className="space-y-1 text-sm text-[#949fa8]">
                            <li>• Developed protocol adapters</li>
                            <li>• Created yield monitoring system</li>
                            <li>• Implemented gas optimization strategies</li>
                            <li>• Built TheGraph subgraph for data indexing</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">
                            Sarah Johnson - Product Manager & UX
                          </h3>
                          <ul className="space-y-1 text-sm text-[#949fa8]">
                            <li>• Defined product requirements</li>
                            <li>• Created user flows and wireframes</li>
                            <li>• Conducted user research and testing</li>
                            <li>
                              • Prepared project documentation and presentation
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'challenges' && (
                <section className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Technical Challenges
                    </h2>
                    <div className="space-y-4">
                      {project.challenges.map((challenge, index) => (
                        <div
                          key={index}
                          className="bg-[#1e1e24] p-6 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              {challenge.resolved ? (
                                <CheckCircle
                                  size={18}
                                  className="mr-2 text-green-500 mt-1 flex-shrink-0"
                                />
                              ) : (
                                <AlertTriangle
                                  size={18}
                                  className="mr-2 text-yellow-500 mt-1 flex-shrink-0"
                                />
                              )}
                              <div>
                                <h3 className="font-medium">
                                  {challenge.challenge}
                                </h3>
                                <p className="text-sm text-[#949fa8] mt-1">
                                  {challenge.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs px-2 py-1 rounded bg-[#16161b] text-[#949fa8]">
                              {challenge.resolved ? 'Resolved' : 'In Progress'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Key Learnings
                    </h2>
                    <div className="bg-[#1e1e24] p-6 rounded-lg">
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start">
                            <Zap
                              size={18}
                              className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                            />
                            <span>{learning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <button
                      className="w-full bg-[#1e1e24] p-6 rounded-lg flex items-center justify-between"
                      onClick={() => toggleSection('security')}
                    >
                      <div className="flex items-center">
                        <Shield size={18} className="mr-2 text-[#0092ff]" />
                        <h2 className="text-lg font-medium">
                          Security Considerations
                        </h2>
                      </div>
                      {expandedSection === 'security' ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    {expandedSection === 'security' && (
                      <div className="bg-[#1e1e24] p-6 pt-2 rounded-lg mt-1">
                        <p className="text-[#949fa8] mb-4">
                          Security was a primary concern given the financial
                          nature of the application. We implemented multiple
                          layers of protection:
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <CheckCircle
                              size={16}
                              className="mr-2 text-green-500 mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <div className="font-medium">
                                Comprehensive Testing
                              </div>
                              <div className="text-sm text-[#949fa8]">
                                100% test coverage for all smart contracts
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle
                              size={16}
                              className="mr-2 text-green-500 mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <div className="font-medium">External Audit</div>
                              <div className="text-sm text-[#949fa8]">
                                Security audit conducted by blockchain security
                                experts
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle
                              size={16}
                              className="mr-2 text-green-500 mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <div className="font-medium">Rate Limiting</div>
                              <div className="text-sm text-[#949fa8]">
                                Implementation of deposit/withdrawal limits to
                                prevent flash loan attacks
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle
                              size={16}
                              className="mr-2 text-green-500 mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <div className="font-medium">Emergency Pause</div>
                              <div className="text-sm text-[#949fa8]">
                                Circuit breaker pattern to pause operations in
                                case of detected vulnerabilities
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle
                              size={16}
                              className="mr-2 text-green-500 mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <div className="font-medium">Access Control</div>
                              <div className="text-sm text-[#949fa8]">
                                Role-based permissions for administrative
                                functions
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      className="w-full bg-[#1e1e24] p-6 rounded-lg flex items-center justify-between"
                      onClick={() => toggleSection('performance')}
                    >
                      <div className="flex items-center">
                        <BarChart size={18} className="mr-2 text-[#0092ff]" />
                        <h2 className="text-lg font-medium">
                          Performance Optimization
                        </h2>
                      </div>
                      {expandedSection === 'performance' ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    {expandedSection === 'performance' && (
                      <div className="bg-[#1e1e24] p-6 pt-2 rounded-lg mt-1">
                        <p className="text-[#949fa8] mb-4">
                          We implemented several optimizations to enhance both
                          on-chain and off-chain performance:
                        </p>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">
                              Gas Optimization
                            </h3>
                            <ul className="space-y-1 text-sm text-[#949fa8]">
                              <li>
                                • Used storage packing to reduce gas costs
                              </li>
                              <li>
                                • Implemented batched transactions where
                                possible
                              </li>
                              <li>• Optimized loops and data structures</li>
                              <li>
                                • Used assembly for certain low-level operations
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">
                              Frontend Performance
                            </h3>
                            <ul className="space-y-1 text-sm text-[#949fa8]">
                              <li>
                                • Implemented code splitting and lazy loading
                              </li>
                              <li>
                                • Used memo and useMemo for expensive
                                calculations
                              </li>
                              <li>
                                • Optimized API calls with caching and batching
                              </li>
                              <li>
                                • Minimized reflows and repaints in UI updates
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">
                              Indexing & Data Access
                            </h3>
                            <ul className="space-y-1 text-sm text-[#949fa8]">
                              <li>
                                • Built a TheGraph subgraph for efficient data
                                querying
                              </li>
                              <li>
                                • Implemented caching layer for frequently
                                accessed data
                              </li>
                              <li>• Used WebSockets for real-time updates</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-[#1e1e24] p-6 rounded-lg sticky top-6">
                <h3 className="font-semibold mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar
                      size={18}
                      className="mr-3 text-[#949fa8] mt-0.5"
                    />
                    <div>
                      <div className="font-medium">Completion Date</div>
                      <div className="text-sm text-[#949fa8]">
                        {project.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award size={18} className="mr-3 text-[#949fa8] mt-0.5" />
                    <div>
                      <div className="font-medium">Result</div>
                      <div className="text-sm text-[#949fa8]">
                        {project.result}
                      </div>
                      <div className="text-sm text-[#949fa8]">
                        Prize: {project.prize}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Tag size={18} className="mr-3 text-[#949fa8] mt-0.5" />
                    <div>
                      <div className="font-medium">Technologies</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="bg-[#16161b] text-[#949fa8] text-xs px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users size={18} className="mr-3 text-[#949fa8] mt-0.5" />
                    <div>
                      <div className="font-medium">Team Size</div>
                      <div className="text-sm text-[#949fa8]">
                        {project.team.length} members
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <LinkIcon
                      size={18}
                      className="mr-3 text-[#949fa8] mt-0.5"
                    />
                    <div>
                      <div className="font-medium">Links</div>
                      <div className="space-y-1 mt-1">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0092ff] flex items-center"
                        >
                          <Github size={14} className="mr-1" />
                          GitHub Repository
                        </a>
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0092ff] flex items-center"
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Live Demo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0092ff] text-white w-full py-2.5 rounded-md flex items-center justify-center font-medium"
                  >
                    View Code
                    <Code size={16} className="ml-2" />
                  </a>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#16161b] text-white w-full py-2.5 rounded-md flex items-center justify-center font-medium hover:bg-[#2a2a2e]"
                  >
                    View Demo
                    <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
              <div className="bg-[#1e1e24] p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Share This Project</h3>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-[#16161b] hover:bg-[#2a2a2e] p-2 rounded-md flex items-center justify-center">
                    <Twitter width={18} height={18} className="mr-2" />
                    <span className="text-sm">Twitter</span>
                  </button>
                  <button className="flex-1 bg-[#16161b] hover:bg-[#2a2a2e] p-2 rounded-md flex items-center justify-center">
                    <Linkedin width={18} height={18} className="mr-2" />
                    <span className="text-sm">LinkedIn</span>
                  </button>
                  <button className="flex-1 bg-[#16161b] hover:bg-[#2a2a2e] p-2 rounded-md flex items-center justify-center">
                    <Share2 size={18} className="mr-2" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// Import missing from lucide-react
const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)
const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)
