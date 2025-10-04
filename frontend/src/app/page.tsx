'use client'

import { Button } from '@/app/components/ui/button';
import { HackathonFilters } from '@/app/components/hackathons/HackathonFilters';
import { FeaturedHackathon } from '@/app/components/hackathons/FeaturedHackathon';
import { Badge } from '@/app/components/ui/badge';
import { formatUSD } from '@/lib/utils';
import { Users, Link2 } from 'lucide-react';
import { MainLayout } from '@/app/components/layout/MainLayout';
import Link from 'next/link';

export default function Home() {
  const hackathons = [{
    id: 'chainspark',
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
  }, {
    id: 'web3-innovate',
    title: 'Web3',
    subtitle: 'Innovate Jam',
    description: 'AI & Blockchain Edition',
    details: '',
    status: 'voting',
    registrationClose: '2023-12-25',
    registrationDaysLeft: 8,
    techStack: 'All tech stack',
    level: 'All levels accepted',
    totalPrize: 30000.0,
    location: 'Online',
    date: 'May 10-12, 2024',
    bgColor: 'bg-[#121926]',
    textColor: 'text-purple-400',
    logo: 'Panther INNOVATIONS',
    participants: 320
  }, {
    id: 'coindora',
    title: 'COINDORA',
    subtitle: 'HACKFEST',
    description: 'ASTRAL COSMOS CHALLENGE',
    details: '',
    status: 'upcoming',
    registrationClose: '2024-01-15',
    registrationDaysLeft: 20,
    techStack: 'All tech stack',
    level: 'All levels accepted',
    totalPrize: 25000.0,
    location: 'Online',
    date: 'JANUARY 15-20, 2024',
    bgColor: 'bg-[#121926]',
    textColor: 'text-green-400',
    participants: 150
  }];

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
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Hackathons
            </h1>
            <p className="text-xl text-gray-600">
              Join exciting competitions and showcase your skills
            </p>
          </div>

          <HackathonFilters />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {hackathons.map((hackathon) => (
              <Link
                key={hackathon.id}
                href={`/hackathons/${hackathon.id}`}
                className="block group"
              >
                <div className={`${hackathon.bgColor} rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                  <div className={`p-6 ${hackathon.textColor}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-medium opacity-80">{hackathon.subtitle}</p>
                        <h3 className="text-2xl font-bold">{hackathon.title}</h3>
                      </div>
                      {getStatusBadge(hackathon.status)}
                    </div>

                    <p className="text-lg mb-4 opacity-90">{hackathon.description}</p>

                    {hackathon.details && (
                      <p className="text-sm mb-4 opacity-75">{hackathon.details}</p>
                    )}

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <span>{hackathon.location}</span>
                      <span>•</span>
                      <span>{hackathon.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{hackathon.participants} participants</span>
                      </div>
                      <div className="font-bold">
                        {formatUSD(hackathon.totalPrize)}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-75">
                          {hackathon.registrationDaysLeft} days left to register
                        </span>
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}