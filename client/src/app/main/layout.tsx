'use client';
import TopBar from "@/components/layout/Nav/Topbar";
import GlobalNotification from "@/components/layout/global/GlobalNotification";
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useState, useEffect } from 'react';
import { loadUserPreferences } from '@/store/features/user/userSlice';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  // Load user preferences when the app starts
  useEffect(() => {
    store.dispatch(loadUserPreferences());
  }, []);

  return (
    <Provider store={store}>
      <div className="flex flex-col h-screen">
        <TopBar />
        <GlobalNotification 
          isVisible={isNotificationVisible} 
          setIsVisible={setIsNotificationVisible} 
        />
        <div className={`flex flex-1 overflow-hidden transition-padding duration-200 ease-in-out ${isNotificationVisible ? 'pt-[132px]' : 'pt-24'}`}>
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    </Provider>
  );  
}
