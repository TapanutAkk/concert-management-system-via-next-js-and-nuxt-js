import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { UserProvider } from '@/context/UserContext';
import './global.css'

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html>
        <body>
            <div className="flex h-screen bg-gray-100">
              <UserProvider> 
                <Sidebar/>
              </UserProvider>
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header /> 
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                {children}
                </main>
              </div>
            </div>
        </body>
    </html>
  );
}