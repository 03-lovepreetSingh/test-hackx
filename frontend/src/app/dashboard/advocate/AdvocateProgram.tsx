"use client"
import React, { useState } from 'react'
import {
  Award,
  Users,
  Zap,
  Globe,
  Gift,
  ArrowRight,
  Check,
  X,
  MessageSquare,
} from 'lucide-react'
export default function AdvocateProgram() {
  const [activeTab, setActiveTab] = useState('about')
  const [applyStep, setApplyStep] = useState(1)
  const benefits = [
    {
      icon: <Gift size={24} className="text-[#0092ff]" />,
      title: 'Exclusive Rewards',
      description:
        'Earn tokens, NFTs, and other rewards for your contributions to the HackX ecosystem.',
    },
    {
      icon: <Globe size={24} className="text-[#0092ff]" />,
      title: 'Network Growth',
      description:
        'Connect with industry leaders, developers, and innovators in the blockchain space.',
    },
    {
      icon: <Zap size={24} className="text-[#0092ff]" />,
      title: 'Early Access',
      description:
        'Be the first to know about and participate in new hackathons, features, and events.',
    },
    {
      icon: <Users size={24} className="text-[#0092ff]" />,
      title: 'Community Leadership',
      description:
        'Gain recognition as a leader in the Web3 community and help shape the future of HackX.',
    },
  ]
  const tiers = [
    {
      name: 'Bronze',
      points: '0-500',
      benefits: [
        'HackX community badge',
        'Access to advocate-only Discord channels',
        'Early hackathon registration',
      ],
    },
    {
      name: 'Silver',
      points: '501-1500',
      benefits: [
        'All Bronze benefits',
        'Exclusive HackX merch',
        'Featured advocate profile',
        '50% discount on premium features',
      ],
    },
    {
      name: 'Gold',
      points: '1501-5000',
      benefits: [
        'All Silver benefits',
        'Hackathon judge opportunities',
        'Free access to all premium features',
        'Monthly calls with HackX team',
      ],
    },
    {
      name: 'Platinum',
      points: '5001+',
      benefits: [
        'All Gold benefits',
        'VIP access to HackX events',
        'Co-host opportunities for webinars',
        'Revenue sharing for referred users',
        'Advisory board consideration',
      ],
    },
  ]
  const topAdvocates = [
    {
      name: 'Sarah Johnson',
      points: 7842,
      tier: 'Platinum',
      avatar: '#1565c0',
      location: 'San Francisco, USA',
    },
    {
      name: 'Michael Chen',
      points: 6251,
      tier: 'Platinum',
      avatar: '#4a148c',
      location: 'Singapore',
    },
    {
      name: 'Elena Rodriguez',
      points: 4835,
      tier: 'Gold',
      avatar: '#004d40',
      location: 'Barcelona, Spain',
    },
    {
      name: 'David Kim',
      points: 3721,
      tier: 'Gold',
      avatar: '#e65100',
      location: 'Seoul, South Korea',
    },
    {
      name: 'Aisha Patel',
      points: 2954,
      tier: 'Gold',
      avatar: '#b71c1c',
      location: 'Mumbai, India',
    },
  ]
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advocate Program</h1>
        <button
          onClick={() => {
            setActiveTab('apply')
            setApplyStep(1)
          }}
          className="bg-[#0092ff] text-white px-6 py-2 rounded-md flex items-center"
        >
          Join Program
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
      <div className="flex gap-2 border-b border-[#2a2a2e] pb-2">
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center px-4 py-2 rounded-md text-sm ${activeTab === 'about' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`flex items-center px-4 py-2 rounded-md text-sm ${activeTab === 'benefits' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Benefits
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center px-4 py-2 rounded-md text-sm ${activeTab === 'leaderboard' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => {
            setActiveTab('apply')
            setApplyStep(1)
          }}
          className={`flex items-center px-4 py-2 rounded-md text-sm ${activeTab === 'apply' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          Apply
        </button>
      </div>
      {activeTab === 'about' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-[#0092ff] to-[#4ef467] rounded-lg p-8 text-white">
            <div className="max-w-3xl">
              <Award size={48} className="mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Become a HackX Advocate
              </h2>
              <p className="text-lg mb-6">
                Join our community of passionate blockchain enthusiasts and help
                shape the future of decentralized innovation. The HackX Advocate
                Program rewards members for spreading the word, supporting
                fellow developers, and contributing to the growth of our
                platform.
              </p>
              <button
                onClick={() => {
                  setActiveTab('apply')
                  setApplyStep(1)
                }}
                className="bg-white text-[#0092ff] px-6 py-2 rounded-md font-medium"
              >
                Join the Program
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                What is the HackX Advocate Program?
              </h3>
              <p className="text-[#949fa8] mb-4">
                The HackX Advocate Program is a community-driven initiative that
                recognizes and rewards our most engaged users. As an advocate,
                you'll help promote hackathons, create educational content,
                mentor new developers, and represent HackX at events.
              </p>
              <p className="text-[#949fa8]">
                Our advocates earn points for their contributions, unlocking
                increasingly valuable rewards as they progress through the
                program tiers. From exclusive merchandise to revenue sharing
                opportunities, the benefits grow with your involvement.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">How to Earn Points</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="font-medium">Refer New Users</div>
                    <div className="text-sm text-[#949fa8]">
                      Earn 50 points for each new user who joins through your
                      referral link
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="font-medium">Create Content</div>
                    <div className="text-sm text-[#949fa8]">
                      Earn 100-500 points for blogs, tutorials, and videos
                      featuring HackX
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="font-medium">Community Support</div>
                    <div className="text-sm text-[#949fa8]">
                      Earn 25 points for each helpful response in forums and
                      discussion channels
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="font-medium">Hackathon Participation</div>
                    <div className="text-sm text-[#949fa8]">
                      Earn 200 points for each hackathon you participate in or
                      help organize
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="font-medium">Social Media Promotion</div>
                    <div className="text-sm text-[#949fa8]">
                      Earn 20-100 points for social media posts about HackX
                      events and features
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'benefits' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-6"
              >
                <div className="h-12 w-12 rounded-lg bg-[#0092ff]/10 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#949fa8]">{benefit.description}</p>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold">Advocate Tiers & Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden"
              >
                <div
                  className={`p-4 text-center ${tier.name === 'Bronze' ? 'bg-[#cd7f32]/20' : tier.name === 'Silver' ? 'bg-[#c0c0c0]/20' : tier.name === 'Gold' ? 'bg-[#ffd700]/20' : 'bg-[#e5e4e2]/20'}`}
                >
                  <h4 className="text-lg font-bold">{tier.name}</h4>
                  <div className="text-sm text-[#949fa8]">
                    {tier.points} points
                  </div>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-2 mt-0.5 flex-shrink-0">
                          <Check size={12} />
                        </div>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  How do I join the Advocate Program?
                </h4>
                <p className="text-sm text-[#949fa8]">
                  Click the "Join Program" button and complete the application
                  form. Our team reviews applications weekly, and you'll receive
                  a response within 7 days.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">How are points calculated?</h4>
                <p className="text-sm text-[#949fa8]">
                  Points are awarded for various activities, from referrals to
                  content creation. Each activity has a specific point value,
                  and your total determines your tier level.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">
                  Can I lose points or be removed from the program?
                </h4>
                <p className="text-sm text-[#949fa8]">
                  Points don't expire, but advocates who violate our community
                  guidelines or remain inactive for over 6 months may be removed
                  from the program.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">
                  How often are rewards distributed?
                </h4>
                <p className="text-sm text-[#949fa8]">
                  Digital rewards are distributed monthly, while physical
                  merchandise is shipped quarterly. Revenue sharing payments
                  occur at the end of each quarter.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2e]">
              <h3 className="text-xl font-semibold">Top Advocates</h3>
              <p className="text-sm text-[#949fa8]">
                The most active members of our advocate community
              </p>
            </div>
            <div className="divide-y divide-[#2a2a2e]">
              {topAdvocates.map((advocate, index) => (
                <div key={index} className="p-6 flex items-center">
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-full mr-4"
                    style={{
                      backgroundColor: advocate.avatar,
                    }}
                  >
                    <span className="text-white font-medium">
                      {advocate.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{advocate.name}</div>
                    <div className="text-xs text-[#949fa8]">
                      {advocate.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      <Award size={16} className="mr-2 text-[#0092ff]" />
                      <span className="font-medium">{advocate.tier}</span>
                    </div>
                    <div className="text-sm text-[#949fa8]">
                      {advocate.points.toLocaleString()} points
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-[#2a2a2e] text-center">
              <button className="bg-[#1e1e24] text-[#949fa8] px-4 py-2 rounded-md text-sm hover:bg-[#2a2a2e]">
                View Full Leaderboard
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold">Your Stats</h4>
                <div className="px-2 py-1 bg-[#1e1e24] text-[#949fa8] text-xs rounded">
                  Bronze Tier
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#949fa8]">Total Points</span>
                    <span>275 / 500</span>
                  </div>
                  <div className="w-full bg-[#1e1e24] rounded-full h-2">
                    <div
                      className="bg-[#0092ff] h-2 rounded-full"
                      style={{
                        width: '55%',
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-[#949fa8] mt-1">
                    225 points until Silver Tier
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center pt-2">
                  <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-[#949fa8]">Referrals</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-[#949fa8]">Forum Answers</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-6">
              <h4 className="font-semibold mb-4">Recent Activities</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3 mt-0.5">
                    <Users size={14} />
                  </div>
                  <div>
                    <div className="text-sm">New user referral: alex_dev</div>
                    <div className="text-xs text-[#949fa8]">
                      +50 points • 2 days ago
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3 mt-0.5">
                    <MessageSquare size={14} />
                  </div>
                  <div>
                    <div className="text-sm">
                      Forum answer: "Getting started with smart contracts"
                    </div>
                    <div className="text-xs text-[#949fa8]">
                      +25 points • 3 days ago
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3 mt-0.5">
                    <Globe size={14} />
                  </div>
                  <div>
                    <div className="text-sm">Social media post: Twitter</div>
                    <div className="text-xs text-[#949fa8]">
                      +20 points • 5 days ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-6">
              <h4 className="font-semibold mb-4">Your Referral Link</h4>
              <div className="mb-4">
                <div className="text-sm text-[#949fa8] mb-2">
                  Share this link to earn points for each new user who joins
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value="https://hackx.io/join?ref=yourusername"
                    readOnly
                    className="flex-1 bg-[#1e1e24] border border-[#2a2a2e] rounded-l-md py-2 px-4 text-sm text-[#949fa8]"
                  />
                  <button className="bg-[#0092ff] text-white px-4 py-2 rounded-r-md text-sm">
                    Copy
                  </button>
                </div>
              </div>
              <div className="text-center pt-2">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-[#949fa8]">
                  Successful Referrals
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'apply' && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              Apply to the Advocate Program
            </h2>
            <div className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full ${applyStep >= 1 ? 'bg-[#0092ff]' : 'bg-[#2a2a2e]'}`}
              ></div>
              <div
                className={`h-1 w-8 ${applyStep >= 2 ? 'bg-[#0092ff]' : 'bg-[#2a2a2e]'}`}
              ></div>
              <div
                className={`h-3 w-3 rounded-full ${applyStep >= 2 ? 'bg-[#0092ff]' : 'bg-[#2a2a2e]'}`}
              ></div>
              <div
                className={`h-1 w-8 ${applyStep >= 3 ? 'bg-[#0092ff]' : 'bg-[#2a2a2e]'}`}
              ></div>
              <div
                className={`h-3 w-3 rounded-full ${applyStep >= 3 ? 'bg-[#0092ff]' : 'bg-[#2a2a2e]'}`}
              ></div>
            </div>
          </div>
          {applyStep === 1 && (
            <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">
                Personal Information
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Twitter/X Handle (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setApplyStep(2)}
                  className="bg-[#0092ff] text-white px-6 py-2 rounded-md"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {applyStep === 2 && (
            <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">
                Experience & Interests
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How experienced are you with blockchain technology?
                  </label>
                  <select className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]">
                    <option>Beginner - Just getting started</option>
                    <option>Intermediate - Comfortable with the basics</option>
                    <option>
                      Advanced - Experienced developer or professional
                    </option>
                    <option>Expert - Deep technical knowledge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Which areas are you most interested in? (Select all that
                    apply)
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="defi" className="mr-2" />
                      <label htmlFor="defi">DeFi (Decentralized Finance)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="nft" className="mr-2" />
                      <label htmlFor="nft">NFTs and Digital Collectibles</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="dao" className="mr-2" />
                      <label htmlFor="dao">DAOs and Governance</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="identity" className="mr-2" />
                      <label htmlFor="identity">Identity and Privacy</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="gaming" className="mr-2" />
                      <label htmlFor="gaming">Blockchain Gaming</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="infrastructure"
                        className="mr-2"
                      />
                      <label htmlFor="infrastructure">
                        Web3 Infrastructure
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Have you participated in hackathons before?
                  </label>
                  <select className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]">
                    <option>Yes, multiple times</option>
                    <option>Yes, once or twice</option>
                    <option>No, but I'm interested</option>
                    <option>No, and I don't plan to</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tell us why you want to join the HackX Advocate Program
                    (100-300 words)
                  </label>
                  <textarea
                    rows={5}
                    className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setApplyStep(1)}
                  className="bg-[#1e1e24] text-[#949fa8] px-6 py-2 rounded-md hover:bg-[#2a2a2e]"
                >
                  Back
                </button>
                <button
                  onClick={() => setApplyStep(3)}
                  className="bg-[#0092ff] text-white px-6 py-2 rounded-md"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {applyStep === 3 && (
            <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">
                Contribution & Agreement
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How do you plan to contribute as an advocate? (Select all
                    that apply)
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="content" className="mr-2" />
                      <label htmlFor="content">
                        Creating content (blogs, tutorials, videos)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="social" className="mr-2" />
                      <label htmlFor="social">Social media promotion</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="community" className="mr-2" />
                      <label htmlFor="community">
                        Community support and mentoring
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="events" className="mr-2" />
                      <label htmlFor="events">
                        Organizing or speaking at events
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="feedback" className="mr-2" />
                      <label htmlFor="feedback">
                        Product feedback and testing
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="other" className="mr-2" />
                      <label htmlFor="other">
                        Other (please specify below)
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How much time can you commit to the program per week?
                  </label>
                  <select className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]">
                    <option>1-2 hours</option>
                    <option>3-5 hours</option>
                    <option>6-10 hours</option>
                    <option>10+ hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Is there anything else you'd like us to know?
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                  ></textarea>
                </div>
                <div className="bg-[#1e1e24] p-4 rounded-md">
                  <h4 className="font-medium mb-2">Advocate Agreement</h4>
                  <p className="text-sm text-[#949fa8] mb-4">
                    By submitting this application, you agree to:
                  </p>
                  <ul className="space-y-2 text-sm text-[#949fa8] mb-4">
                    <li className="flex items-start">
                      <X
                        size={16}
                        className="mr-2 text-[#949fa8] mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Not engage in any activity that could harm the
                        reputation of HackX
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X
                        size={16}
                        className="mr-2 text-[#949fa8] mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Not share confidential information about upcoming
                        features or events
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X
                        size={16}
                        className="mr-2 text-[#949fa8] mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Not make false claims about HackX or its services
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check
                        size={16}
                        className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Disclose your affiliation with HackX when promoting the
                        platform
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check
                        size={16}
                        className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Adhere to the HackX Community Guidelines and Code of
                        Conduct
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check
                        size={16}
                        className="mr-2 text-[#0092ff] mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Maintain a minimum level of activity to remain in the
                        program
                      </span>
                    </li>
                  </ul>
                  <div className="flex items-center">
                    <input type="checkbox" id="agree" className="mr-2" />
                    <label htmlFor="agree" className="text-sm">
                      I agree to the terms of the Advocate Program
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setApplyStep(2)}
                  className="bg-[#1e1e24] text-[#949fa8] px-6 py-2 rounded-md hover:bg-[#2a2a2e]"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    // Submit application logic
                    setActiveTab('about')
                  }}
                  className="bg-[#0092ff] text-white px-6 py-2 rounded-md"
                >
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
