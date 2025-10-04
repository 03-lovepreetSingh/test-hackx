import React from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { ArrowRight } from 'lucide-react';
export function FeaturedHackathon() {
  return <div className="relative w-full h-52 overflow-hidden rounded-lg bg-blue-600">
      <div className="absolute inset-0 bg-cover bg-center" style={{
      backgroundImage: "url('https://uploadthingy.s3.us-west-1.amazonaws.com/4XYtjLr5GYieiQkUFsque9/01-1-All-hackatons.png')"
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/30" />
      </div>
      <div className="relative h-full p-6 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4">
            Featured
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Open Source Frontier
          </h2>
          <p className="text-xl text-white/80">AI x WEB3 xTransparency</p>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded text-sm">
            <p className="text-white/70 text-xs">Registration close</p>
            <p className="text-white font-medium">Registration 12 days left</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded text-sm">
            <p className="text-white/70 text-xs">Tech stack</p>
            <p className="text-white font-medium">All tech stacks</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded text-sm">
            <p className="text-white/70 text-xs">Level</p>
            <p className="text-white font-medium">All levels accepted</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded text-sm">
            <p className="text-white/70 text-xs">Total prize</p>
            <p className="text-white font-medium">50,000.00 USD</p>
          </div>
        </div>
        <Button variant="default" className="absolute bottom-6 right-6 bg-white text-black hover:bg-white/90">
          Start Register <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>;
}