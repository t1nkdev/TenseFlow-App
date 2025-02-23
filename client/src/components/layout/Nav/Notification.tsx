'use client';
import { useState } from 'react';
import { Bell } from 'lucide-react';
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

export default function Notification() {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
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
  );
}
