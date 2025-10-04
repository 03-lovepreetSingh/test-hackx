"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {    
  Calendar,
  Clock,
  MapPin,
  Users,
  Link as LinkIcon,
  ArrowLeft,
  Share2,
  Bookmark,
  MessageCircle,
  Award,
  CheckCircle,
  ExternalLink,
  FileText,
  User,
  Users as UsersIcon,
  HelpCircle,
  Building,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
export function HackathonDetail() {
  const { page: id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [hackathon, setHackathon] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use only dynamic data - no static fallback
  const hackData = hackathon || null

  // Fetch hackathon data
  useEffect(() => {
    if (!id) {
      setError('No hackathon ID provided')
      setLoading(false)
      return
    }

    const fetchHackathon = async () => {
      try {
        setLoading(true)
        setError(null)

        let foundHackathon = null
        let result = null

        // First try to fetch from the main API (IPFS-enabled)
        try {
          console.log('🔍 Trying main API (IPFS-enabled)...')
          const response = await fetch('/api/hackathons', {
            signal: AbortSignal.timeout(8000) // 8 second timeout
          })
          result = await response.json()

          if (result.success) {
            foundHackathon = result.data.find((h: any) => h.id === id || h.slug === id)
            if (foundHackathon) {
              console.log('✅ Found hackathon in main API:', foundHackathon.title)
            }
          }
        } catch (mainApiError) {
          console.log('❌ Main API failed, trying simple API...', mainApiError)
        }

        // If not found in main API, try simple API
        if (!foundHackathon) {
          try {
            console.log('🔍 Trying simple API...')
            const response = await fetch('/api/hackathons-simple', {
              signal: AbortSignal.timeout(5000) // 5 second timeout
            })
            result = await response.json()

            if (result.success) {
              foundHackathon = result.data.find((h: any) => h.id === id || h.slug === id)
              if (foundHackathon) {
                console.log('✅ Found hackathon in simple API:', foundHackathon.title)
              }
            }
          } catch (simpleApiError) {
            console.log('❌ Simple API also failed:', simpleApiError)
          }
        }

        if (foundHackathon) {
          setHackathon(foundHackathon)
        } else {
          setError(`Hackathon with ID "${id}" not found in either IPFS or simple storage`)
        }
      } catch (err) {
        console.error('Error fetching hackathon:', err)
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchHackathon()
  }, [id])

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center mb-4">
          <Link
            href="/dashboard/hackathons"
            className="flex items-center text-[#949fa8] hover:text-white"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Hackathons
          </Link>
        </div>
        <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0092ff] mx-auto mb-4"></div>
          <p className="text-[#949fa8]">Loading hackathon details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !hackathon) {
    return (
      <div className="space-y-8">
        <div className="flex items-center mb-4">
          <Link
            href="/dashboard/hackathons"
            className="flex items-center text-[#949fa8] hover:text-white"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Hackathons
          </Link>
        </div>
        <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-8 text-center">
          <p className="text-red-400 mb-4">{error || 'Hackathon not found'}</p>
          <Link
            href="/dashboard/hackathons"
            className="text-[#0092ff] hover:underline"
          >
            Browse other hackathons
          </Link>
        </div>
      </div>
    )
  }

  // If no hackathon data, show error state
  if (!hackData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center mb-4">
          <Link
            href="/dashboard/hackathons"
            className="flex items-center text-[#949fa8] hover:text-white"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Hackathons
          </Link>
        </div>
        <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg p-8 text-center">
          <p className="text-red-400 mb-4">Hackathon data not available</p>
          <p className="text-[#949fa8] mb-4">This hackathon may not exist or could not be loaded.</p>
          <Link
            href="/dashboard/hackathons"
            className="text-[#0092ff] hover:underline"
          >
            Browse other hackathons
          </Link>
        </div>
      </div>
    )
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-4">
        <Link
          href="/dashboard/hackathons"
          className="flex items-center text-[#949fa8] hover:text-white"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Hackathons
        </Link>
      </div>

      <div className="bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
        <div className={`bg-gradient-to-r from-[#0092ff] to-[#4ef467] p-10`}>
          <div className="flex justify-between">
            <div>
              <span
                className={`px-2 py-0.5 text-xs ${(hackData.status || 'live') === 'live' ? 'bg-[#4ef467] text-black' : (hackData.status || 'live') === 'upcoming' ? 'bg-[#0092ff] text-white' : 'bg-[#949fa8] text-black'} rounded`}
              >
                {hackData.status || 'Live'}
              </span>
              <h1 className="text-3xl font-bold mt-2">{hackData.title || 'Untitled Hackathon'}</h1>
              <p className="text-lg mt-2">{(hackData.title || 'Hackathon').split(' ')[0]} Challenge</p>
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

        <div className="border-b border-[#2a2a2e]">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'tracks' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Tracks & Prizes
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'schedule' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'rules' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Rules
            </button>

            <button
              onClick={() => setActiveTab('judges')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'judges' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Judges & Mentors
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'sponsors' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              Sponsors
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'faq' ? 'text-[#0092ff] border-b-2 border-[#0092ff]' : 'text-[#949fa8] hover:text-white'}`}
            >
              FAQ
            </button>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {activeTab === 'overview' && (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      About This Hackathon
                    </h2>
                    <p className="text-[#949fa8] whitespace-pre-line mb-6">
                      {hackData.description || 'No description available for this hackathon.'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#1e1e24] p-6 rounded-lg">
                        <h3 className="font-semibold mb-4">
                          Hackathon Details
                        </h3>
                        <ul className="space-y-3">
                          {hackData.totalPrize && (
                            <li className="flex items-start">
                              <Award
                                size={18}
                                className="mr-2 text-[#0092ff] mt-0.5"
                              />
                              <span>Total prize pool of ${hackData.totalPrize.toLocaleString()}</span>
                            </li>
                          )}
                          <li className="flex items-start">
                            <MapPin
                              size={18}
                              className="mr-2 text-[#0092ff] mt-0.5"
                            />
                            <span>Location: {hackData.location || 'TBD'}</span>
                          </li>
                          {hackData.registrationClose && (
                            <li className="flex items-start">
                              <Calendar
                                size={18}
                                className="mr-2 text-[#0092ff] mt-0.5"
                              />
                              <span>Registration closes: {hackData.registrationClose}</span>
                            </li>
                          )}
                          {hackData.techStack && (
                            <li className="flex items-start">
                              <CheckCircle
                                size={18}
                                className="mr-2 text-[#0092ff] mt-0.5"
                              />
                              <span>Tech Stack: {hackData.techStack}</span>
                            </li>
                          )}
                          {hackData.level && (
                            <li className="flex items-start">
                              <Users
                                size={18}
                                className="mr-2 text-[#0092ff] mt-0.5"
                              />
                              <span>Level: {hackData.level}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      {hackData.tags && hackData.tags.length > 0 && (
                        <div className="bg-[#1e1e24] p-6 rounded-lg">
                          <h3 className="font-semibold mb-4">
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {hackData.tags.map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="bg-[#0092ff]/10 text-[#0092ff] text-xs px-3 py-1.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'tracks' && (
                <section>
                  <h2 className="text-xl font-semibold mb-6">
                    Tracks & Prizes
                  </h2>
                  <div className="space-y-6">
                    {hackData.totalPrize && (
                      <div className="bg-[#1e1e24] p-6 rounded-lg">
                        <h3 className="font-semibold mb-4">Total Prize Pool</h3>
                        <div className="text-3xl font-bold text-[#0092ff]">
                          ${hackData.totalPrize.toLocaleString()}
                        </div>
                        <p className="text-sm text-[#949fa8] mt-2">
                          Prizes will be distributed to winners during the hackathon.
                        </p>
                      </div>
                    )}
                    <div className="bg-[#1e1e24] p-6 rounded-lg text-center">
                      <p className="text-[#949fa8]">
                        Track details and judging criteria will be announced soon.
                      </p>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'schedule' && (
                <section>
                  <h2 className="text-xl font-semibold mb-6">Schedule</h2>
                  <div className="bg-[#1e1e24] p-6 rounded-lg mb-6">
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-lg mb-2">
                        Hackathon Timeline
                      </h3>
                      <p className="text-[#949fa8]">
                        Schedule details will be announced soon.
                      </p>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'rules' && (
                <section>
                  <h2 className="text-xl font-semibold mb-6">
                    Rules & Requirements
                  </h2>
                  <div className="bg-[#1e1e24] p-6 rounded-lg">
                    <p className="text-[#949fa8]">
                      Rules and requirements will be announced soon.
                    </p>
                  </div>
                </section>
              )}
              {activeTab === 'judges' && (
                <section>
                  <h2 className="text-xl font-semibold mb-6">
                    Judges & Mentors
                  </h2>
                  <div className="bg-[#1e1e24] p-6 rounded-lg text-center">
                    <p className="text-[#949fa8]">
                      Judges and mentors will be announced soon.
                    </p>
                  </div>
                </section>
              )}
              {activeTab === 'sponsors' && (
                <section>
                  <h2 className="text-xl font-semibold mb-6">Sponsors</h2>
                  <div className="bg-[#1e1e24] p-6 rounded-lg text-center">
                    <p className="text-[#949fa8]">
                      Sponsors will be announced soon.
                    </p>
                  </div>
                </section>
              )}
              {activeTab === 'faq' && (
                <section>
                  <h2 className="text-xl font-semibold mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="bg-[#1e1e24] p-6 rounded-lg text-center">
                    <p className="text-[#949fa8]">
                      FAQ section will be updated soon.
                    </p>
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-[#1e1e24] p-6 rounded-lg sticky top-6">
                <h3 className="font-semibold mb-4">Hackathon Details</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar
                      size={18}
                      className="mr-3 text-[#949fa8] mt-0.5"
                    />
                    <div>
                      <div className="font-medium">Registration</div>
                      <div className="text-sm text-[#949fa8]">
                        {hackData.registrationClose || 'TBD'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={18} className="mr-3 text-[#949fa8] mt-0.5" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-[#949fa8]">
                        {hackData.location || 'TBD'}
                      </div>
                    </div>
                  </div>
                  {hackData.totalPrize && (
                    <div className="flex items-start">
                      <Award size={18} className="mr-3 text-[#949fa8] mt-0.5" />
                      <div>
                        <div className="font-medium">Prize Pool</div>
                        <div className="text-sm text-[#949fa8]">
                          ${hackData.totalPrize.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {hackData.techStack && (
                    <div className="flex items-start">
                      <CheckCircle
                        size={18}
                        className="mr-3 text-[#949fa8] mt-0.5"
                      />
                      <div>
                        <div className="font-medium">Tech Stack</div>
                        <div className="text-sm text-[#949fa8]">
                          {hackData.techStack}
                        </div>
                      </div>
                    </div>
                  )}
                  {hackData.level && (
                    <div className="flex items-start">
                      <Users size={18} className="mr-3 text-[#949fa8] mt-0.5" />
                      <div>
                        <div className="font-medium">Level</div>
                        <div className="text-sm text-[#949fa8]">
                          {hackData.level}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  {(hackData.status || 'live') !== 'ended' && (
                    <a
                      href="https://example.com/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0092ff] text-white w-full py-3 rounded-md flex items-center justify-center font-medium"
                    >
                      Register Now
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  )}
                </div>
              </div>
              <div className="bg-[#1e1e24] p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Share This Hackathon</h3>
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
              <div className="bg-[#1e1e24] p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Have Questions?</h3>
                <a
                  href="mailto:info@web3innovatejam.com"
                  className="text-[#0092ff] flex items-center"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Contact Organizers
                </a>
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
