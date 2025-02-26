'use client';
import { useState } from 'react';
import Link from "next/link";
import { ChevronDown, Shield, Users, Building2, Settings, FileText, LayoutDashboard } from 'lucide-react';
import UserProfile from '../layout/Nav/UserProfile';

export default function AdminTopBar() {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const menuItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard',
      icon: LayoutDashboard 
    },
    { 
      name: 'User Management', 
      href: '/admin/users',
      icon: Users
    },
    { 
      name: 'Organization', 
      href: '/admin/organization',
      icon: Building2
    },
    { 
      name: 'Security', 
      href: '/admin/security',
      icon: Shield
    },
    { 
      name: 'System Settings', 
      href: '/admin/settings',
      icon: Settings
    },
    { 
      name: 'Audit Logs', 
      href: '/admin/logs',
      icon: FileText
    }
  ];

  return (
    <div className="fixed top-0 w-full z-40">
      {/* Top Navbar */}
      <div className="w-full h-16 bg-white">
        <div className="h-full mx-auto px-8 lg:px-20 flex items-center">
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 bg-[#af22da] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
                <div className="absolute -left-[18px] h-full flex">
                  <div className="h-8 w-[6px] bg-[#af22da] opacity-40"></div>
                  <div className="h-8 w-[6px] bg-[#af22da] opacity-60"></div>
                  <div className="h-8 w-[6px] bg-[#af22da] opacity-80"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[#af22da] text-xl font-bold">IntelliTense</span>
                <span className="text-xs text-gray-500">Admin Panel</span>
              </div>
            </div>

            {/* Admin Menu */}
            <div className="relative ml-8">
              <button 
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0066B3] hover:bg-white"
              >
                Administration <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {adminMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0066B3]"
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - User Profile */}
          <div className="flex-1 flex justify-end">
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Bottom Navbar - Current Section Indicator */}
      <div className="w-full h-8 bg-white border-b border-gray-200">
        <div className="h-full mx-auto px-8 lg:px-16 flex items-center">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/admin" className="hover:text-[#0066B3]">Admin</Link>
            <ChevronDown className="w-4 h-4 mx-2 rotate-[-90deg]" />
            <span className="text-[#0066B3]">Dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
