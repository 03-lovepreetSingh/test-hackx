import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Search, Bell, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
interface MainLayoutProps {
  children: React.ReactNode;
}
export function MainLayout({
  children
}: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return <div className="flex h-screen bg-[#0f0f0f] text-white">
      <Sidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} className="hidden md:block" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[#2a2a2a] flex items-center px-4 justify-between">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search for researches and audits on HackX"
                  className="w-full h-9 bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 focus:ring-blue-500 pl-9"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 flex items-center justify-center text-white font-medium">
              C
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>;
}