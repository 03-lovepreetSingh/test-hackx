'use client'

import { MainLayout } from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Users, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function HackathonDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const hackathon = {
    id: resolvedParams.id,
    title: 'ChainSpark',
    subtitle: 'HACKATHON',
    description: 'DeFi Builders Edition',
    details: 'Smart Contracts & Financial Inclusion',
    status: 'live',
    registrationClose: '2023-12-31',
    registrationDaysLeft: 12,
    techStack: 'All tech stack',
    level: 'All levels accepted',
    totalPrize: 38000.0,
    location: 'Online',
    date: 'OCTOBER 12-16, 2024',
    bgColor: 'bg-[#121926]',
    textColor: 'text-yellow-400',
    participants: 405
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge variant="default" className="bg-green-500 text-white">LIVE</Badge>;
      case 'voting':
        return <Badge variant="default" className="bg-purple-500 text-white">VOTING</Badge>;
      case 'upcoming':
        return <Badge variant="default" className="bg-blue-500 text-white">UPCOMING</Badge>;
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className={`${hackathon.bgColor} ${hackathon.textColor}`}>
          <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-lg font-medium opacity-80 mb-2">{hackathon.subtitle}</p>
                <h1 className="text-5xl font-bold mb-4">{hackathon.title}</h1>
                <p className="text-2xl opacity-90">{hackathon.description}</p>
                {hackathon.details && (
                  <p className="text-lg opacity-75 mt-2">{hackathon.details}</p>
                )}
              </div>
              {getStatusBadge(hackathon.status)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-75">Date</p>
                  <p className="font-semibold">{hackathon.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-75">Location</p>
                  <p className="font-semibold">{hackathon.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-75">Participants</p>
                  <p className="font-semibold">{hackathon.participants}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-75">Prize Pool</p>
                  <p className="font-semibold">${hackathon.totalPrize.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href={`/hackathons/${hackathon.id}/register`}>
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  Register Now
                </Button>
              </Link>
              <Link href={`/hackathons/${hackathon.id}/projects`}>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                  View Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-6">About This Hackathon</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-4">
                  Join us for an exciting hackathon focused on DeFi innovation and financial inclusion.
                  This event brings together developers, designers, and entrepreneurs to build the future of decentralized finance.
                </p>
                <h3 className="text-xl font-semibold mb-3">What You'll Build</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Smart contracts for decentralized applications</li>
                  <li>Financial inclusion tools for underserved communities</li>
                  <li>Innovative DeFi protocols and mechanisms</li>
                  <li>User-friendly interfaces for complex financial systems</li>
                </ul>
                <h3 className="text-xl font-semibold mb-3 mt-6">Prize Categories</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>1st Place: $20,000</li>
                  <li>2nd Place: $10,000</li>
                  <li>3rd Place: $5,000</li>
                  <li>Best DeFi Innovation: $3,000</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Important Dates</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Closes</span>
                    <span className="font-semibold">Dec 31, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hackathon Starts</span>
                    <span className="font-semibold">Oct 12, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submission Deadline</span>
                    <span className="font-semibold">Oct 16, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Winners Announced</span>
                    <span className="font-semibold">Oct 20, 2024</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">
                      {hackathon.registrationDaysLeft} days left to register!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Navigation</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href={`/hackathons/${hackathon.id}`} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">Overview</h3>
                <p className="text-gray-600 text-sm">General information and details</p>
              </Link>
              <Link href={`/hackathons/${hackathon.id}/schedule`} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">Schedule</h3>
                <p className="text-gray-600 text-sm">Timeline and important dates</p>
              </Link>
              <Link href={`/hackathons/${hackathon.id}/projects`} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">Projects</h3>
                <p className="text-gray-600 text-sm">Browse submitted projects</p>
              </Link>
              <Link href={`/hackathons/${hackathon.id}/prize-judge`} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">Judges & Prizes</h3>
                <p className="text-gray-600 text-sm">Meet the judges and prize details</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}