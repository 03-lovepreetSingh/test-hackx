import React from 'react'
import  SidebarDashboard  from '../components/ui/SidebarDashboard'
import  HeaderDashboard  from '../components/ui/HeaderDashboard'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#16161b] text-white">
      <SidebarDashboard />
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboard />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}