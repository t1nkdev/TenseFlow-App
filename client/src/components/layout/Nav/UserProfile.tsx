'use client';
import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, HelpCircle, User, LogOut, Building2, ChevronDown, Shield, CreditCard } from 'lucide-react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Mock notifications for testing
const mockNotifications = [
  {
    id: 1,
    title: 'New Schedule Published',
    description: 'March 2024 schedule has been published',
    time: '2 hours ago',
    isRead: false
  },
  {
    id: 2,
    title: 'Shift Change Request',
    description: 'John Doe requested a shift change',
    time: '5 hours ago',
    isRead: false
  },
  {
    id: 3,
    title: 'Department Update',
    description: 'New policies added to Engineering department',
    time: '1 day ago',
    isRead: true
  }
];

export default function UserProfile() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const userName = "Andrei Draghici";
  const userRole = "Administrator";
  const companyCode = "COMP-1234";
  const userInitials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Popover className="relative">
        <Popover.Button className="relative p-1.5 text-gray-500 hover:text-[#0066B3] rounded-lg hover:bg-white focus:outline-none">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 transform">
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="bg-white">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
                      className="text-xs text-[#0066B3] hover:text-[#0066B3]/90"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex justify-between gap-2">
                        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                    </div>
                  ))}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  <button className="block w-full p-4 text-xs text-[#0066B3] hover:bg-gray-50 border-t border-gray-100">
                    View all notifications
                  </button>
                )}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      <button className="p-1.5 text-gray-500 hover:text-[#0066B3] rounded-lg hover:bg-white">
        <HelpCircle className="w-5 h-5" />
      </button>

      <button className="p-1.5 text-gray-500 hover:text-[#0066B3] rounded-lg hover:bg-white">
        <Settings className="w-5 h-5" />
      </button>
      <div className="h-6 w-px bg-gray-300"></div>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-700">{userName}</span>
            <span className="text-xs text-gray-500">{userRole}</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-sm font-medium text-white">
              {userInitials}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50 transform opacity-100 scale-100 transition-all duration-200">
            {/* User Info Section */}
            <div className="px-4 pb-3 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-base font-medium text-white">{userInitials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-medium text-gray-900">{userName}</span>
                  <span className="text-sm text-gray-500">{userRole}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">{companyCode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-2 py-2">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <Shield className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">Security</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <CreditCard className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">Billing</span>
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="px-2 py-2 border-t border-gray-100">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <User className="w-4 h-4 text-gray-400" />
                <span>Profile Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Account Preferences</span>
              </button>
            </div>

            {/* Logout Section */}
            <div className="px-2 pt-2 border-t border-gray-100">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 