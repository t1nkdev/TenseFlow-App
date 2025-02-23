'use client';
import { useState } from 'react';
import Link from "next/link";
import { ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import NavigationMenu from './NavigationMenu';

export default function TopBar() {
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);

  const menuItems = [
    { name: 'My Home', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Billing', href: '#' },
    { name: 'Employee Management', href: '#' }
  ];

  return (
    <div className="fixed top-0 w-full z-40">
      {/* Top Navbar - Grey */}
      <div className="w-full h-16 bg-white">
        <div className="h-full mx-auto px-8 lg:px-20 flex items-center">
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 bg-[#0066B3] flex items-center justify-center">
                <div className="absolute -left-[18px] h-full flex">
                  <div className="h-8 w-[6px] bg-[#66A3D8] opacity-40"></div>
                  <div className="h-8 w-[6px] bg-[#3385C6] opacity-60"></div>
                  <div className="h-8 w-[6px] bg-[#0077CC] opacity-80"></div>
                </div>
              </div>
              <span className="text-[#0066B3] text-xl font-bold">IntelliTense</span>  
            </div>

            {/* Home Dropdown */}
            <div className="relative ml-8">
              <button 
                onClick={() => setHomeMenuOpen(!homeMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0066B3] hover:bg-white"
              >
                Main <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {homeMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0066B3]"
                      onClick={() => setHomeMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 flex justify-center">
            <SearchBar />
          </div>

          {/* Right Section - Just UserProfile now */}
          <div className="flex items-center">
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Bottom Navbar - White with Submenus */}
      <div className="w-full h-8 bg-white border-b border-gray-200">
        <div className="h-full mx-auto px-8 lg:px-16 flex items-center">
          <NavigationMenu />
        </div>
      </div>
    </div>
  );
}
