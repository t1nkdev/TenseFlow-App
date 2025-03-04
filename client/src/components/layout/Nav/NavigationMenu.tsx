'use client';
import { usePathname, useRouter } from 'next/navigation';

export default function NavigationMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveSubmenu = () => {
    const path = pathname.split('/').pop() || 'dashboard';
    return path.replace(/-/g, ' ');
  };

  const getMenuPath = (item: string) => {
    return item.toLowerCase().replace(/ /g, '-');
  };

  return (
    <div className="flex items-center gap-6">
      {[
        'Dashboard',
        'Shift Schedule',
        'Employees',
        'Reports',
        'Departments',
        'Analytics',
       
      ].map((item) => (
        <button 
          key={item}
          onClick={() => router.push(`/main/${getMenuPath(item)}`)}
          className={`px-1 py-1 border-b-2 text-sm font-medium
            ${getActiveSubmenu() === item.toLowerCase()
              ? 'border-[#0066B3] text-[#0066B3]' 
              : 'border-transparent text-gray-600 hover:text-[#0066B3]'}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
} 