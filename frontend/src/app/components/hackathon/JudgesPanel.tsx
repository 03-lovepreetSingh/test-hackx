import React from 'react';
import { LinkIcon, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
interface Judge {
  email: string;
  status: 'judge' | 'pending';
  avatar?: string;
}
interface JudgesPanelProps {
  judges: Judge[];
}
export function JudgesPanel({
  judges
}: JudgesPanelProps) {
  return <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {judges.map((judge, index) => (
          <Card key={index} className="border-[#2a2a2a] bg-[#111111] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                  {judge.avatar ? <img src={judge.avatar} alt={judge.email} className="w-full h-full rounded-full" /> : judge.email.charAt(0).toUpperCase()}
                </div>
                <span>{judge.email}</span>
              </div>
              <div>
                {judge.status === 'judge' ? (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Judge</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Invite pending</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6">
          <div>
            <h3 className="text-lg font-medium mb-1">
              Invite to judge hackathon
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Invite judges via invite link or email
            </p>
            <div className="flex flex-col md:flex-row items-center mb-4">
              <div className="relative flex-1 w-full mb-2 md:mb-0">
                <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value="https://hackx.com/invite/aoiudh...1231hf"
                  readOnly
                  className="w-full p-3 pl-10 bg-[#111111] border-[#2a2a2a] text-white focus:ring-blue-500"
                />
              </div>
              <Button variant="ghost" className="md:ml-2 text-blue-400 hover:text-blue-300">
                Copy Link
              </Button>
            </div>
            <div className="text-center text-sm text-gray-400 my-2">or</div>
            <div className="flex flex-col md:flex-row items-center">
              <Input
                type="email"
                placeholder="Enter Email"
                className="flex-1 w-full mb-2 md:mb-0 p-3 bg-[#111111] border-[#2a2a2a] text-white focus:ring-blue-500"
              />
              <Button variant="ghost" className="md:ml-2 text-blue-400 hover:text-blue-300">
                Send Invite
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}