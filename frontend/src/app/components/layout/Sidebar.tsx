import React from 'react';
import Link from 'next/link';
import { Home, Award, Archive, Users, BookOpen, MessageSquare, Heart, MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onClose?: () => void;
}
export function Sidebar({
  className,
  isMobileOpen,
  onClose
}: SidebarProps) {
  const menuItems = [{
    icon: Award,
    label: 'Judge Dashboard',
    href: '/judge/dashboard'
  }, {
    divider: true
  }, {
    icon: Home,
    label: 'Quest',
    href: '/'
  }, {
    icon: Award,
    label: 'My Certifications',
    href: '/certifications'
  }, {
    icon: BookOpen,
    label: 'Explore Course',
    href: '/course'
  }, {
    divider: true
  }, {
    icon: Home,
    label: 'Dashboard',
    href: '/dashboard'
  }, {
    icon: X,
    label: 'Explore Hackathons',
    href: '/hackathons',
    active: true
  }, {
    icon: Archive,
    label: 'Project Archive',
    href: '/projects'
  }, {
    divider: true
  }, {
    icon: Users,
    label: 'Community Events',
    href: '/events'
  }, {
    icon: BookOpen,
    label: 'Learning Camps',
    href: '/camps'
  }, {
    icon: MessageSquare,
    label: 'Discussion & Support',
    href: '/support'
  }, {
    icon: Heart,
    label: 'Advocate Program',
    href: '/advocate'
  }, {
    icon: MoreHorizontal,
    label: 'More',
    href: '/more'
  }];
  const sidebarClasses = cn('bg-[#121212] border-r border-[#2a2a2a] flex-shrink-0 h-screen transition-all duration-300', 'md:w-64 md:static', isMobileOpen ? 'fixed inset-y-0 left-0 w-64 z-50' : 'fixed -left-64 w-64 z-50', className);
  return <>
      {/* Overlay for mobile when sidebar is open */}
      {isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />}
      <div className={sidebarClasses}>
        <div className="p-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/Logo_Container_%281%29.png" alt="HackX Logo" className="h-6 w-auto" />
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 overflow-y-auto" style={{
        maxHeight: 'calc(100vh - 70px)'
      }}>
          {menuItems.map((item, index) => item.divider ? <div key={index} className="h-px bg-[#2a2a2a] my-4" /> : <Link key={index} href={item.href} className={cn('flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1e1e1e] hover:text-white transition-colors', item.active && 'text-blue-500 bg-[#1e1e1e]')} onClick={isMobileOpen ? onClose : undefined}>
                <item.icon className="h-4 w-4 mr-3" />
                <span>{item.label}</span>
              </Link>)}
        </nav>
      </div>
    </>;
}