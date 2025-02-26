import { ReactNode } from 'react';
import AdminTopBar from '@/components/admin/AdminTopBar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <AdminTopBar />
      <div className="mt-24 w-full max-w-full">
        {children}
      </div>
    </div>
  );
} 