import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
interface HackathonProps {
  id: string;
  title: string;
  description: string;
  registrationDaysLeft: number;
  totalPrize: number;
  image?: string;
  isLive: boolean;
  date: string;
}
{}
export function SubmitToHackathonForm() {
  const hackathons: HackathonProps[] = [{
    id: 'web3-innovate',
    title: 'Web3 Innovate Jam',
    description: 'The Web3 Innovate Jam is designed to inspire developers, designers, and innovators to build innovative applications that integrate the MetaMask Card...',
    registrationDaysLeft: 12,
    totalPrize: 50000,
    isLive: true,
    date: 'May 10-12, 2024',
    image: "/04-3-Submit-to-Hackathon.png"
  }, {
    id: 'coindora',
    title: 'Coindora Hackfest',
    description: "Coindora Hackfest was born from a simple but radical belief: true innovation shouldn't be strangled by black-box algorithms, or centralized gatekeepers. In an era ...",
    registrationDaysLeft: 12,
    totalPrize: 50000,
    isLive: true,
    date: 'SEPTEMBER 5-9, 2024',
    image: "/04-3-Submit-to-Hackathon.png"
  }];
  return <div className="max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Submit Project to Hackathon</h2>
        <p className="text-gray-400 mb-6">
          Select an existing hackathon to submit your project to.
          <br />
          This way your project will appear in hackathon project gallery early.
          You can always submit your project to hackathon later
        </p>

        <div className="space-y-6">
          {hackathons.map(hackathon => (
            <Card key={hackathon.id} className="border-[#2a2a2a] bg-[#111111] overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-7/12">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold">{hackathon.title}</h3>
                      {hackathon.isLive && (
                        <Badge variant="default" className="uppercase text-xs bg-green-600 hover:bg-green-700">
                          Live
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      {hackathon.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          Registration close
                        </p>
                        <p className="text-sm">
                          Registration {hackathon.registrationDaysLeft} days
                          left
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tech stack</p>
                        <p className="text-sm">All tech stack</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Level</p>
                        <p className="text-sm">All levels accepted</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total prize</p>
                        <p className="text-sm">
                          {hackathon.totalPrize.toLocaleString('en-US')} USD
                        </p>
                      </div>
                    </div>
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-sm">
                      Submit to this Hackathon
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="w-full md:w-5/12 rounded-lg overflow-hidden">
                    {hackathon.id === 'web3-innovate' && <div className="bg-gradient-to-r from-purple-900 to-indigo-700 p-4 h-full flex flex-col justify-between">
                        <div className="flex justify-end">
                          <div className="flex items-center gap-1">
                            <img src="/Logo_Container_%281%29.png" alt="Panther" className="h-4" />
                            <span className="text-white text-sm">Panther</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <h4 className="text-2xl font-bold text-white">
                            Web3
                            <br />
                            Innovate Jam
                          </h4>

                          <p className="text-white text-sm">
                            AI & Blockchain Edition
                          </p>
                          <div className="mt-4">
                            <p className="text-white">$30,000 prize pool</p>
                            <p className="text-gray-300 text-xs mt-1">
                              {hackathon.date}
                            </p>
                          </div>
                        </div>
                      </div>}
                    {hackathon.id === 'coindora' && <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 h-full flex flex-col justify-between">
                        <div className="flex justify-end">
                          <div className="flex items-center gap-1">
                            <img src="/Logo_Container_%281%29.png" alt="Coindora" className="h-4" />
                            <span className="text-white text-sm">Coindora</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <h4 className="text-2xl font-bold text-white">
                            COINDORA
                            <br />
                            HACKFEST
                          </h4>
                          <p className="text-white text-sm">
                            ASTRAL COSMOS CHALLENGE
                          </p>
                          <div className="mt-4">
                            <p className="text-white">$35,000 IN PRIZES</p>
                            <p className="text-gray-300 text-xs mt-1">
                              {hackathon.date}
                            </p>
                          </div>
                        </div>
                      </div>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>;
}