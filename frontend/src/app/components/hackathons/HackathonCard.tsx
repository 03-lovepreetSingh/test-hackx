import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users } from 'lucide-react';
import { Hackathon } from '../../types';
import { formatUSD } from '@/lib/utils';
interface HackathonCardProps {
  hackathon: Hackathon;
  featured?: boolean;
}
export function HackathonCard({
  hackathon,
  featured = false
}: HackathonCardProps) {
  return <Link href={`/hackathons/${hackathon.id}`}>
      <Card className={`overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] hover:border-blue-500/50 transition-all ${featured ? 'col-span-2' : ''}`}>
        <div className="flex flex-col h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {hackathon.title}
                {hackathon.status && <Badge variant={hackathon.status === 'live' ? 'live' : hackathon.status === 'voting' ? 'voting' : 'ended'} className="ml-2 uppercase text-xs">
                    {hackathon.status}
                  </Badge>}
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-400 line-clamp-2 mt-1">
              {hackathon.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Registration close</p>
                <p className="font-medium">
                  Registration {hackathon.registrationDaysLeft} days left
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Tech stack</p>
                <p className="font-medium">{hackathon.techStack}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Level</p>
                <p className="font-medium">{hackathon.level}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total prize</p>
                <p className="font-medium">
                  {formatUSD(hackathon.totalPrize)} USD
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 mt-auto">
            <div className="w-full flex items-center justify-between">
              <Badge variant="outline" className="bg-[#1e1e1e] text-gray-300">
                Online
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Users className="h-3 w-3" />
                <span>400 Participants</span>
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>;
}