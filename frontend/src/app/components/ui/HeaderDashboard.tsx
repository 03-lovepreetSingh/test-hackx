'use client';

import React, { useState } from 'react'
import { Search, Bell, LogOut, User } from 'lucide-react'
import { useSession } from '../../contexts/SessionContext'
import Link from 'next/link'

export default function HeaderDashboard() {
  const { user, logout } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await logout()
    window.location.href = '/auth/login'
  }

  return (
    <header className="border-b border-[#2a2a2e] bg-[#16161b] py-3 px-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949fa8]" />
            <input
              type="text"
              placeholder="Search for researches and audits on HackX"
              className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 pl-10 pr-4 text-sm text-[#949fa8] focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-[#949fa8] hover:text-white">
            <Bell size={20} />
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-[#949fa8] hover:text-white"
            >
              <div className="h-8 w-8 rounded-full bg-[#0092ff] flex items-center justify-center text-white text-sm font-medium">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm">{user?.username || 'User'}</span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1e1e24] border border-[#2a2a2e] rounded-md shadow-lg z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-[#949fa8] border-b border-[#2a2a2e]">
                    <div className="font-medium text-white">{user?.fullName}</div>
                    <div className="text-xs">{user?.email}</div>
                    <div className="text-xs text-[#0092ff]">{user?.role}</div>
                  </div>
                  
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-[#949fa8] hover:bg-[#2a2a2e] hover:text-white"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-[#949fa8] hover:bg-[#2a2a2e] hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
