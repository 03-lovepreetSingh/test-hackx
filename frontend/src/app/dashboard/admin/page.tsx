'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Shield,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Database,
  Lock,
  Unlock,
} from 'lucide-react';

interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  totalHackathons: number;
  totalProjects: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  recentActivity: {
    id: string;
    type: 'user_registration' | 'hackathon_created' | 'project_submitted' | 'system_alert';
    description: string;
    timestamp: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  }[];
  userRoles: {
    role: string;
    count: number;
    percentage: number;
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const result = await response.json();
        
        if (result.success) {
          setUser(result.data.user);
          
          // Check if user has admin permissions
          if (result.data.user.role !== 'admin') {
            router.push('/dashboard');
            return;
          }
          
          // Load admin dashboard data
          await loadAdminData();
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadAdminData = async () => {
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockData: AdminDashboardData = {
        totalUsers: 1247,
        activeUsers: 892,
        totalHackathons: 23,
        totalProjects: 156,
        systemHealth: 'healthy',
        recentActivity: [
          {
            id: '1',
            type: 'user_registration',
            description: 'New user registered: alice_dev',
            timestamp: '2024-01-15T10:30:00Z',
            severity: 'low',
          },
          {
            id: '2',
            type: 'hackathon_created',
            description: 'New hackathon created: Web3 Innovation Summit',
            timestamp: '2024-01-15T09:15:00Z',
            severity: 'medium',
          },
          {
            id: '3',
            type: 'project_submitted',
            description: 'Project submitted: DeFi Yield Optimizer',
            timestamp: '2024-01-15T08:45:00Z',
            severity: 'low',
          },
          {
            id: '4',
            type: 'system_alert',
            description: 'High server load detected',
            timestamp: '2024-01-15T08:30:00Z',
            severity: 'high',
          },
        ],
        userRoles: [
          { role: 'Regular Users', count: 1156, percentage: 92.7 },
          { role: 'Judges', count: 45, percentage: 3.6 },
          { role: 'Organizers', count: 32, percentage: 2.6 },
          { role: 'Admins', count: 14, percentage: 1.1 },
        ],
      };
      
      setData(mockData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('Failed to load dashboard data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0092ff] mx-auto mb-4"></div>
          <p className="text-[#949fa8]">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 mb-4">Failed to load dashboard</p>
          <p className="text-[#6b7280] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-[#949fa8] mt-2">
            System overview and management for {user?.fullName}
          </p>
        </div>

        {/* System Health Alert */}
        {data?.systemHealth !== 'healthy' && (
          <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-300">
              System health: {data?.systemHealth.toUpperCase()}
            </span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-[#0092ff]/20 rounded-lg">
                <Users className="h-6 w-6 text-[#0092ff]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#949fa8]">Total Users</p>
                <p className="text-2xl font-bold text-white">{data?.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-[#4ef467]/20 rounded-lg">
                <Activity className="h-6 w-6 text-[#4ef467]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#949fa8]">Active Users</p>
                <p className="text-2xl font-bold text-white">{data?.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-[#ff6b35]/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-[#ff6b35]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#949fa8]">Hackathons</p>
                <p className="text-2xl font-bold text-white">{data?.totalHackathons}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-[#ffd700]/20 rounded-lg">
                <Database className="h-6 w-6 text-[#ffd700]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#949fa8]">Projects</p>
                <p className="text-2xl font-bold text-white">{data?.totalProjects}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg">
              <div className="p-6 border-b border-[#2a2a2e]">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {data?.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-4 bg-[#2a2a2e] rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        activity.severity === 'critical' ? 'bg-red-900/20' :
                        activity.severity === 'high' ? 'bg-orange-900/20' :
                        activity.severity === 'medium' ? 'bg-yellow-900/20' :
                        'bg-green-900/20'
                      }`}>
                        {activity.type === 'user_registration' && <Users className="h-4 w-4 text-[#0092ff]" />}
                        {activity.type === 'hackathon_created' && <BarChart3 className="h-4 w-4 text-[#ff6b35]" />}
                        {activity.type === 'project_submitted' && <Database className="h-4 w-4 text-[#4ef467]" />}
                        {activity.type === 'system_alert' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{activity.description}</p>
                        <p className="text-xs text-[#6b7280] mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.severity && (
                        <span className={`px-2 py-1 text-xs rounded ${
                          activity.severity === 'critical' ? 'bg-red-900/20 text-red-400' :
                          activity.severity === 'high' ? 'bg-orange-900/20 text-orange-400' :
                          activity.severity === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                          'bg-green-900/20 text-green-400'
                        }`}>
                          {activity.severity}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Roles & Quick Actions */}
          <div className="space-y-6">
            {/* User Roles */}
            <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg">
              <div className="p-6 border-b border-[#2a2a2e]">
                <h2 className="text-xl font-semibold text-white">User Roles</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {data?.userRoles.map((role) => (
                    <div key={role.role} className="flex items-center justify-between">
                      <div>
                        <p className="text-white">{role.role}</p>
                        <p className="text-sm text-[#949fa8]">{role.count} users</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{role.percentage}%</p>
                        <div className="w-20 bg-[#2a2a2e] rounded-full h-2 mt-1">
                          <div 
                            className="bg-[#0092ff] h-2 rounded-full" 
                            style={{ width: `${role.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1b1b1e] border border-[#2a2a2e] rounded-lg">
              <div className="p-6 border-b border-[#2a2a2e]">
                <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center p-3 text-left hover:bg-[#2a2a2e] rounded-lg transition-colors">
                    <Users className="h-5 w-5 text-[#0092ff] mr-3" />
                    <span className="text-white">Manage Users</span>
                  </button>
                  <button className="w-full flex items-center p-3 text-left hover:bg-[#2a2a2e] rounded-lg transition-colors">
                    <Shield className="h-5 w-5 text-[#4ef467] mr-3" />
                    <span className="text-white">Security Settings</span>
                  </button>
                  <button className="w-full flex items-center p-3 text-left hover:bg-[#2a2a2e] rounded-lg transition-colors">
                    <Database className="h-5 w-5 text-[#ff6b35] mr-3" />
                    <span className="text-white">Database Management</span>
                  </button>
                  <button className="w-full flex items-center p-3 text-left hover:bg-[#2a2a2e] rounded-lg transition-colors">
                    <Settings className="h-5 w-5 text-[#ffd700] mr-3" />
                    <span className="text-white">System Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
