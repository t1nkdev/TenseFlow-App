'use client';
import { useState } from 'react';
import { 
  Users, Building2, ShieldCheck, Settings, CreditCard, FileText, 
  TrendingUp, AlertCircle, CheckCircle2, Clock, Activity
} from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminPanel() {
  const stats = [
    { 
      label: 'Total Employees',
      value: '156',
      trend: '+12%',
      trendUp: true,
      icon: Users,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      label: 'Active Departments',
      value: '12',
      trend: '+2',
      trendUp: true,
      icon: Building2,
      color: 'bg-green-50 text-green-600'
    },
    { 
      label: 'System Health',
      value: '98%',
      trend: 'Optimal',
      trendUp: true,
      icon: Activity,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const recentActivity = [
    { 
      type: 'alert',
      message: 'New security patch available',
      time: '2 minutes ago',
      icon: AlertCircle,
      color: 'text-amber-500'
    },
    { 
      type: 'success',
      message: 'System backup completed',
      time: '15 minutes ago',
      icon: CheckCircle2,
      color: 'text-green-500'
    },
    { 
      type: 'info',
      message: 'New employee onboarded',
      time: '1 hour ago',
      icon: Users,
      color: 'text-blue-500'
    }
  ];

  const quickActions = [
    { name: 'Add Employee', icon: Users, color: 'bg-blue-50 hover:bg-blue-100 text-blue-600' },
    { name: 'System Settings', icon: Settings, color: 'bg-gray-50 hover:bg-gray-100 text-gray-600' },
    { name: 'Security', icon: ShieldCheck, color: 'bg-purple-50 hover:bg-purple-100 text-purple-600' },
    { name: 'View Reports', icon: FileText, color: 'bg-green-50 hover:bg-green-100 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-6">
      <div className="max-w-full mx-4 space-y-6">
        {/* Welcome Section - More compact */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Welcome back, Admin</h1>
            <p className="mt-1 text-sm text-gray-500">Here's what's happening in your system</p>
          </div>
          <button className="px-4 py-2 bg-[#af22da] text-white rounded-lg hover:bg-[#9a1ec3] transition-colors">
            System Status
          </button>
        </div>

        {/* Stats Grid - More compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <span className={`text-base font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-base font-medium text-gray-500">{stat.label}</h3>
                  <p className="text-4xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions and Recent Activity - More compact */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Quick Actions - Takes 3 columns */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button 
                  key={action.name}
                  className={`flex flex-col items-center p-3 rounded-lg transition-colors ${action.color}`}
                >
                  <action.icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{action.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-4 rounded-lg ${activity.color} bg-opacity-10`}>
                    <activity.icon className={`w-6 h-6 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-base text-gray-900">{activity.message}</p>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Table - Full width */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <AdminTable />
        </div>
      </div>
    </div>
  );
} 