'use client';
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import NavigationMenu from './NavigationMenu';
import LoaderAnimation from './LoaderAnimation';

export default function TopBar() {
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: 'Main', href: '/main', isActive: true },
    { name: 'Analytics', href: '#' },
    { name: 'Billing', href: '#' },
    { name: 'Documents', href: '/documents' },
    { name: 'Settings', href: '/settings' },
    
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHomeMenuOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (homeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [homeMenuOpen]);

  return (
    <div className="fixed top-0 w-full z-40">
      {/* Top Navbar - Grey */}
      <div className="w-full h-16 bg-white relative">
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
            <div className="relative ml-8" ref={dropdownRef}>
              <button 
                onClick={() => setHomeMenuOpen(!homeMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0066B3] hover:bg-gray-50 transition-colors"
              >
                Main <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${homeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {homeMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 overflow-hidden">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm ${
                        item.isActive 
                          ? 'bg-blue-50 text-[#0066B3] font-medium' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#0066B3]'
                      }`}
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
        {isLoading && <LoaderAnimation />}
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
