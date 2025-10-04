"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  ExternalLink,
  ArrowLeft,
  Share2,
  Bookmark,
  MessageCircle,
  User,
  BarChart,
  CheckCircle,
  Award,
} from 'lucide-react'
export function CommunityEventsDetail() {
  const { id } = useParams<{
    id: string
  }>()
  // This would normally come from an API call using the id
  const camp = {
    id: parseInt(id || '1'),
    title: 'Ethereum Developer Bootcamp',
    status: 'Enrolling',
    description:
      'A comprehensive 8-week bootcamp covering Ethereum development from basics to advanced smart contract programming.',
    fullDescription: `
      The Ethereum Developer Bootcamp is designed to take you from blockchain fundamentals to advanced Ethereum development over an 8-week intensive program.
      This bootcamp combines theoretical knowledge with hands-on projects, giving you the practical experience needed to build production-ready decentralized applications.
      By the end of this program, you'll have a solid understanding of Solidity programming, smart contract security, testing methodologies, and frontend integration with Web3 libraries.
    `,
    startDate: 'June 1, 2024',
    endDate: 'July 27, 2024',
    schedule:
      'Tuesdays & Thursdays, 6:00 PM - 8:00 PM + Saturday labs, 10:00 AM - 2:00 PM',
    duration: '8 weeks',
    difficulty: 'Intermediate',
    prerequisites: 'Basic programming knowledge, familiarity with JavaScript',
    students: 120,
    maxStudents: 150,
    enrollmentDays: 15,
    bannerGradient: 'from-[#0092ff] to-[#4ef467]',
    tags: ['Ethereum', 'Solidity', 'Smart Contracts'],
    price: '$1,499',
    instructor: {
      name: 'Alex Rivera',
      role: 'Senior Blockchain Developer',
      bio: 'Alex has 7+ years of experience in blockchain development and has worked on major DeFi protocols. He previously taught at Blockchain University and has mentored over 500 developers.',
      avatar: 'AR',
    },
    modules: [
      {
        title: 'Week 1: Blockchain Fundamentals',
        topics: [
          'Introduction to blockchain technology',
          'Cryptographic primitives',
          'Consensus mechanisms',
          'Ethereum architecture overview',
        ],
      },
      {
        title: 'Week 2: Solidity Basics',
        topics: [
          'Solidity syntax and data types',
          'Functions and modifiers',
          'Contract structure',
          'Development environment setup',
        ],
      },
      {
        title: 'Week 3: Smart Contract Development',
        topics: [
          'ERC token standards',
          'Contract inheritance and interfaces',
          'Events and logging',
          'Gas optimization',
        ],
      },
      {
        title: 'Week 4: Testing and Deployment',
        topics: [
          'Unit testing with Hardhat',
          'Test-driven development',
          'Deployment strategies',
          'Network considerations',
        ],
      },
      {
        title: 'Week 5: Security Best Practices',
        topics: [
          'Common vulnerabilities',
          'Security audit process',
          'Formal verification',
          'Secure development lifecycle',
        ],
      },
      {
        title: 'Week 6: DeFi Protocols',
        topics: [
          'Automated Market Makers',
          'Lending protocols',
          'Yield optimization',
          'Protocol integration',
        ],
      },
      {
        title: 'Week 7: Frontend Integration',
        topics: [
          'Web3.js and ethers.js',
          'React dApp development',
          'Wallet integration',
          'User experience considerations',
        ],
      },
      {
        title: 'Week 8: Capstone Project',
        topics: [
          'Project planning and architecture',
          'Implementation and testing',
          'Deployment to testnet/mainnet',
          'Final presentation',
        ],
      },
    ],
    outcomes: [
      'Build and deploy secure smart contracts',
      'Develop full-stack decentralized applications',
      'Understand DeFi protocol mechanics',
      'Implement best security practices',
      'Create and integrate ERC token standards',
    ],
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center mb-4">
        <Link
          href="/learning-camps"
          className="flex items-center text-[#949fa8] hover:text-white"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Learning Camps
        </Link>
      </div>
      <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${camp.bannerGradient} p-10`}>
          <div className="flex justify-between">
            <div>
              <span
                className={`px-2 py-0.5 text-xs rounded ${camp.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' : camp.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}
              >
                {camp.difficulty}
              </span>
              <span
                className={`ml-2 px-2 py-0.5 text-xs ${camp.status === 'Enrolling' ? 'bg-[#4ef467] text-black' : camp.status === 'In Progress' ? 'bg-[#0092ff] text-white' : 'bg-[#949fa8] text-black'} rounded`}
              >
                {camp.status}
              </span>
              <h1 className="text-3xl font-bold mt-2">{camp.title}</h1>
              <p className="text-lg mt-2">Instructor: {camp.instructor.name}</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                <Share2 size={20} />
              </button>
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                <Bookmark size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">About This Camp</h2>
                <p className="text-[#949fa8] whitespace-pre-line">
                  {camp.fullDescription}
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4">
                  What You'll Learn
                </h2>
                <div className="space-y-4">
                  {camp.modules.map((module, index) => (
                    <div key={index} className="bg-[#1e1e24] p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{module.title}</h3>
                      <ul className="space-y-1">
                        {module.topics.map((topic, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle
                              size={16}
                              className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                            />
                            <span className="text-sm text-[#949fa8]">
                              {topic}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4">
                  Learning Outcomes
                </h2>
                <div className="bg-[#1e1e24] p-4 rounded-lg">
                  <ul className="space-y-3">
                    {camp.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <Award
                          size={18}
                          className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                        />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4">Instructor</h2>
                <div className="bg-[#1e1e24] p-6 rounded-lg flex items-start">
                  <div className="h-16 w-16 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-white font-medium text-xl mr-4 flex-shrink-0">
                    {camp.instructor.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {camp.instructor.name}
                    </h3>
                    <p className="text-sm text-[#949fa8] mb-2">
                      {camp.instructor.role}
                    </p>
                    <p className="text-sm text-[#949fa8]">
                      {camp.instructor.bio}
                    </p>
                  </div>
                </div>
              </section>
            </div>
            <div className="space-y-6">
              <div className="bg-[#1e1e24] p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Camp Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar
                      size={18}
                      className="mr-3 text-[#949fa8] mt-0.5"
                    />
                    <div>
                      <div className="font-medium">Dates</div>
                      <div className="text-sm text-[#949fa8]">
                        Start: {camp.startDate}
                      </div>
                      <div className="text-sm text-[#949fa8]">
                        End: {camp.endDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock size={18} className="mr-3 text-[#949fa8] mt-0.5" />
                    <div>
                      <div className="font-medium">Schedule</div>
                      <div className="text-sm text-[#949fa8]">
                        {camp.schedule}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BarChart
                      size={18}
                      className="mr-3 text-[#949fa8] mt-0.5"
                    />
                    <div>
                      <div className="font-medium">Prerequisites</div>
                      <div className="text-sm text-[#949fa8]">
                        {camp.prerequisites}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users size={18} className="mr-3 text-[#949fa8] mt-0.5" />
                    <div>
                      <div className="font-medium">Enrollment</div>
                      <div className="text-sm text-[#949fa8]">
                        {camp.students} / {camp.maxStudents} students
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#1e1e24] p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Enrollment</h3>
                <div className="mb-4">
                  <div className="text-lg font-semibold">{camp.price}</div>
                  {camp.enrollmentDays > 0 && (
                    <div className="flex items-center text-sm text-[#949fa8] mt-1">
                      <Clock size={14} className="mr-2" />
                      Enrollment closes in {camp.enrollmentDays} days
                    </div>
                  )}
                </div>
                <a
                  href="https://example.com/enroll"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0092ff] text-white w-full py-3 rounded-md flex items-center justify-center font-medium"
                >
                  Enroll Now
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
              <div className="bg-[#1e1e24] p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Have Questions?</h3>
                <a
                  href="mailto:education@example.com"
                  className="text-[#0092ff] flex items-center"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Contact Instructor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
