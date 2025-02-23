'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, BarChart2, FileText, Settings } from 'lucide-react';

const favoriteApps = [
  { 
    name: 'Create Shift Pattern',
    subtitle: 'Schedule Management',
    icon: Calendar, 
    color: 'bg-pink-700 text-white',
    hoverColor: 'group-hover:bg-blue-700'
  },
  { 
    name: 'Manage Time Off',
    subtitle: 'Leave Requests',
    icon: Clock,
    color: 'bg-pink-700 text-white',
    hoverColor: 'group-hover:bg-green-700'
  },
  { 
    name: 'Team Overview',
    subtitle: 'Staff Management',
    icon: Users,
    color: 'bg-green-700 text-white',
    hoverColor: 'group-hover:bg-purple-700'
  },
  { 
    name: 'Shift Reports',
    subtitle: 'Analytics',
    icon: BarChart2,
    color: 'bg-green-700 text-white',
    hoverColor: 'group-hover:bg-orange-700'
  },
  { 
    name: 'Shift Exchange',
    subtitle: 'Request Management',
    icon: Settings,
    color: 'bg-pink-700 text-white',
    hoverColor: 'group-hover:bg-pink-700'
  },
  { 
    name: 'Shift Guidelines',
    subtitle: 'Documentation',
    icon: FileText,
    color: 'bg-blue-700 text-white',
    hoverColor: 'group-hover:bg-blue-700'
  },
  { 
    name: 'Employee Handbook',
    subtitle: 'Policies',
    icon: FileText,
    color: 'bg-blue-700 text-white',
    hoverColor: 'group-hover:bg-blue-700'
  }
];

export default function FavoritesApps() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-3">
        <button className="text-sm font-medium text-[#0066B3] border-b-2 border-[#0066B3] pb-1 ml-3">
          Favorites
        </button>
      </div>
      
      <div className="bg-white p-1 rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-1">
          {favoriteApps.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-50">
                <div className={`p-2 rounded-lg transition-colors ${app.color} ${app.hoverColor}`}>
                  <app.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[0.9rem] font-semibold text-gray-900 leading-tight mb-0.5">{app.name}</p>
                  <p className="text-xs text-gray-500 leading-tight">{app.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
