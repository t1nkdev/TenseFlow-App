'use client';
import TopBar from "@/components/layout/Nav/Topbar";
import GlobalNotification from "@/components/layout/global/GlobalNotification";
import SidebarShiftTable from "@/components/schedule/SidebarShiftTable";
import { useState } from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <GlobalNotification 
        isVisible={isNotificationVisible} 
        setIsVisible={setIsNotificationVisible} 
      />
      <div className={`flex flex-1 overflow-hidden transition-padding duration-200 ease-in-out ${isNotificationVisible ? 'pt-32' : 'pt-24'}`}>
        <SidebarShiftTable />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
